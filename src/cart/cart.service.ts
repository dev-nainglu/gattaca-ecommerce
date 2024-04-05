import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddToCartDTO } from '../cart/dto/addtocart.dto';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
  ) {}

  async findOne(id): Promise<Cart> {
    return this.cartRepository.findOne({ where: { id } });
  }

  async findOneWithProducts(id: number): Promise<Cart> {
    const cart = await this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.products', 'product')
      .where('cart.id = :cartId', { cartId: id })
      .getOne();

    return cart;
  }

  async create(cartDTO: CreateCartDto): Promise<Cart> {
    const cart = new Cart();
    cart.status = 'pending';

    return await this.cartRepository.save(cart);
  }

  async addToCart(addToCart: AddToCartDTO): Promise<Cart> {
    // Retrieve cart and product entities
    const cart = await this.findOneWithProducts(addToCart.cartId);

    const product = await this.productService.findOne(addToCart.productId);

    if (!cart || !product) {
      throw new Error('Cart or product not found');
    }
    // Check if product is already in the cart
    const productExistsInCart = cart.products.some(
      (p) => p.id === addToCart.productId,
    );
    if (!productExistsInCart) {
      cart.products.push(product); // Add product to cart
      await this.cartRepository.save(cart); // Save changes
    }

    return cart;
  }

  async checkOutCart(cartId: number): Promise<Cart> {
    //check user total balance and cart total
    const cart = await this.findOne(cartId);
    const balance = await this.customerService.checkBalance(cart.customer.id);

    if (cart.totalPrice > balance) {
      throw new Error('low balance');
    }
    try {
      for (const product of cart.products) {
        await this.checkOutProduct(
          product.id,
          product.pointCost,
          cart.customer.id,
        );
        console.log(`Processing product: ${product.name}`);
      }

      // Clear cart after processing all products
      cart.products = [];
      await this.cartRepository.save(cart);
    } catch {
      throw new Error('error checkout');
    }

    return cart;
  }

  async checkOutProduct(
    productId: number,
    totalCost: number,
    customerId: number,
  ): Promise<Product> {
    try {
      //check product is instock
      const productAvailable = this.productService.isAvailable(productId);

      if (!productAvailable) {
        throw new Error('Product is out of stock');
      }

      await this.productService.reduceInventory(productId);

      //deduct point from wallet
      await this.customerService.reducePoint(customerId, totalCost);

      //add product to customer owning
      const customer =
        await this.customerService.findOneWithProducts(customerId);
      const product = await this.productService.findOne(productId);

      customer.products.push(product);
      await this.customerService.save(customer);

      return product;
    } catch {
      throw new Error('error checkout product');
    }
  }
}
