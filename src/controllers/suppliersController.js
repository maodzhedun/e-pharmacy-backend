import createHttpError from 'http-errors';
import { Supplier } from '../models/supplier.js';

export const getSuppliers = async (req, res) => {
  const { name, page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;
  const suppliersQuery = Supplier.find();
  if (name) suppliersQuery.where('name').regex(new RegExp(name, 'i'));

  const [totalSuppliers, suppliers] = await Promise.all([
    suppliersQuery.clone().countDocuments(),
    suppliersQuery.sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
  ]);

  res.status(200).json({
    suppliers,
    total: totalSuppliers,
    page: Number(page),
    perPage: Number(limit),
    totalPages: Math.ceil(totalSuppliers / limit),
  });
};

export const createSupplier = async (req, res) => {
  const supplier = await Supplier.create(req.body);
  res.status(201).json(supplier);
};

export const updateSupplier = async (req, res, next) => {
  const { supplierId } = req.params;
  const supplier = await Supplier.findByIdAndUpdate(supplierId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!supplier) return next(createHttpError(404, 'Supplier not found'));
  res.status(200).json(supplier);
};
