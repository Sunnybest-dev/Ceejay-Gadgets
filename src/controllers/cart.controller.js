const { Cart, CartItem, Product, sequelize } = require("../models/Index");

// Get current user's cart
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id }, // Assuming user ID is available in req.user
      include: [
        {
          model: CartItem,
          include: [Product],
        },
      ],
    });

    if (!cart || cart.CartItems.length === 0) return res.status(200).json({ message: "Cart is empty", cart: [] });
let total = 0;

cart.CartItems.forEach(item => {
  total += item.quantity * item.Product.price;
});
    res.json({ cart, total });
  } catch (err) {
    next(err);
  }
};

// Add item to cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "productId and quantity are required" });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const [cart] = await Cart.findOrCreate({
      where: { userId: userId },
    });

    let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });

    const requestedQuantity = cartItem ? cartItem.quantity + quantity : quantity;

    // Check for sufficient stock
    if (product.quantity < requestedQuantity) {
      return res.status(400).json({ message: "Not enough stock available." });
    }

    await sequelize.transaction(async (t) => {
      // Update quantity and create cart item
      if (cartItem) {
        cartItem.quantity += quantity;
        await cartItem.save({ transaction: t });
      } else {
        cartItem = await CartItem.create({ cartId: cart.id, productId, quantity }, { transaction: t });
      }

      // Reduce product quantity
      product.quantity -= quantity;
      await product.save({ transaction: t });

      // Return the cart item instead of the whole cart
      res.status(200).json({ message: "Item added to cart", cartItem: cartItem });
    });
    
    } catch (err) {
      next(err);
    }
  };


// Remove item from cart
const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    // Use an include to ensure the item belongs to the current user's cart
    const cartItem = await CartItem.findByPk(itemId, {
      include: {
        model: Cart,
        where: { userId: req.user.id },
        attributes: [], // We don't need cart attributes, just the join
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in your cart" });
    }

    await cartItem.destroy();
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    next(err);
  }
};


// Clear entire cart
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) return res.json({ message: "Cart already empty" });

    await CartItem.destroy({ where: { cartId: cart.id } });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    next(err);
  }
};

// Export all functions
module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,

};