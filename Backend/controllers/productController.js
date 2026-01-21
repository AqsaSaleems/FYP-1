import Product from '../models/productModel.js';

export const addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error('addProduct error:', err);
    return res.status(500).json({ message: 'Failed to save product' });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    console.error('getProducts error:', err);
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
};