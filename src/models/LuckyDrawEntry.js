const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const LuckyDrawEntry = sequelize.define("LuckyDrawEntry", {
  ticketNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  }
});

module.exports = LuckyDrawEntry;