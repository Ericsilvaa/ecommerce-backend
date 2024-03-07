import { Router } from "express";
import AuthRoute from './admin.routes'
import ProductsRoute from './products.routes'

const router = (app: any) => {
  app.use('/api/admin', AuthRoute)
  app.use('/api/admin/products', ProductsRoute)
}

export default router;