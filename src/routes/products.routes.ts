import { Router } from "express";
import ProductController from "../controllers/product.controller";
import ProductRepository from "../repositories/product.repository";

export const router = Router()
const productRepository = new ProductRepository()
const productController = new ProductController(productRepository)

router.get('/product', productController.getAllProducts.bind(productController))
router.post('/product', productController.createProduct.bind(productController))
router.get('/product/:product_id', productController.getProduct.bind(productController))
router.put('/product/:product_id', productController.updateProduct.bind(productController))
router.delete('/product/:product_id', productController.deleteProduct.bind(productController))

export default router