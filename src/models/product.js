import { v4 as uuidv4 } from 'uuid';

const products = new Map();

export const ProductModel = {
  findAll: (filters = {}) => {
    let result = Array.from(products.values());

    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters.name) {
      result = result.filter(p => p.name.toLowerCase().includes(filters.name.toLowerCase()));
    }

    return result;
  },

  findById: (id) => {
    return products.get(id);
  },

  findBySku: (sku) => {
    return Array.from(products.values()).find(p => p.sku === sku);
  },

  create: (data) => {
    const existing = ProductModel.findBySku(data.sku);
    if (existing) {
      throw new Error('Product with this SKU already exists');
    }

    const product = {
      id: uuidv4(),
      name: data.name,
      sku: data.sku,
      description: data.description || '',
      category: data.category || 'other',
      price: parseFloat(parseFloat(data.price).toFixed(2)),
      stock: parseInt(data.stock, 10),
      status: data.status || 'active',
      createdAt: new Date(),
    };

    products.set(product.id, product);
    return product;
  },

  update: (id, patch) => {
    const product = products.get(id);
    if (!product) return null;

    if (patch.sku && patch.sku !== product.sku) {
      const existing = ProductModel.findBySku(patch.sku);
      if (existing) {
        throw new Error('Product with this SKU already exists');
      }
    }

    const updatedProduct = {
      ...product,
      ...patch,
      // Ensure price is still 2 decimal places if updated
      ...(patch.price && { price: parseFloat(parseFloat(patch.price).toFixed(2)) }),
      ...(patch.stock && { stock: parseInt(patch.stock, 10) }),
    };

    products.set(id, updatedProduct);
    return updatedProduct;
  },

  delete: (id) => {
    return products.delete(id);
  },
};
