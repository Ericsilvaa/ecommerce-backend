import { Router } from "express";
import LinkController from "../../controllers/admin/link.controller";
import { AuthMiddleware } from "../../middleware/auth.middleware";

const linkController = new LinkController()

export const router = Router()

router.post('/links', AuthMiddleware, linkController.CreateLink.bind(linkController))
router.get('/stats', linkController.Stats.bind(linkController))

export default router