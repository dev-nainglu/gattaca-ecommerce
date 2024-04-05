import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async findOne(id): Promise<Customer> {
    return this.customerRepository.findOne({ where: { id } });
  }

  async save(customer: Customer): Promise<Customer> {
    return this.customerRepository.save(customer);
  }

  async findOneWithProducts(id: number): Promise<Customer> {
    const customer = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.products', 'product')
      .where('customer.id = :customerId', { customerId: id })
      .getOne();

    return customer;
  }

  async rewardPoint(id: number, point: number): Promise<Customer> {
    const customer = await this.findOne(id);
    const updatedPoint = customer.walletBalance + point;

    customer.walletBalance = updatedPoint;

    return await this.customerRepository.save(customer);
  }

  async transferPoint(
    transferrerId: number,
    receiverId: number,
    point: number,
  ): Promise<Customer> {
    const tranferrer = await this.findOne(transferrerId);
    const receiver = await this.findOne(receiverId);
    const transferredPoint = tranferrer.walletBalance - point;
    const receivedPoint = receiver.walletBalance + point;

    tranferrer.walletBalance = transferredPoint;
    receiver.walletBalance = receivedPoint;

    await this.customerRepository.save(tranferrer);

    return await this.customerRepository.save(receiver);
  }

  async checkBalance(id: number): Promise<number> {
    const customer = await this.findOne(id);

    return customer.walletBalance;
  }

  async reducePoint(id: number, point: number): Promise<Customer> {
    const customer = await this.findOne(id);
    const reducedPoint = customer.walletBalance - point;

    customer.walletBalance = reducedPoint;

    return await this.customerRepository.save(customer);
  }
}
