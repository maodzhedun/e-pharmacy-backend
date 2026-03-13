import createHttpError from 'http-errors';
import { Customer } from '../models/customer.js';

export const getCustomers = async (req, res) => {
  const { name, page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;
  const customersQuery = Customer.find();
  if (name) customersQuery.where('name').regex(new RegExp(name, 'i'));

  const [totalCustomers, customers] = await Promise.all([
    customersQuery.clone().countDocuments(),
    customersQuery.skip(skip).limit(Number(limit)),
  ]);

  res.status(200).json({
    customers,
    total: totalCustomers,
    page: Number(page),
    perPage: Number(limit),
    totalPages: Math.ceil(totalCustomers / limit),
  });
};

export const getCustomerById = async (req, res, next) => {
  const { customerId } = req.params;
  const customer = await Customer.findById(customerId);
  if (!customer) return next(createHttpError(404, 'Customer not found'));
  res.status(200).json(customer);
};
