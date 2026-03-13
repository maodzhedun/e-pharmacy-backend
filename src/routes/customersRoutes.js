import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getCustomers,
  getCustomerById,
} from '../controllers/customersController.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  getCustomersSchema,
  customerIdSchema,
} from '../validations/queryValidation.js';

const router = Router();
router.use(authenticate);
router.get('/customers', celebrate(getCustomersSchema), getCustomers);
router.get(
  '/customers/:customerId',
  celebrate(customerIdSchema),
  getCustomerById,
);
export default router;
