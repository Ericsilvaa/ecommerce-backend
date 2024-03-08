import { Router } from "express";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import AuthRepository from "../../repositories/auth.repository";
import AuthController from "../../controllers/admin/auth.controller";

const authRepository = new AuthRepository()
const authController = new AuthController(authRepository)


export const router = Router()

router.get('/user', AuthMiddleware, authController.AuthenticatedUser.bind(authController))
router.get('/rankings', AuthMiddleware, authController.rankings.bind(authController))
router.post('/register', authController.registerUser.bind(authController))
router.post('/login', authController.loginUser.bind(authController))
router.post('/logout', AuthMiddleware, authController.logout.bind(authController))
router.put('/user/info', AuthMiddleware, authController.UpdateInfo.bind(authController))
router.put('/user/password', AuthMiddleware, authController.UpdatePassword.bind(authController))

export default router