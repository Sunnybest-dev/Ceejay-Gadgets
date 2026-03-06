const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const { checkout } = require("../controllers/order.controller");

router.post("/checkout", authMiddleware, checkout);

module.exports = router;