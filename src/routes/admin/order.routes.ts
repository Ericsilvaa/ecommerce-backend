import { Router } from "express";
import OrderController from "../../controllers/admin/order.controller";



export const router = Router()
const orderController = new OrderController()

router.get('/orders', orderController.Orders.bind(orderController))

export default router