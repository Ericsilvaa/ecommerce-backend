import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import AuthRepository from "../repositories/auth.repository";
import ProductRepository from "../repositories/product.repository";
import AuthController from "../controllers/admin/auth.controller";
import LinkController from "../controllers/admin/link.controller";
import ProductController from "../controllers/admin/product.controller";
import OrderController from "../controllers/admin/order.controller";

const router = Router();

// Instancie os repositórios necessários
const authRepository = new AuthRepository();
const productRepository = new ProductRepository();

// Instancie os controladores necessários
const authController = new AuthController(authRepository);
const linkController = new LinkController();
const productController = new ProductController(productRepository);
const orderController = new OrderController()

// Defina as rotas relacionadas à autenticação
router.get('/user', AuthMiddleware, authController.AuthenticatedUser.bind(authController));
router.get('/ambassadors', AuthMiddleware, authController.Ambassadors.bind(authController));
router.post('/register', authController.registerUser.bind(authController));
router.post('/login', authController.loginUser.bind(authController));
router.post('/logout', AuthMiddleware, authController.logout.bind(authController));
router.put('/user/info', AuthMiddleware, authController.UpdateInfo.bind(authController));
router.put('/user/password', AuthMiddleware, authController.UpdatePassword.bind(authController));

// Defina as rotas relacionadas aos links
router.get('/users/:user_id/links', linkController.link.bind(linkController));

// Defina as rotas relacionadas aos produtos
router.get('/product', productController.getAllProducts.bind(productController));
router.post('/product', productController.createProduct.bind(productController));
router.get('/product/:product_id', productController.getProduct.bind(productController));
router.put('/product/:product_id', productController.updateProduct.bind(productController));
router.delete('/product/:product_id', productController.deleteProduct.bind(productController));

// Defina as rotas relacionadas as orders
router.get('/orders', orderController.Orders.bind(orderController))


export default router;