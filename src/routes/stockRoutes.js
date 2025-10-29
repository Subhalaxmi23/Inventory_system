const express = require("express");
const router = express.Router();
const {
  createStock,
  getAllStock,
  updateStock,
  deleteStock,
} = require("../controllers/stockController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

router.post("/", protect, authorizeRoles("admin"), createStock);
router.get("/", protect, getAllStock);
router.put("/:id", protect, authorizeRoles("admin"), updateStock);
router.delete("/:id", protect, authorizeRoles("admin"), deleteStock);

module.exports = router;
