import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customer/entities/customer.entity';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      jest.spyOn(service, 'findOne').mockResolvedValue(customer);

      expect(await controller.findOne(1)).toEqual(customer);
    });
  });

  describe('transferPoint', () => {
    it('should transfer points between customers', async () => {
      const transferrerId = 1;
      const receiverId = 2;
      const point = 50;
      const receiver = { id: receiverId, walletBalance: 50 };
      const updatedReceiver = {
        ...receiver,
        walletBalance: 100,
        name: 'Naing',
        cart: null,
        products: [],
      };

      jest.spyOn(service, 'transferPoint').mockResolvedValue(updatedReceiver);

      expect(
        await controller.transferPoint(receiverId, transferrerId, point),
      ).toEqual(updatedReceiver);
    });
  });
});
