import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddToCartDTO } from './dto/addtocart.dto';
import { Cart } from './entities/cart.entity';
import { Product } from '../product/entities/product.entity';
import { Customer } from '../customer/entities/customer.entity';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        CartService,
        CustomerService,
        ProductService,
        {
          provide: getRepositoryToken(Cart),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Customer),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new cart', async () => {
      const createCartDto: CreateCartDto = {
        customerId: 1,
      };
      const createdCart: Cart = {
        id: 1,
        totalItem: 0,
        totalPrice: 0,
        status: 'pending',
        customer: null,
        products: [],
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdCart);

      expect(await controller.create(createCartDto)).toEqual(createdCart);
    });
  });

  describe('addToCart', () => {
    it('should add product to cart', async () => {
      const addToCartDto: AddToCartDTO = {
        cartId: 1,
        productId: 1,
      };
      const product: Product = {
        id: 1,
        name: 'Product 1',
        inventoryCount: 10,
        pointCost: 5,
        customers: [],
        carts: [],
      };
      const updatedCart: Cart = {
        id: 1,
        totalItem: 1,
        totalPrice: 10,
        status: 'pending',
        customer: null,
        products: [product],
      };

      jest.spyOn(service, 'addToCart').mockResolvedValue(updatedCart);

      expect(await controller.addToCart(addToCartDto)).toEqual(updatedCart);
    });
  });

  describe('checkoutCart', () => {
    it('should checkout cart', async () => {
      const cartId = 1;
      const checkedOutCart: Cart = {
        id: cartId,
        totalItem: 0,
        totalPrice: 0,
        status: 'checked-out',
        customer: null,
        products: [],
      };

      jest.spyOn(service, 'checkOutCart').mockResolvedValue(checkedOutCart);

      expect(await controller.checkoutCart(cartId)).toEqual(checkedOutCart);
    });
  });
});
