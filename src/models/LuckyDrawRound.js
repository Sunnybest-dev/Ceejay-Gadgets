const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const LuckyDrawRound = sequelize.define("LuckyDrawRound", {
  title: DataTypes.STRING,
  entryFee: DataTypes.FLOAT,
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE,
  status: { type: DataTypes.STRING, defaultValue: "active" },
  winnerId: DataTypes.INTEGER
});

module.exports = LuckyDrawRound;