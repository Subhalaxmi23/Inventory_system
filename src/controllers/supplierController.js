const Supplier = require("../models/Supplier");
// ➕ Create Supplier

const createSupplier = async (req, res) => {
  try {
    const newSupplier = new Supplier(req.body);
    await newSupplier.save();
    res.status(201).json(newSupplier); // ✅ return supplier only
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 📜 Get All Suppliers
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Supplier
const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });
    res.status(200).json({ message: "Supplier updated", supplier });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete Supplier
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
};
