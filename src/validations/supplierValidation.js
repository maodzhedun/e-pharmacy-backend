import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { SUPPLIER_STATUSES } from '../constants/pharmacy.js';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

export const getSuppliersSchema = {
  [Segments.QUERY]: Joi.object({
    name: Joi.string().allow(''),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(5),
  }),
};

export const createSupplierSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    suppliers: Joi.string().required(),
    date: Joi.string().required(),
    amount: Joi.string().required(),
    status: Joi.string().valid(...SUPPLIER_STATUSES).required(),
  }),
};

export const updateSupplierSchema = {
  [Segments.PARAMS]: Joi.object({
    supplierId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    name: Joi.string(),
    address: Joi.string(),
    suppliers: Joi.string(),
    date: Joi.string(),
    amount: Joi.string(),
    status: Joi.string().valid(...SUPPLIER_STATUSES),
  }).min(1),
};
