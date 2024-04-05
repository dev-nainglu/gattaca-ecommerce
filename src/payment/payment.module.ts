import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CustomerService } from '../customer/customer.service';
import { Customer } from '../customer/entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Customer]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, ProductService, ConfigService, CustomerService],
})
export class PaymentModule {}
