import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalItem: number;

  @Column()
  totalPrice: number;

  @Column()
  status: string;

  @OneToOne(() => Customer, (customer) => customer.cart)
  @JoinColumn()
  customer: Customer;

  @ManyToMany(() => Product, { cascade: true })
  @JoinTable()
  products: Product[];
}
