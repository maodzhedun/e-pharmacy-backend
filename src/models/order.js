import { Schema, model } from 'mongoose';
import { ORDER_STATUSES } from '../constants/pharmacy.js';

const orderSchema = new Schema(
  {
    photo: { type: String, default: '' },
    name: { type: String, required: true },
    address: { type: String, default: '' },
    products: { type: String, default: '0' },
    price: { type: String, default: '0' },
    status: { type: String, enum: ORDER_STATUSES, default: 'Pending' },
    order_date: { type: String, default: '' },
  },
  { versionKey: false },
);

export const Order = model('Order', orderSchema);
