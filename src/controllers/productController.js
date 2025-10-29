const Product = require("../models/Product");
const Stock = require("../models/Stock");

// ✅ Create Product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stockId } = req.body;

    // Check if stock exists
    const stockExists = await Stock.findById(stockId);
    if (!stockExists) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const product = new Product({
      name,
      description,
      price,
      stockId,
    });

    await product.save();

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

// ✅ Get All Products (Populate stock + supplier)
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate({
        path: "stockId",
        populate: { path: "supplierId" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// ✅ Get Single Product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: "stockId",
      populate: { path: "supplierId" },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

// ✅ Update Product
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stockId } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const stockExists = await Stock.findById(stockId);
    if (!stockExists) {
      return res.status(404).json({ message: "Stock not found" });
    }

    product.productName = name;
    product.description = description;
    product.price = price;
    product.stockId = stockId;

    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

// ✅ Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
