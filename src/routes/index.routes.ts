import { Router } from "express";

// admin routes
import AuthRoute from './admin/admin.routes'
import ProductRoute from './admin/products.routes'
import LinkRoute from './admin/link.routes'

// ambassador routes
import AmbassadorAuthRoute from './ambassador/ambassador.routes'
import AmbassadorProductsRoute from './ambassador/products.routes'


const router = (app: Router) => {
  app.use(`${process.env.BASE_URL_ADMIN}`, AuthRoute)
  app.use(`${process.env.BASE_URL_ADMIN}`, ProductRoute)
  app.use(`${process.env.BASE_URL_ADMIN}`, LinkRoute)
  app.use(`${process.env.BASE_URL_ADMIN}`, LinkRoute)
  app.use(`${process.env.BASE_URL_AMBASSADOR}`, AmbassadorAuthRoute)
  app.use(`${process.env.BASE_URL_AMBASSADOR}`, AmbassadorProductsRoute)
}

export default router;