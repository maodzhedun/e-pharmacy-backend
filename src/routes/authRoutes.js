import { Router } from 'express';
import { celebrate } from 'celebrate';
import { loginUser, logoutUser, getUserInfo, refreshUserSession } from '../controllers/authController.js';
import { loginSchema } from '../validations/authValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post('/user/login', celebrate(loginSchema), loginUser);
router.post('/user/logout', logoutUser);
router.post('/user/refresh', refreshUserSession);
router.get('/user/user-info', authenticate, getUserInfo);

export default router;
