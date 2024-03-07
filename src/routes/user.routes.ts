import { Router } from "express";
import UserController from "../controllers/user.controller";
import UserRepository from "../repositories/user.repository";

const repository = new UserRepository()
const userController = new UserController(repository)

export const router = Router()

router.get('/users/:user_id/links')
router.get('/orders')
export default router