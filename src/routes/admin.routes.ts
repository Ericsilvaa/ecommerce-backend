import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import UserController from "../controllers/user.controller";
import AuthRepository from "../repositories/auth.repository";

const authRepository = new AuthRepository()
const authController = new AuthController(authRepository)


export const router = Router()

router.get('/user', AuthMiddleware, authController.AuthenticatedUser.bind(authController))
router.put('/user/info', AuthMiddleware, authController.UpdateInfo.bind(authController))
router.put('/user/password', AuthMiddleware, authController.UpdatePassword.bind(authController))
router.post('/logout', AuthMiddleware, authController.logout.bind(authController))

router.post('/register', authController.registerUser.bind(authController))
router.post('/login', authController.loginUser.bind(authController))

// router.get('/ambassadors', AuthMiddleware, userController.Ambassadors.bind(userController))


export default router