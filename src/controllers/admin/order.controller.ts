import { Repository } from "typeorm";
import { AppDataSource } from "../../config/db/datasource";
import { Request, Response } from "express";
import Order from "../../entity/order.entity";
import Link from "../../entity/link.entity";
import Product from "../../entity/product.entity";
import OrderItem from "../../entity/order-item.entity";

export default class OrderController {
  private repository: Repository<Order> = AppDataSource.getRepository(Order);
  private repositoryLink: Repository<Link> = AppDataSource.getRepository(Link);
  private repositoryProducts: Repository<Product> =
    AppDataSource.getRepository(Product);
  private repositoryOrderItem: Repository<OrderItem> =
    AppDataSource.getRepository(OrderItem);

  async Orders(req: Request, res: Response) {
    const orders = await this.repository.find({
      where: { complete: true },
      relations: ["order_items"],
    });

    res.send(
      orders.map((order) => ({
        id: order.id,
        name: order.name,
        email: order.email,
        total: order.total,
        created_at: order.created_at,
        order_items: order.order_items,
      }))
    );
  }

  async CreateOrder(req: Request, res: Response) {
    const body = req.body;

    const link = await this.repositoryLink.findOne({
      where: { code: body.code },
      relations: ["user"],
    });

    if (!link) {
      return res.status(400).send({ message: "Invalid Link" });
    }

    const order = this.repository.create({
      user_id: link.user.id,
      ambassador_email: link.user.email,
      code: body.code,
      first_name: body.first_name,
      last_name: body.last_name,
      address: body.address,
      country: body.country,
      city: body.city,
      zipcode: body.zipcode,
    });

    const newOrder = await this.repository.save(order);

    for (let p of body.products) {
      const product = (await this.repositoryProducts.findOne(
        p.product_id
      )) as Product & { quantity: number };

      const orderItem = this.repositoryOrderItem.create({
        order: newOrder,
        product_title: product?.title,
        price: product?.price,
        quantity: product?.quantity,
        ambassador_revenue: 0.1 * parseInt(product.price) * product.quantity,
        admin_revenue: 0.9 * parseInt(product.price) * product.quantity
      });

      await this.repositoryOrderItem.save(orderItem)
    }

    res.send(newOrder)
  }
}
