const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// Customer: Place order
router.post("/", protect, createOrder);

// Admin: View all orders
router.get("/", protect, authorizeRoles("admin"), getAllOrders);

// Customer: View my orders
router.get("/my-orders", protect, getMyOrders);

// Admin: Update order status
router.put("/:id/status", protect, authorizeRoles("admin"), updateOrderStatus);

// Admin: Delete order
router.delete("/:id", protect, authorizeRoles("admin"), deleteOrder);

module.exports = router;
