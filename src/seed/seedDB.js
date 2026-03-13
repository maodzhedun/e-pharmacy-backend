import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { readFile } from 'node:fs/promises';

import { connectMongoDB } from '../config/connectMongoDB.js';
import { User } from '../models/user.js';
import { Product } from '../models/product.js';
import { Customer } from '../models/customer.js';
import { Order } from '../models/order.js';
import { Supplier } from '../models/supplier.js';
import { IncomeExpense } from '../models/incomeExpense.js';

// ESM does not support `require()` for JSON — let’s use `readFile`
const loadJSON = async (filename) => {
  const data = await readFile(
    new URL(`../../data/${filename}`, import.meta.url),
    'utf-8',
  );
  return JSON.parse(data);
};

const seed = async () => {
  try {
    await connectMongoDB();
    console.log('🗑️  Clearing...');
    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Customer.deleteMany(),
      Order.deleteMany(),
      Supplier.deleteMany(),
      IncomeExpense.deleteMany(),
    ]);

    const [products, customers, orders, suppliers, incomeExpenses] =
      await Promise.all([
        loadJSON('products.json'),
        loadJSON('customers.json'),
        loadJSON('orders.json'),
        loadJSON('suppliers.json'),
        loadJSON('Income-Expenses.json'),
      ]);

    console.log('👤 Creating admin...');
    await User.create({
      email: 'vendor@gmail.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Clayton Santos',
    });

    await Product.insertMany(products);
    await Customer.insertMany(customers);
    await Order.insertMany(orders);
    await Supplier.insertMany(suppliers);
    await IncomeExpense.insertMany(incomeExpenses);

    console.log('✅ Seeded! Login: vendor@gmail.com / admin123');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌', error.message);
    process.exit(1);
  }
};

seed();
