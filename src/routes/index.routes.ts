import { Router } from "express";
import AuthRoute from './admin/admin.routes'
import ProductRoute from './admin/products.routes'
import LinkRoute from './admin/link.routes'

const router = (app: Router) => {
  app.use(`${process.env.BASE_URL_ADMIN}`, AuthRoute)
  app.use(`${process.env.BASE_URL_ADMIN}`, ProductRoute)
  app.use(`${process.env.BASE_URL_ADMIN}`, LinkRoute)
  app.use(`${process.env.BASE_URL_ADMIN}`, LinkRoute)
  app.use(`${process.env.BASE_URL_AMBASSADOR}`)
}

export default router;