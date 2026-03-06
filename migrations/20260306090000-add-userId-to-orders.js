"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Describe table to check if column exists
    const table = await queryInterface.describeTable("Orders").catch(() => null);
    if (!table) {
      // If table doesn't exist, bail out — models/sync will handle it in dev
      return Promise.resolve();
    }

    if (!table.userId) {
      await queryInterface.addColumn("Orders", "userId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });

      await queryInterface.addConstraint("Orders", {
        fields: ["userId"],
        type: "foreign key",
        name: "Orders_userId_fkey",
        references: {
          table: "Users",
          field: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
    }
  },

  down: async (queryInterface) => {
    const table = await queryInterface.describeTable("Orders").catch(() => null);
    if (!table || !table.userId) return Promise.resolve();
    // Remove constraint (if exists) then column
    try {
      await queryInterface.removeConstraint("Orders", "Orders_userId_fkey");
    } catch (e) {
      // ignore if constraint missing
    }
    await queryInterface.removeColumn("Orders", "userId");
  },
};
