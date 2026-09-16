import { ProductModel } from '../models/product.js';
import { catchAsync } from '../middleware/catchAsync.js';

const sendResponse = (res, status, data, error = null) => {
  res.status(status).json({
    success: !error,
    data,
    error,
  });
};

export const productController = {
  getAllProducts: catchAsync(async (req, res, next) => {
    const { category, status, minPrice, maxPrice, inStock, search } = req.query;
    const filters = { category, status, minPrice, maxPrice, inStock, search };
    const products = ProductModel.findAll(filters);
    sendResponse(res, 200, products);
  }),

  getProductById: catchAsync(async (req, res, next) => {
    const product = ProductModel.findById(req.params.id);
    if (!product) {
      return sendResponse(res, 404, null, 'Product not found');
    }
    sendResponse(res, 200, product);
  }),

  createProduct: catchAsync(async (req, res, next) => {
    const product = ProductModel.create(req.body);
    sendResponse(res, 201, product);
  }),

  updateProduct: catchAsync(async (req, res, next) => {
    const updatedProduct = ProductModel.update(req.params.id, req.body);
    if (!updatedProduct) {
      return sendResponse(res, 404, null, 'Product not found');
    }
    sendResponse(res, 200, updatedProduct);
  }),

  deleteProduct: catchAsync(async (req, res, next) => {
    const deleted = ProductModel.delete(req.params.id);
    if (!deleted) {
      return sendResponse(res, 404, null, 'Product not found');
    }
    sendResponse(res, 200, { message: 'Product archived successfully' });
  }),

  restoreProduct: catchAsync(async (req, res, next) => {
    const product = ProductModel.restore(req.params.id);
    if (!product) {
      return sendResponse(res, 404, null, 'Archived product not found');
    }
    sendResponse(res, 200, product);
  }),
};
