const Product = require("../models/Product");

// GET all products (public)
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// CREATE product (admin)
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, imageUrl, category } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      imageUrl,
      category,
    });
    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    next(err);
  }
};

// UPDATE product (admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, description, price, quantity, imageUrl, category, isActive } = req.body;

    await product.update({
      name,
      description,
      price,
      quantity,
      imageUrl,
      category,
      isActive,
    });

    res.json({ message: "Product updated", product });
  } catch (err) {
    next(err);
  }
};

// DELETE product (admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.destroy();
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};