import { body, query, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Combine all error messages into one string to maintain original behavior
    const errorMessage = errors.array().map(err => err.msg).join(', ');

    return res.status(400).json({
      success: false,
      data: null,
      error: errorMessage,
    });
  }
  next();
};

export const validateCreate = [
  body('name').notEmpty().withMessage('Name is required'),
  body('sku').notEmpty().withMessage('SKU is required'),
  body('category').optional().isIn(['electronics', 'clothing', 'food', 'books', 'other']).withMessage('Invalid category'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be positive'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be non-negative'),
  body('status').optional().isIn(['active', 'inactive', 'discontinued']).withMessage('Invalid status'),
];

export const validateUpdate = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('sku').optional().notEmpty().withMessage('SKU cannot be empty'),
  body('category').optional().isIn(['electronics', 'clothing', 'food', 'books', 'other']).withMessage('Invalid category'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be positive'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be non-negative'),
  body('status').optional().isIn(['active', 'inactive', 'discontinued']).withMessage('Invalid status'),
];

export const validateFilters = [
  query('category').optional().isIn(['electronics', 'clothing', 'food', 'books', 'other']).withMessage('Invalid category filter'),
  query('status').optional().isIn(['active', 'inactive', 'discontinued']).withMessage('Invalid status filter'),
  query('minPrice').optional().isFloat().withMessage('minPrice must be a number'),
  query('maxPrice').optional().isFloat().withMessage('maxPrice must be a number'),
  query('inStock').optional().isIn(['true', 'false']).withMessage('inStock must be true or false'),
  query('search').optional().isString().withMessage('search must be a string'),
];
