const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

const protect = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");

// Public route
router.get("/", productController.getAllProducts);

// Protected routes
router.post("/", protect, admin, productController.createProduct);
router.put("/:id", protect, admin, productController.updateProduct);
router.delete("/:id", protect, admin, productController.deleteProduct);

module.exports = router;