import { Router } from "express";
import ProductController from "../controllers/product.controller";
import ProductRepository from "../repositories/product.repository";

export const router = Router()
const productRepository = new ProductRepository()
const productController = new ProductController(productRepository)

router.get('/', productController.getAllProducts.bind(productController))
router.post('/', productController.createProduct.bind(productController))
router.get('/:product_id', productController.getProduct.bind(productController))
router.put('/:product_id', productController.updateProduct.bind(productController))
router.delete('/:product_id', productController.deleteProduct.bind(productController))

export default router