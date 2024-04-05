import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddToCartDTO } from '../cart/dto/addtocart.dto';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { Product } from '../product/entities/product.entity';
import { Customer } from '../customer/entities/customer.entity';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<Cart>;
  let customerRepository: Repository<Customer>;
  let productRepository: Repository<Product>;
  let customerService: CustomerService;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          useClass: Repository, // Provide a mock implementation for ProductRepository
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    customerRepository = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    customerService = module.get<CustomerService>(CustomerService);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
        customer: {
          id: 1,
          name: 'Naing',
          walletBalance: 100,
          cart: null,
          products: [],
        },
        products: [],
      };

      jest.spyOn(cartRepository, 'save').mockResolvedValue(createdCart);

      expect(await service.create(createCartDto)).toEqual(createdCart);
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
      const cart: Cart = {
        id: 1,
        totalItem: 1,
        totalPrice: 10,
        status: 'pending',
        customer: {
          id: 1,
          name: 'Naing',
          walletBalance: 100,
          cart: null,
          products: [],
        },
        products: [product],
      };

      jest.spyOn(service, 'findOneWithProducts').mockResolvedValue(cart);
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);

      expect(await service.addToCart(addToCartDto)).toEqual(cart);
    });
  });
});
