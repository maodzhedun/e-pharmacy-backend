import { Schema, model } from 'mongoose';
import { PRODUCT_CATEGORIES } from '../constants/pharmacy.js';

const productSchema = new Schema(
  {
    photo: { type: String, default: '' },
    name: { type: String, required: true },
    suppliers: { type: String, required: true },
    stock: { type: String, required: true },
    price: { type: String, required: true },
    category: { type: String, required: true, enum: PRODUCT_CATEGORIES },
  },
  { timestamps: true, versionKey: false },
);

export const Product = model('Product', productSchema);
