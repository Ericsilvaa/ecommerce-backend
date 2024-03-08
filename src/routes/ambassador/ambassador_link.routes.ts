import { Router } from "express";
import LinkController from "../../controllers/admin/link.controller";
import { AuthMiddleware } from "../../middleware/auth.middleware";

const linkController = new LinkController()

export const router = Router()

router.get('/users/:user_id/links', AuthMiddleware, linkController.link_embassador.bind(linkController))
router.get('/stats', AuthMiddleware, linkController.Stats.bind(linkController))

export default router