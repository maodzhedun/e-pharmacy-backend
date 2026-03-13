import { Schema, model } from 'mongoose';
import { SUPPLIER_STATUSES } from '../constants/pharmacy.js';

const supplierSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, default: '' },
    suppliers: { type: String, default: '' },
    date: { type: String, default: '' },
    amount: { type: String, default: '' },
    status: { type: String, enum: SUPPLIER_STATUSES, default: 'Active' },
  },
  { timestamps: true, versionKey: false },
);

export const Supplier = model('Supplier', supplierSchema);
