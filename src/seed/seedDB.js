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
import { Shop } from '../models/shop.js';
import { Review } from '../models/review.js';

const loadJSON = async (filename) => {
  const data = await readFile(new URL(`../../data/${filename}`, import.meta.url), 'utf-8');
  return JSON.parse(data);
};

const seed = async () => {
  try {
    await connectMongoDB();
    console.log('🗑️  Clearing...');
    await Promise.all([
      User.deleteMany(), Product.deleteMany(), Customer.deleteMany(),
      Order.deleteMany(), Supplier.deleteMany(), IncomeExpense.deleteMany(),
      Shop.deleteMany(), Review.deleteMany(),
    ]);

    const [products, customers, orders, suppliers, incomeExpenses, reviews] = await Promise.all([
      loadJSON('products.json'), loadJSON('customers.json'), loadJSON('orders.json'),
      loadJSON('suppliers.json'), loadJSON('Income-Expenses.json'), loadJSON('reviews.json'),
    ]);

    console.log('👤 Creating users...');
    const admin = await User.create({
      email: 'admin@gmail.com', password: await bcrypt.hash('admin123', 10),
      name: 'Clayton Santos', role: 'admin',
    });
    const vendor = await User.create({
      email: 'vendor@gmail.com', password: await bcrypt.hash('admin123', 10),
      name: 'Datha Harmon', phone: '595-08-2102', role: 'vendor',
    });

    const insertedProducts = await Product.insertMany(products);
    await Customer.insertMany(customers);
    await Order.insertMany(orders);
    await Supplier.insertMany(suppliers);
    await IncomeExpense.insertMany(incomeExpenses);

    // Create demo shop for vendor with first 6 products
    const shopProducts = insertedProducts.slice(0, 6).map((p) => p._id);
    await Shop.create({
      name: 'Huel LLC', owner: 'Datha Harmon', email: 'hbattisson1@mac.com',
      phone: '595-08-2102', address: 'Kretoria F45', city: 'Castlerea',
      zip: '10010', hasDelivery: true, userId: vendor._id, products: shopProducts,
    });

    // Create reviews for each product
    const reviewDocs = [];
    for (const product of insertedProducts) {
      for (const r of reviews) {
        reviewDocs.push({
          productId: product._id, name: r.name,
          rating: Math.floor(Math.random() * 2) + 4,
          testimonial: r.testimonial,
        });
      }
    }
    await Review.insertMany(reviewDocs);

    console.log('✅ Seeded!');
    console.log('   Admin:  admin@gmail.com  / admin123');
    console.log('   Vendor: vendor@gmail.com / admin123');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌', error.message);
    process.exit(1);
  }
};

seed();
