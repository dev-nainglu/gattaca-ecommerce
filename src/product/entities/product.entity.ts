import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { Cart } from '../../cart/entities/cart.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  inventoryCount: number;

  @Column()
  pointCost: number;

  @ManyToMany(() => Customer, (customer) => customer.products)
  customers: Customer[];

  @ManyToMany(() => Cart, (cart) => cart.products)
  carts: Cart[];
}
