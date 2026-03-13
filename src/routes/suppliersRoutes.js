import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
} from '../controllers/suppliersController.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  getSuppliersSchema,
  createSupplierSchema,
  updateSupplierSchema,
} from '../validations/supplierValidation.js';

const router = Router();
router.use(authenticate);
router.get('/suppliers', celebrate(getSuppliersSchema), getSuppliers);
router.post('/suppliers', celebrate(createSupplierSchema), createSupplier);
router.put(
  '/suppliers/:supplierId',
  celebrate(updateSupplierSchema),
  updateSupplier,
);
export default router;
