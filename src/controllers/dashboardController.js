import { Product } from '../models/product.js';
import { Customer } from '../models/customer.js';
import { Supplier } from '../models/supplier.js';
import { IncomeExpense } from '../models/incomeExpense.js';

export const getDashboard = async (req, res) => {
  const [productsCount, suppliersCount, customersCount] = await Promise.all([
    Product.countDocuments(),
    Supplier.countDocuments(),
    Customer.countDocuments(),
  ]);

  const recentCustomers = await Customer.find()
    .sort({ _id: -1 })
    .limit(5)
    .select('name email spent image photo');

  const incomeExpenses = await IncomeExpense.find();

  res.status(200).json({
    statistics: {
      products: productsCount,
      suppliers: suppliersCount,
      customers: customersCount,
    },
    recentCustomers,
    incomeExpenses,
  });
};
