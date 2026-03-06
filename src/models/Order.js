const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Order = sequelize.define(
    "Order",
    {
        totalAmount: DataTypes.FLOAT,
        developerFee: DataTypes.FLOAT,
        ownerAmount: DataTypes.FLOAT,
        paymentReference: DataTypes.STRING,
        status: {
            type: DataTypes.ENUM(
                "paid",
                "pending",
                "shipped",
                "delivered",
                "cancelled"
            ),
            defaultValue: "paid",
        },
    },
    {
        // Add timestamps (createdAt, updatedAt)
        timestamps: true,
    }
);

module.exports = Order;