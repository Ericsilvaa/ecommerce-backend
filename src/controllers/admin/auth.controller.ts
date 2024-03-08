import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { sign } from "jsonwebtoken";

import User from "../../entity/user.entity";
import UserRepository from "../../repositories/user.repository";
import Product from "../../entity/product.entity";

export default class AuthController {
  private repository: UserRepository;
  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async registerUser(req: Request, res: Response) {
    const { password, password_confirm, ...body } = req.body;
    const is_ambassador = req.baseUrl === `${process.env.BASE_URL_AMBASSADOR}`;

    console.log(
      "🚀 ~ AuthController ~ registerUser ~ is_ambassador:",
      is_ambassador
    );
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
    try {
      const user = (await this.repository.getOneRegister({
        id: Number(req.user),
      })) as User;

      res.send(user);
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
    // const ambassadors = await this.repository.getAllRegister({ where: { is_ambassador: true } })

    res.send([]);
  }
}
