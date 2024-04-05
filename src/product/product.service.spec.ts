import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/create-product';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const productDto: CreateProductDTO = {
        name: 'Test Product',
        pointCost: 10,
        inventoryCount: 100,
      };

      const createdProduct: Product = {
        id: 1,
        ...productDto,
        customers: [],
        carts: null,
      };

      jest.spyOn(repository, 'save').mockResolvedValue(createdProduct);

      const result = await service.create(productDto);

      expect(result).toEqual(createdProduct);
    });
  });

  describe('findOne', () => {
    it('should find a product by id', async () => {
      const productId = 1;

      const foundProduct: Product = {
        id: productId,
        name: 'Test Product',
        pointCost: 10,
        inventoryCount: 100,
        customers: null,
        carts: null,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(foundProduct);

      const result = await service.findOne(productId);

      expect(result).toEqual(foundProduct);
    });

    it('should return undefined if product is not found', async () => {
      const productId = 999;

      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      const result = await service.findOne(productId);

      expect(result).toBeUndefined();
    });
  });

  // Add more test cases for other service methods (update, remove, isAvailable, reduceInventory) following a similar pattern
});
