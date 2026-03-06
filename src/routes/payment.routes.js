const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const paymentController = require("../controllers/payment.controller");

router.post("/initialize", authMiddleware, paymentController.initializePayment);

router.get("/verify/:reference", paymentController.verifyPayment);

module.exports = router;