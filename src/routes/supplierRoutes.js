const express = require("express");
const {
  createSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createSupplier);
router.get("/", protect, authorizeRoles("admin"), getSuppliers);
router.put("/:id", protect, authorizeRoles("admin"), updateSupplier);
router.delete("/:id", protect, authorizeRoles("admin"), deleteSupplier);

module.exports = router;
