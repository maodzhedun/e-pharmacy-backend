import { Router } from 'express';
import { celebrate } from 'celebrate';
import { getOrders } from '../controllers/ordersController.js';
import { authenticate } from '../middleware/authenticate.js';
import { getOrdersSchema } from '../validations/queryValidation.js';

const router = Router();
router.use(authenticate);
router.get('/orders', celebrate(getOrdersSchema), getOrders);
export default router;
