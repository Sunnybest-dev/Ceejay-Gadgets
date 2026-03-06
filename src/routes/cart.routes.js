// All routes require logged-in user
const cartController = require("../controllers/cart.controller"); // must be correct path
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cart.controller");

router.get("/", authMiddleware, getCart);

router.post("/add", authMiddleware, addToCart);

router.delete("/remove/:itemId", authMiddleware, removeFromCart);

router.delete("/clear", authMiddleware, clearCart);

module.exports = router;