import { Joi, Segments } from 'celebrate';

export const createShopSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    owner: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(6).max(20).required(),
    address: Joi.string().min(2).max(200).required(),
    city: Joi.string().min(2).max(100).required(),
    zip: Joi.string().min(2).max(20).required(),
    password: Joi.string().min(6),
    hasDelivery: Joi.boolean().default(false),
  }),
};

export const updateShopSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(100),
    owner: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    phone: Joi.string().min(6).max(20),
    address: Joi.string().min(2).max(200),
    city: Joi.string().min(2).max(100),
    zip: Joi.string().min(2).max(20),
    hasDelivery: Joi.boolean(),
  }).min(1),
};

export const addProductSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).required(),
    price: Joi.string().required(),
    category: Joi.string().default('Medicine'),
    suppliers: Joi.string().default('Unknown'),
    stock: Joi.string().default('0'),
    description: Joi.string().allow('').default(''),
  }),
};

export const updateProductSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2),
    price: Joi.string(),
    category: Joi.string(),
    suppliers: Joi.string(),
    stock: Joi.string(),
    description: Joi.string().allow(''),
  }).min(1),
};
