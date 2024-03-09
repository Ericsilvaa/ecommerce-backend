import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import User from "./user.entity";
import Product from "./product.entity";
import OrderItem from "./order-item.entity";
import Link from "./link.entity";

@Entity()
export default class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  transaction_id?: string;

  @Column()
  user_id!: number;

  @Column({ unique: true })
  code: string;

  @Column()
  ambassador_email: string

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Column()
  email: string

  @Column({ nullable: true })
  address?: string

  @Column({ nullable: true })
  country?: string

  @Column({ nullable: true })
  city?: string

  @Column({ nullable: true })
  zipcode?: string

  @Column({ default: false })
  complete!: boolean

  @CreateDateColumn()
  created_at!: string

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  order_items!: OrderItem[]

  @ManyToOne(() => Link, link => link.orders, { createForeignKeyConstraints: false })
  @JoinColumn({ referencedColumnName: 'code', name: 'code' })
  link!: Link

  constructor(code: string, ambassador_email: string, first_name: string, last_name: string, email: string) {
    this.ambassador_email = ambassador_email
    this.first_name = first_name
    this.last_name = last_name
    this.email = email
    this.code = code;
  }

  get name(): string {
    return this.first_name + ' ' + this.last_name
  }

  get total(): number {
    return this.order_items.reduce((s, item) => s + item.admin_revenue, 0)
  }

  get ambassador_revenue(): number {
    return this.order_items.reduce((s, item) => s + item.ambassador_revenue, 0)
  }
}
