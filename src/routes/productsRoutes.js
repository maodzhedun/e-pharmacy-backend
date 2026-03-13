import { Router } from 'express';
import { celebrate } from 'celebrate';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productsController.js';
import { authenticate } from '../middleware/authenticate.js';
import { getProductsSchema, createProductSchema, updateProductSchema, productIdSchema } from '../validations/productValidation.js';

const router = Router();
router.use(authenticate);

router.get('/products', celebrate(getProductsSchema), getProducts);
router.post('/products', celebrate(createProductSchema), createProduct);
router.put('/products/:productId', celebrate(updateProductSchema), updateProduct);
router.delete('/products/:productId', celebrate(productIdSchema), deleteProduct);

export default router;
