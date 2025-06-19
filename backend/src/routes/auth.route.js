import { Router } from "express";
import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth.controllers.js'
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = Router();

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

router.post('/updateProfile', protectRoute, updateProfile)
router.get('/check-auth', protectRoute, checkAuth)

export default router;