import { Request, Response } from "express";
import Stripe from "stripe";
import { AppDataSource } from "../../config/db/datasource";
import { Repository } from "typeorm";

import Order from "../../entity/order.entity";
import Link from "../../entity/link.entity";
import Product from "../../entity/product.entity";
import OrderItem from "../../entity/order-item.entity";
import { client } from "../..";
import User from "../../entity/user.entity";
import { createTransport } from 'nodemailer'

export default class OrderController {
  private repository: Repository<Order> = AppDataSource.getRepository(Order);
  private repositoryUser: Repository<User> = AppDataSource.getRepository(User);
  private repositoryLink: Repository<Link> = AppDataSource.getRepository(Link);
  private repositoryProducts: Repository<Product> =
    AppDataSource.getRepository(Product);
  private repositoryOrderItem: Repository<OrderItem> =
    AppDataSource.getRepository(OrderItem);
  private queryRunner = AppDataSource.createQueryRunner()


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


    try {

      await this.queryRunner.connect()
      await this.queryRunner.startTransaction()

      let order = this.repository.create({
        user_id: link.user.id,
        ambassador_email: link.user.email,
        code: body.code,
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        address: body.address,
        country: body.country,
        city: body.city,
        zipcode: body.zipcode,
      });

      order = await this.queryRunner.manager.save(order)

      const line_items: any[] = []

      for (let p of body.products) {
        const product = (await this.repositoryProducts.findOne({ where: { id: p.product_id } })) as Product & { quantity: number };

        const orderItem = this.repositoryOrderItem.create({
          product_title: product.title,
          price: product.price,
          quantity: p.quantity,
          ambassador_revenue: 0.1 * parseInt(product.price) * p.quantity,
          admin_revenue: 0.9 * parseInt(product.price) * p.quantity,
          order,
        });

        await this.queryRunner.manager.save(orderItem)

        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              description: product.description,
              images: [product.image],
            },
            unit_amount: parseInt(product.price),
          },
          quantity: p.quantity
        })
      }

      const key = process.env.STRIPE_SECRET_KEY as string
      const stripe = new Stripe(key)

      const source = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items,
        success_url: `${process.env.CHECKOUT_URL}/sucess?source={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CHECKOUT_URL}/error`
      })

      order.transaction_id = source['id']
      await this.queryRunner.manager.save(order)

      await this.queryRunner.commitTransaction()

      res.send(source)
    } catch (error) {
      await this.queryRunner.rollbackTransaction()

      return res.status(400).send({ message: error });

    }

  }

  async ConfirmOrder(req: Request, res: Response) {
    const order = await this.repository.findOne({ where: { transaction_id: req.body.source }, relations: ['order_items'] })

    if (!order) {
      return res.status(404).send({ message: 'Order not found' })
    }

    await this.repository.update(order.id, { complete: true })

    const user = await this.repositoryUser.findOne({ where: { id: order.user_id } }) as User

    // increse the rankings manager by redis
    await client.zIncrBy('rankings', order.ambassador_revenue, user.name)

    const transporter = createTransport({
      host: '127.0.0.1',
      port: 1025
    });

    // when we confirmed an order, we'll send two emails
    await transporter.sendMail({
      from: 'from@example.com',
      to: 'admin@admin.com',
      subject: 'An order has been completed',
      html: `Order #${order.id} with a total of $${order.total} has been completed`
    })

    await transporter.sendMail({
      from: 'from@example.com',
      to: order.ambassador_email,
      subject: 'An order has been completed',
      html: `You earned $${order.ambassador_revenue} from the link #${order.code}`
    })


    transporter.close()

    return res.status(404).send({ message: 'Success' })
  }


}
