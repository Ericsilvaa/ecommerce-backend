import { Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../config/db/datasource";
import Link from "../../entity/link.entity";

export default class LinkController {
  private repository: Repository<Link> = AppDataSource.getRepository(Link);

  async link(req: Request, res: Response) {
    const links = await this.repository.find({
      where: { user: { id: +req.params.id } },
      relations: ['orders', 'orders.order_item']
    });

    res.send(links);
  }

  async link_embassador(req: Request, res: Response) {
    const links = await this.repository.save({
      user: { id: +req.user.id },
      code: Math.random().toString(36).substring(6),
      products: req.body.products.map((id: any) => ({ id })),
    });

    res.send(links)
  }

  async Stats(req: Request, res: Response) {
    const links = await this.repository.find({
      where: { user: { id: +req.user.id } },
      relations: ['orders', 'orders.order_item']
    });

    res.send(links.map(link => {
      const orders = link.orders.filter(o => o.complete)

      const revenue = orders.reduce(
        (s, o) => s + o.ambassador_revenue,
        0
      );

      return {
        code: link.code,
        count: orders.length,
        revenue
      }
    }))
  }

  async getLink(req: Request, res: Response) {
    const link = await this.repository.findOne({ where: { code: req.params.code }, relations: ['user', 'products'] })

    res.send(link)
  }

}
