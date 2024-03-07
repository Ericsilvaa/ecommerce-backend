import { Repository } from "typeorm";
import Link from "../entity/link.entity";
import { AppDataSource } from "../db/datasource";
import { Request, Response } from "express";
import User from "../entity/user.entity";
import Order from "../entity/order.entity";

export default class OrderController {
  private repository: Repository<Order> = AppDataSource.getRepository(Order);

  async Orders(req: Request, res: Response) {
    const orders = await this.repository.find({ where: { complete: true }, relations: ['order_items'] })

    res.send(orders.map(order => ({
      id: order.id,
      name: order.name,
      email: order.email,
      total: order.total,
      created_at: order.created_at,
      order_items: order.order_items
    })));
  }
}
