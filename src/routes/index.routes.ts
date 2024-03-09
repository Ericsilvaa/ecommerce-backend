import { Router } from "express";

// admin routes
import AuthRoute from './admin/admin.routes'
import ProductRoute from './admin/products.routes'
import LinkRoute from './admin/link.routes'

// ambassador routes
import AmbassadorAuthRoute from './ambassador/ambassador.routes'
import AmbassadorProductsRoute from './ambassador/products.routes'
import AmbassadorLinkRoute from './ambassador/ambassador_link.routes'
import CheckoutLinkRoute from './checkout.routes'


const router = (app: Router) => {
  app.use(`${process.env.BASE_URL_ADMIN}`, AuthRoute)
  app.use(`${process.env.BASE_URL_ADMIN}`, ProductRoute)
  app.use(`${process.env.BASE_URL_ADMIN}`, LinkRoute)
  app.use(`${process.env.BASE_URL_ADMIN}`, LinkRoute)
  app.use(`${process.env.BASE_URL_AMBASSADOR}`, AmbassadorAuthRoute)
  app.use(`${process.env.BASE_URL_AMBASSADOR}`, AmbassadorProductsRoute)
  app.use(`${process.env.BASE_URL_AMBASSADOR}`, AmbassadorLinkRoute)
  app.use(`/api/v1/checkout`, CheckoutLinkRoute)
}

export default router;