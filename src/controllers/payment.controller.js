const paystack = require("../config/paystack");
const Order = require("../models/Order");
const User = require("../models/User");

const DEVELOPER_FEE = parseInt(process.env.DEVELOPER_FEE) || 200;
const DEVELOPER_SUBACCOUNT = process.env.PAYSTACK_DEVELOPER_SUBACCOUNT;

exports.initializePayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    // Find order
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Get fresh user from DB
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Add developer fee
    const totalAmount = order.totalAmount + DEVELOPER_FEE;

    const response = await paystack.post("/transaction/initialize", {
      email: user.email,
      amount: totalAmount * 100, // convert to kobo

      subaccount: DEVELOPER_SUBACCOUNT,
      transaction_charge: DEVELOPER_FEE * 100,

      metadata: {
        orderId: order.id,
        userId: user.id,
        developerFee: DEVELOPER_FEE,
      },
    });

    res.json({
      message: "Payment initialized",
      data: response.data.data,
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.params;

    const response = await paystack.get(
      `/transaction/verify/${reference}`
    );

    const paymentData = response.data.data;

    if (paymentData.status === "success") {
      const orderId = paymentData.metadata.orderId;

      const order = await Order.findByPk(orderId);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      await order.update({
        status: "paid",
      });

      return res.json({
        message: "Payment verified successfully",
        order,
      });
    }

    return res.status(400).json({
      message: "Payment not successful",
    });
  } catch (err) {
    next(err);
  }
};