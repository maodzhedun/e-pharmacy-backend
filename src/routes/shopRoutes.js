import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/upload.js';
import {
  createShop,
  getMyShop,
  updateShop,
  getShopProducts,
  getAllMedicine,
  addProduct,
  editProduct,
  deleteProduct,
  addExistingToShop,
  getProductDetail,
} from '../controllers/shopController.js';
import {
  createShopSchema,
  updateShopSchema,
  addProductSchema,
  updateProductSchema,
} from '../validations/shopValidation.js';

const router = Router();
router.use(authenticate);

// Shop CRUD
router.post(
  '/shop/create',
  upload.single('logo'),
  celebrate(createShopSchema),
  createShop,
);
router.get('/shop', getMyShop);
router.put(
  '/shop/update',
  upload.single('logo'),
  celebrate(updateShopSchema),
  updateShop,
);

// Products
router.get('/shop/products', getShopProducts);
router.get('/shop/all-medicine', getAllMedicine);
router.post(
  '/shop/products/add',
  upload.single('photo'),
  celebrate(addProductSchema),
  addProduct,
);
router.put(
  '/shop/products/:productId/edit',
  upload.single('photo'),
  celebrate(updateProductSchema),
  editProduct,
);
router.delete('/shop/products/:productId/delete', deleteProduct);
router.post('/shop/products/:productId/add-to-shop', addExistingToShop);
router.get('/shop/products/:productId', getProductDetail);

export default router;
