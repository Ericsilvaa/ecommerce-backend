import { Router } from "express";
import AuthController from "../../controllers/admin/auth.controller";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import AuthRepository from "../../repositories/auth.repository";

const authRepository = new AuthRepository()
const authController = new AuthController(authRepository)


export const router = Router()

router.get('/user', AuthMiddleware, authController.AuthenticatedUser.bind(authController))
router.get('/ambassadors', AuthMiddleware, authController.Ambassadors.bind(authController))
router.post('/register', authController.registerUser.bind(authController))
router.post('/login', authController.loginUser.bind(authController))
router.post('/logout', AuthMiddleware, authController.logout.bind(authController))
router.put('/user/info', AuthMiddleware, authController.UpdateInfo.bind(authController))
router.put('/user/password', AuthMiddleware, authController.UpdatePassword.bind(authController))

export default router