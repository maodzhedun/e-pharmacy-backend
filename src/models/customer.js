import { Schema, model } from 'mongoose';

const customerSchema = new Schema(
  {
    image: { type: String, default: '' },
    photo: { type: String, default: '' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    spent: { type: String, default: '0' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    register_date: { type: String, default: '' },
  },
  { versionKey: false },
);

export const Customer = model('Customer', customerSchema);
