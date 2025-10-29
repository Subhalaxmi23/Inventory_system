const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

router.post("/", protect, authorizeRoles("admin"), createProduct);
router.get("/", protect, getProducts);
router.put("/:id", protect, authorizeRoles("admin"), updateProduct);
router.delete("/:id", protect, authorizeRoles("admin"), deleteProduct);

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middlewares/authMiddleware");
// const {
//   createProduct,
//   getProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
// } = require("../controllers/productController");

// router.route("/").get(protect, getProducts).post(protect, createProduct);
// router
//   .route("/:id")
//   .get(protect, getProductById)
//   .put(protect, updateProduct)
//   .delete(protect, deleteProduct);

// module.exports = router;
