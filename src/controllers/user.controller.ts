
import { Request, Response } from "express";
import UserRepository from "../repositories/user.repository";


export default class UserController {
  private repository: UserRepository;
  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async Ambassadors(req: Request, res: Response) {

    const ambassadors = await this.repository.getAllRegister({ where: { is_ambassador: true } })

    res.send(ambassadors)

  }

}