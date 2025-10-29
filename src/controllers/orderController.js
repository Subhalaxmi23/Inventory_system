const Order = require("../models/Order");
const Product = require("../models/Product");
const Stock = require("../models/Stock");

// 🛒 Customer: Create Order
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    let totalAmount = 0;
    const updatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).populate(
        "stockId"
      );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const stock = await Stock.findById(product.stockId);
      if (!stock) {
        return res.status(404).json({ message: "Stock not found" });
      }

      if (stock.quantity < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      // Prepare order item with stock and product details
      updatedItems.push({
        productId: product._id,
        stockId: stock._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Deduct quantities from stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product && product.stockId) {
        await Stock.findByIdAndUpdate(product.stockId, {
          $inc: { quantity: -item.quantity },
        });
      }
    }

    const newOrder = await Order.create({
      userId: req.user._id,
      items: updatedItems,
      totalAmount,
    });

    res.status(201).json({
      message: "Order placed successfully ✅",
      newOrder,
    });
  } catch (error) {
    console.error("❌ Order creation error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// 📋 Admin: Get All Orders with Product & Stock Details
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId", "name price")
      .populate("items.stockId", "name quantity location"); // Add stock details

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👤 Customer: Get My Orders
const getMyOrders = async (req, res) => {
  try {
    const myOrders = await Order.find({ userId: req.user._id })
      .populate("items.productId", "name price")
      .populate("items.stockId", "name location");

    res.status(200).json(myOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🚚 Admin: Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status || order.status;
    await order.save();

    res.status(200).json({ message: "Order status updated ✅", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
};
