import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../cart/entities/cart.entity';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { Product } from '../product/entities/product.entity';
import { Customer } from '../customer/entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Customer]),
  ],
  controllers: [CartController],
  providers: [CartService, CustomerService, ProductService],
})
export class CartModule {}
