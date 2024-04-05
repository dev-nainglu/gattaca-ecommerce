import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  walletBalance: number;

  @OneToOne(() => Cart, (cart) => cart.customer)
  cart: Cart;

  @ManyToMany(() => Product, (product) => product.customers)
  @JoinTable()
  products: Product[];
}
