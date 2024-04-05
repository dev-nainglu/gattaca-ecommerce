import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customer/entities/customer.entity';

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: Repository<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a customer by ID', async () => {
      const customer = {
        id: 1,
        name: 'John Doe',
        walletBalance: 100,
        cart: null,
        products: [],
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(customer);

      expect(await service.findOne(1)).toEqual(customer);
    });
  });

  describe('reducePoint', () => {
    it('should reduce points from a customer', async () => {
      const customerId = 1;
      const point = 50;
      const customer = {
        id: customerId,
        name: 'John',
        walletBalance: 100,
        cart: null,
        products: [],
      };
      const reducedCustomer = { ...customer, walletBalance: 50 };

      jest.spyOn(repository, 'findOne').mockResolvedValue(customer);
      jest.spyOn(repository, 'save').mockResolvedValue(reducedCustomer);

      expect(await service.reducePoint(customerId, point)).toEqual(
        reducedCustomer,
      );
    });
  });

  describe('rewardPoint', () => {
    it('should reward points to a customer', async () => {
      const customerId = 1;
      const point = 50;
      const customer = {
        id: customerId,
        walletBalance: 100,
        name: 'Naing',
        cart: null,
        products: [],
      };
      const rewardedCustomer = { ...customer, walletBalance: 150 };

      jest.spyOn(repository, 'findOne').mockResolvedValue(customer);
      jest.spyOn(repository, 'save').mockResolvedValue(rewardedCustomer);

      expect(await service.rewardPoint(customerId, point)).toEqual(
        rewardedCustomer,
      );
    });
  });

  describe('checkBalance', () => {
    it('should return the wallet balance of a customer', async () => {
      const customerId = 1;
      const walletBalance = 100;
      const customer = {
        id: customerId,
        name: 'Naing',
        walletBalance,
        cart: null,
        products: [],
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(customer);

      expect(await service.checkBalance(customerId)).toEqual(walletBalance);
    });
  });
});
