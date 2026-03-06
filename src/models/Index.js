// src/models/index.js
"use strict";

const { sequelize, DataTypes } = require("../config/db");

// Import models
const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");
const LuckyDrawRound = require("./LuckyDrawRound");
const LuckyDrawEntry = require("./LuckyDrawEntry");
const Transaction = require("./Transaction");
const Cart = require("./Cart");
const CartItem = require("./CartItems");

// Object to export
const db = {
  sequelize,
  Sequelize: require("sequelize"),
  User,
  Product,
  Order,
  LuckyDrawRound,
  LuckyDrawEntry,
  Transaction,
  Cart,
  CartItem,
};

// =====================
// ASSOCIATIONS
// =====================

// User ↔ Order
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

// User ↔ Transaction
User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(User, { foreignKey: "userId" });

// User ↔ LuckyDrawEntry
User.hasMany(LuckyDrawEntry, { foreignKey: "userId" });
LuckyDrawEntry.belongsTo(User, { foreignKey: "userId" });

// LuckyDrawRound ↔ LuckyDrawEntry
LuckyDrawRound.hasMany(LuckyDrawEntry, { foreignKey: "luckyDrawRoundId" });
LuckyDrawEntry.belongsTo(LuckyDrawRound, { foreignKey: "luckyDrawRoundId" });

// User ↔ Cart
User.hasOne(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

// Cart ↔ CartItem
Cart.hasMany(CartItem, { foreignKey: "cartId" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

// Product ↔ CartItem
Product.hasMany(CartItem, { foreignKey: "productId" });
CartItem.belongsTo(Product, { foreignKey: "productId" });

module.exports = db;