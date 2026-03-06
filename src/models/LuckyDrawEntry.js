const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const LuckyDrawEntry = sequelize.define("LuckyDrawEntry", {
  paymentReference: DataTypes.STRING
});

module.exports = LuckyDrawEntry;