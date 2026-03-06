const crypto = require("crypto");
const Order = require("../models/Order");

exports.paystackWebhook = async (req, res) => {
  try {

    const secret = process.env.PAYSTACK_SECRET;

    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).send("Invalid signature");
    }

    const event = req.body;

    if (event.event === "charge.success") {

      const data = event.data;

      const orderId = data.metadata.orderId;

      const order = await Order.findByPk(orderId);

      if (order) {
        await order.update({
          status: "paid"
        });
      }

    }

    res.sendStatus(200);

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};