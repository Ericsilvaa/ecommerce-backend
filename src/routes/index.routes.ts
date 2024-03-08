import { Router } from "express";
import AuthRoute from './admin.routes'
import ProductRoute from './products.routes'
import LinkRoute from './link.routes'

const router = (app: Router) => {
  app.use(`${process.env.BASE_URL_ADMIN}`, AuthRoute)
  app.use(`${process.env.BASE_URL_ADMIN}`, ProductRoute)
  app.use(`${process.env.BASE_URL_ADMIN}`, LinkRoute)
  app.use(`${process.env.BASE_URL_ADMIN}`, LinkRoute)
  app.use(`${process.env.BASE_URL_AMBASSADOR}`)
}

export default router;