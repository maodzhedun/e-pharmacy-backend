import createHttpError from 'http-errors';
import { Product } from '../models/product.js';

export const getProducts = async (req, res) => {
  const { name, page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;

  const productsQuery = Product.find();

  if (name) {
    productsQuery.where('name').regex(new RegExp(name, 'i'));
  }

  const [totalProducts, products] = await Promise.all([
    productsQuery.clone().countDocuments(),
    productsQuery.sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
  ]);

  res.status(200).json({
    products,
    total: totalProducts,
    page: Number(page),
    perPage: Number(limit),
    totalPages: Math.ceil(totalProducts / limit),
  });
};

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

export const updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) return next(createHttpError(404, 'Product not found'));
  res.status(200).json(product);
};

export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findByIdAndDelete(productId);
  if (!product) return next(createHttpError(404, 'Product not found'));
  res.status(200).json(product);
};
