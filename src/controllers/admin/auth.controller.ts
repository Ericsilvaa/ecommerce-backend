import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { sign } from "jsonwebtoken";

import User from "../../entity/user.entity";
import Product from "../../entity/product.entity";
import AuthRepository from "../../repositories/auth.repository";
import Order from "../../entity/order.entity";

type user_revenue = User & { revenue: number };

export default class AuthController {
  private repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async registerUser(req: Request, res: Response) {
    const { password, password_confirm, ...body } = req.body;
    const is_ambassador = req.baseUrl === `${process.env.BASE_URL_AMBASSADOR}`;

    if (password !== password_confirm) {
      return res.status(400).send({ message: `Password's do not match` });
    }

    const user = this.repository.createRegister({
      ...body,
      password: await bcryptjs.hash(password, 10),
      is_ambassador,
    });

    res.send(user);
  }

  async loginUser(req: Request, res: Response) {
    // admin user, you can log in the ambassador site
    const adminRouteLogin = req.baseUrl === `${process.env.BASE_URL_ADMIN}`;

    const user = await this.repository.getOneRegister(
      {
        email: req.body.email,
      },
      { select: ["id", "password", "is_ambassador"] }
    );

    if (!user) {
      return res.status(400).send({
        message: "Invalid credentials",
      });
    }

    if (!(await bcryptjs.compare(req.body.password, user.password))) {
      return res.status(400).send({
        message: "Invalid credentials",
      });
    }

    // ambassador user, cannot log in admin site
    if (user.is_ambassador && adminRouteLogin) {
      return res.status(401).send({
        message: "unauthorized",
      });
    }

    const token = sign(
      { id: user.id, scope: adminRouteLogin ? "admin" : "ambassador" },
      process.env.SECRET_KEY!
    );

    res.cookie("jwt", token, { httpOnly: true, maxAge: 1 * 60 * 60 * 1000 });
    res.send({
      message: "success",
    });
  }

  async logout(req: Request, res: Response) {
    res.cookie("jwt", "", { maxAge: 0 });
    res.send({
      message: "success",
    });
  }

  async AuthenticatedUser(req: Request, res: Response) {
    const pathname = req.baseUrl + req.path;

    const adminRouteUser = pathname === `${process.env.BASE_URL_ADMIN}/user`;
    try {
      const user = (await this.repository.getOneRegister({
        id: Number(req.user),
      })) as User;

      if (adminRouteUser) {
        return res.send(user);
      }

      // if ambassador site
      const { revenue } = await this.getUserOrders(user.id, true)

      const user_revenue = {
        ...user,
        revenue
      }

      res.send(user_revenue)
    } catch (error) {
      return res.status(401).send({
        message: "Unauthenticated",
      });
    }
  }

  async UpdateInfo(req: Request, res: Response) {
    const user_id = <Partial<Product>>Number(req.user);

    const { affected, dataUpdated } = await this.repository.updateRegister(
      user_id,
      req.body
    );

    res.send(dataUpdated);
  }

  async UpdatePassword(req: Request, res: Response) {
    const { password, password_confirm } = req.body;
    const user_id = req.user;

    if (password !== password_confirm) {
      return res.status(400).send({ message: `Password's do not match` });
    }

    const { affected, dataUpdated } = await this.repository.updateRegister(
      user_id,
      { password: await bcryptjs.hash(password, 10) }
    );

    res.send(dataUpdated);
  }

  async Ambassadors(req: Request, res: Response) {
    const ambassadors = await this.repository.getAllRegister({ is_ambassador: true })

    res.send(ambassadors);
  }

  async rankings(req: Request, res: Response) {
    const ambassadors = await this.repository.getAllRegister({ is_ambassador: true })

    const ranking = ambassadors.map(async ambassador => {
      const { revenue } = await this.getUserOrders(ambassador.id, true)

      return {
        name: ambassador.name,
        revenue
      }
    })

    res.send(ranking);
  }


  private async getUserOrders(userId: any, complete: boolean) {
    const orders = await this.repository.getUserwithRevenue(
      {
        user_id: userId,
        complete
      },
      { relations: ["order_items"] }
    );


    const revenue = orders.reduce(
      (s, o) => s + o.ambassador_revenue,
      0
    );

    return { orders, revenue }
  }

}
