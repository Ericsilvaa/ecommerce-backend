import { Router } from "express";
import LinkController from "../controllers/admin/link.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import OrderController from "../controllers/admin/order.controller";


const linkController = new LinkController()
const orderController = new OrderController()

export const router = Router()

router.get('/links/:code', linkController.getLink.bind(linkController))
router.post('/order', orderController.CreateOrder.bind(orderController))

export default router