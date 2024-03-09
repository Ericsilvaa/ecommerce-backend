import { Router } from "express";
import LinkController from "../../controllers/admin/link.controller";

const linkController = new LinkController()

export const router = Router()

router.get('/users/:user_id/links', linkController.link.bind(linkController))

export default router