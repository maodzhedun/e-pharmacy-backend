import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { PRODUCT_CATEGORIES } from '../constants/pharmacy.js';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

// GET /api/products?name=...&page=1&limit=5
export const getProductsSchema = {
  [Segments.QUERY]: Joi.object({
    name: Joi.string().allow(''),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(5),
  }),
};

// POST /api/products
export const createProductSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().required(),
    suppliers: Joi.string().required(),
    stock: Joi.string().required(),
    price: Joi.string().required(),
    category: Joi.string()
      .valid(...PRODUCT_CATEGORIES)
      .required()
      .messages({
        'any.only': `Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}`,
      }),
    photo: Joi.string().allow('', null),
  }),
};

// PUT /api/products/:productId — валідація І params, І body
export const updateProductSchema = {
  [Segments.PARAMS]: Joi.object({
    productId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    name: Joi.string(),
    suppliers: Joi.string(),
    stock: Joi.string(),
    price: Joi.string(),
    category: Joi.string().valid(...PRODUCT_CATEGORIES),
    photo: Joi.string().allow('', null),
  }).min(1),
};

// DELETE /api/products/:productId
export const productIdSchema = {
  [Segments.PARAMS]: Joi.object({
    productId: Joi.string().custom(objectIdValidator).required(),
  }),
};
