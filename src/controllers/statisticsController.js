import { Product } from '../models/product.js';
import { Supplier } from '../models/supplier.js';
import { Customer } from '../models/customer.js';
import { IncomeExpense } from '../models/incomeExpense.js';
import createHttpError from 'http-errors';

// GET /api/statistics
export const getStatistics = async (req, res) => {
  const [
    totalProducts,
    totalSuppliers,
    totalCustomers,
    recentCustomers,
    incomeExpenses,
  ] = await Promise.all([
    Product.countDocuments(),
    Supplier.countDocuments(),
    Customer.countDocuments(),
    Customer.find().sort({ _id: -1 }).limit(5).lean(),
    IncomeExpense.find().lean(),
  ]);

  res.status(200).json({
    totalProducts,
    totalSuppliers,
    totalCustomers,
    recentCustomers,
    incomeExpenses,
  });
};

// GET /api/statistics/:clientId/goods
export const getClientGoods = async (req, res, next) => {
  const customer = await Customer.findById(req.params.clientId).lean();
  if (!customer) return next(createHttpError(404, 'Customer not found'));

  // We return 3 random items as "purchased items"
  const goods = await Product.aggregate([{ $sample: { size: 3 } }]);

  res.status(200).json({
    customer: {
      name: customer.name,
      email: customer.email,
      spent: customer.spent,
    },
    goods: goods.map((g) => ({
      _id: g._id,
      name: g.name,
      category: g.category,
      photo: g.photo,
      price: g.price,
    })),
  });
};
