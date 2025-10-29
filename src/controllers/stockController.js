const Stock = require("../models/Stock");
const Supplier = require("../models/Supplier");

// ➕ Add Stock
const createStock = async (req, res) => {
  try {
    const { productName, category, quantity, supplierId } = req.body;
    const supplierExists = await Supplier.findById(supplierId);
    if (!supplierExists)
      return res.status(404).json({ message: "Supplier not found" });

    const stock = new Stock({ productName, category, quantity, supplierId });
    await stock.save();
    res.status(201).json({ message: "Stock added successfully", stock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📜 Get All Stock
const getAllStock = async (req, res) => {
  try {
    const stock = await Stock.find().populate(
      "supplierId",
      "name company email phone"
    );
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Stock
const updateStock = async (req, res) => {
  try {
    const updatedStock = await Stock.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedStock)
      return res.status(404).json({ message: "Stock not found" });
    res
      .status(200)
      .json({ message: "Stock updated successfully", updatedStock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete Stock
const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });
    res.status(200).json({ message: "Stock deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStock,
  getAllStock,
  updateStock,
  deleteStock,
};
