import { ProductModel } from '../models/product.js';

const sendResponse = (res, status, data, error = null) => {
  res.status(status).json({
    success: !error,
    data,
    error,
  });
};

export const productController = {
  getAllProducts: (req, res, next) => {
    try {
      const filters = req.query;
      const products = ProductModel.findAll(filters);
      sendResponse(res, 200, products);
    } catch (error) {
      next(error);
    }
  },

  getProductById: (req, res, next) => {
    try {
      const product = ProductModel.findById(req.params.id);
      if (!product) {
        return sendResponse(res, 404, null, 'Product not found');
      }
      sendResponse(res, 200, product);
    } catch (error) {
      next(error);
    }
  },

  createProduct: (req, res, next) => {
    try {
      const { name, sku, price, stock } = req.body;
      if (!name || !sku || price === undefined || stock === undefined) {
        return sendResponse(res, 400, null, 'Missing required fields: name, sku, price, stock');
      }

      if (price < 0) return sendResponse(res, 400, null, 'Price must be positive');
      if (stock < 0) return sendResponse(res, 400, null, 'Stock must be non-negative');

      const product = ProductModel.create(req.body);
      sendResponse(res, 201, product);
    } catch (error) {
      const status = error.message.includes('already exists') ? 409 : 400;
      sendResponse(res, status, null, error.message);
    }
  },

  updateProduct: (req, res, next) => {
    try {
      const updatedProduct = ProductModel.update(req.params.id, req.body);
      if (!updatedProduct) {
        return sendResponse(res, 404, null, 'Product not found');
      }
      sendResponse(res, 200, updatedProduct);
    } catch (error) {
      const status = error.message.includes('already exists') ? 409 : 400;
      sendResponse(res, status, null, error.message);
    }
  },

  deleteProduct: (req, res, next) => {
    try {
      const deleted = ProductModel.delete(req.params.id);
      if (!deleted) {
        return sendResponse(res, 404, null, 'Product not found');
      }
      sendResponse(res, 200, { message: 'Product deleted successfully' });
    } catch (error) {
      next(error);
    }
  },
};
