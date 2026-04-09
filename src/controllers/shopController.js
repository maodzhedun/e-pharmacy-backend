import createHttpError from 'http-errors';
import { Shop } from '../models/shop.js';
import { Product } from '../models/product.js';
import { Review } from '../models/review.js';
import { uploadToCloudinary } from '../middleware/upload.js';
import { PRODUCT_CATEGORIES } from '../constants/pharmacy.js';

// POST /api/shop/create
export const createShop = async (req, res, next) => {
  const existing = await Shop.findOne({ userId: req.user._id });
  if (existing) return next(createHttpError(409, 'You already have a shop'));

  let logo = '';
  if (req.file)
    logo = await uploadToCloudinary(req.file.buffer, 'e-pharmacy/logos');

  const shop = await Shop.create({ ...req.body, logo, userId: req.user._id });
  res.status(201).json(shop);
};

// GET /api/shop
export const getMyShop = async (req, res) => {
  const shop = await Shop.findOne({ userId: req.user._id }).populate(
    'products',
  );
  if (!shop) return res.status(200).json(null);
  res.status(200).json(shop);
};

// PUT /api/shop/update
export const updateShop = async (req, res, next) => {
  const shop = await Shop.findOne({ userId: req.user._id });
  if (!shop) return next(createHttpError(404, 'Shop not found'));
  if (req.file)
    req.body.logo = await uploadToCloudinary(
      req.file.buffer,
      'e-pharmacy/logos',
    );
  Object.assign(shop, req.body);
  await shop.save();
  res.status(200).json(shop);
};

// GET /api/shop/products — Drug store tab
export const getShopProducts = async (req, res) => {
  const shop = await Shop.findOne({ userId: req.user._id }).populate(
    'products',
  );
  if (!shop) return res.status(200).json({ products: [], total: 0 });
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const all = shop.products || [];
  const products = all.slice((page - 1) * limit, page * limit);
  res
    .status(200)
    .json({
      products,
      total: all.length,
      page,
      totalPages: Math.ceil(all.length / limit),
    });
};

// GET /api/shop/all-medicine — All medicine tab (with filters)
export const getAllMedicine = async (req, res) => {
  const { category, name, page: p, limit: l } = req.query;
  const page = parseInt(p) || 1;
  const limit = parseInt(l) || 12;
  const filter = {};
  if (category && category !== 'all') filter.category = category;
  if (name) filter.name = { $regex: name, $options: 'i' };
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .skip((page - 1) * limit)
    .limit(limit);
  res
    .status(200)
    .json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      categories: PRODUCT_CATEGORIES,
    });
};

// POST /api/shop/products/add — add new product to shop
export const addProduct = async (req, res, next) => {
  const shop = await Shop.findOne({ userId: req.user._id });
  if (!shop) return next(createHttpError(404, 'Create a shop first'));
  let photo = '';
  if (req.file)
    photo = await uploadToCloudinary(req.file.buffer, 'e-pharmacy/products');
  const product = await Product.create({ ...req.body, photo });
  shop.products.push(product._id);
  await shop.save();
  res.status(201).json(product);
};

// PUT /api/shop/products/:productId/edit
export const editProduct = async (req, res, next) => {
  const { productId } = req.params;
  const shop = await Shop.findOne({ userId: req.user._id });
  if (!shop) return next(createHttpError(404, 'Shop not found'));
  if (!shop.products.includes(productId))
    return next(createHttpError(403, 'Not your product'));
  if (req.file)
    req.body.photo = await uploadToCloudinary(
      req.file.buffer,
      'e-pharmacy/products',
    );
  const product = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
  });
  if (!product) return next(createHttpError(404, 'Product not found'));
  res.status(200).json(product);
};

// DELETE /api/shop/products/:productId/delete
export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  const shop = await Shop.findOne({ userId: req.user._id });
  if (!shop) return next(createHttpError(404, 'Shop not found'));
  if (!shop.products.includes(productId))
    return next(createHttpError(403, 'Not your product'));
  await Product.findByIdAndDelete(productId);
  shop.products = shop.products.filter((id) => id.toString() !== productId);
  await shop.save();
  res.status(200).json({ message: 'Product deleted' });
};

// POST /api/shop/products/:productId/add-to-shop — add existing product to shop
export const addExistingToShop = async (req, res, next) => {
  const { productId } = req.params;
  const shop = await Shop.findOne({ userId: req.user._id });
  if (!shop) return next(createHttpError(404, 'Create a shop first'));
  const product = await Product.findById(productId);
  if (!product) return next(createHttpError(404, 'Product not found'));
  if (shop.products.includes(productId))
    return next(createHttpError(409, 'Already in your shop'));
  shop.products.push(productId);
  await shop.save();
  res.status(200).json({ message: 'Product added to shop' });
};

// GET /api/shop/products/:productId — details + reviews
export const getProductDetail = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) return next(createHttpError(404, 'Product not found'));
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const totalReviews = await Review.countDocuments({ productId });
  const reviews = await Review.find({ productId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res
    .status(200)
    .json({
      product,
      reviews,
      totalReviews,
      reviewPage: page,
      reviewTotalPages: Math.ceil(totalReviews / limit),
    });
};
