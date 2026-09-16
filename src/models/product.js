import { v4 as uuidv4 } from 'uuid';

const products = new Map();

export const ProductModel = {
  findAll: (filters = {}) => {
    let result = Array.from(products.values()).filter(p => p.archivedAt === null);

    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters.minPrice !== undefined) {
      result = result.filter(p => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter(p => p.price <= parseFloat(filters.maxPrice));
    }
    if (filters.inStock !== undefined) {
      const isInStock = filters.inStock === 'true';
      result = result.filter(p => isInStock ? p.stock > 0 : p.stock === 0);
    }
    if (filters.search) {
      const searchStr = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchStr) ||
        p.description.toLowerCase().includes(searchStr)
      );
    }

    return result;
  },

  findById: (id) => {
    const product = products.get(id);
    return (product && product.archivedAt === null) ? product : null;
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
      archivedAt: null,
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
    const product = products.get(id);
    if (!product) return false;

    product.archivedAt = new Date();
    products.set(id, product);
    return true;
  },

  restore: (id) => {
    const product = products.get(id);
    if (!product || product.archivedAt === null) return null;

    product.archivedAt = null;
    products.set(id, product);
    return product;
  },
};
