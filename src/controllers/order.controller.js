const Cart = require("../models/Cart");
const CartItem = require("../models/CartItems");
const Product = require("../models/Product");
const Order = require("../models/Order");

exports.checkout = async (req, res, next) => {
  try {

    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: CartItem,
          include: [Product]
        }
      ]
    });

    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;

    cart.CartItems.forEach(item => {
      total += item.quantity * item.Product.price;
    });

    const order = await Order.create({
      userId: req.user.id,
      totalAmount: total,
      status: "pending"
    });

    res.json({
      message: "Order created",
      order,
      total
    });

  } catch (err) {
    next(err);
  }
};