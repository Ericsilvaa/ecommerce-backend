import { Router } from "express";

import { AuthMiddleware } from "../middleware/auth.middleware";
import AuthRepository from "../repositories/auth.repository";
import ProductRepository from "../repositories/product.repository";
import ProductController from "../controllers/admin/product.controller";
import AuthController from "../controllers/admin/auth.controller";
import LinkController from "../controllers/admin/link.controller";

const router = Router();

// Instancie os repositórios necessários
const authRepository = new AuthRepository();
const productRepository = new ProductRepository();

// Instancie os controladores necessários
const productController = new ProductController(productRepository);
const authController = new AuthController(authRepository);
const linkController = new LinkController();

// Defina as rotas relacionadas à autenticação do embaixador
router.get('/user', AuthMiddleware, authController.AuthenticatedUser.bind(authController));
router.get('/rankings', AuthMiddleware, authController.rankings.bind(authController));
router.post('/register', authController.registerUser.bind(authController));
router.post('/login', authController.loginUser.bind(authController));
router.post('/logout', AuthMiddleware, authController.logout.bind(authController));
router.put('/user/info', AuthMiddleware, authController.UpdateInfo.bind(authController));
router.put('/user/password', AuthMiddleware, authController.UpdatePassword.bind(authController));

// Defina as rotas relacionadas aos produtos do embaixador
router.get('/product/frontend', productController.ProductsFrontend.bind(productController));
router.get('/product/backend', productController.Productsbackend.bind(productController));
router.get('/product/:product_id', productController.getProduct.bind(productController));
router.put('/product/:product_id', productController.updateProduct.bind(productController));
router.delete('/product/:product_id', productController.deleteProduct.bind(productController));

// Defina as rotas relacionadas aos links do embaixador
router.post('/links', AuthMiddleware, linkController.CreateLink.bind(linkController));
router.get('/stats', linkController.Stats.bind(linkController));

export default router;