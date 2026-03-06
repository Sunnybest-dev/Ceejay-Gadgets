const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Transaction = sequelize.define("Transaction", {
  type: DataTypes.STRING, // order | lucky_draw
  amount: DataTypes.FLOAT,
  developerFee: DataTypes.FLOAT,
  paymentReference: DataTypes.STRING,
  status: DataTypes.STRING
});

module.exports = Transaction;