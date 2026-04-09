import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

import { connectMongoDB } from './config/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import ordersRoutes from './routes/ordersRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import suppliersRoutes from './routes/suppliersRoutes.js';
import customersRoutes from './routes/customersRoutes.js';
import shopRoutes from './routes/shopRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Global Middleware
app.use(logger);
app.use(express.json());
app.use(
  cors({
    origin: (process.env.FRONTEND_URL || 'http://localhost:5173')
      .split(',')
      .map((u) => u.trim()),
    credentials: true,
  }),
);
app.use(cookieParser());

// Welcome
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to E-Pharmacy API',
    documentation: '/api/ping',
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to E-Pharmacy API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/user',
      dashboard: '/api/dashboard',
      orders: '/api/orders',
      products: '/api/products',
      suppliers: '/api/suppliers',
      customers: '/api/customers',
    },
  });
});

// Health check
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', authRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', ordersRoutes);
app.use('/api', productsRoutes);
app.use('/api', suppliersRoutes);
app.use('/api', customersRoutes);
app.use('/api', shopRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errors()); // celebrate validation errors
app.use(errorHandler); // all other errors

// Start
await connectMongoDB();
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
