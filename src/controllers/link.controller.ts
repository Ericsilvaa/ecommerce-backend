import { Repository } from "typeorm";
import Link from "../entity/link.entity";
import { AppDataSource } from "../db/datasource";
import { Request, Response } from "express";
import User from "../entity/user.entity";

export default class ProductController {
  private repository: Repository<Link> = AppDataSource.getRepository(Link);

  async link(req: Request, res: Response) {

    const links = await this.repository.find({
      where: { user: { id: +req.params.id } },
      relations: ['orders', 'orders.order_item']
    });

    res.send(links);
  }
}
