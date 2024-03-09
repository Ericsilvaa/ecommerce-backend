import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Order from "./order.entity";

@Entity()
export default class OrderItem {

  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  product_title!: string

  @Column()
  price!: string

  @Column()
  quantity!: number

  @Column()
  ambassador_revenue!: number

  @Column()
  admin_revenue!: number

  @ManyToOne(() => Order, order => order.order_items)
  @JoinColumn({ name: 'order_id' })
  order!: Order

}