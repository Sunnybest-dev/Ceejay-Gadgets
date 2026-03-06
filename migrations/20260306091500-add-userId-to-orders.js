'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Only add the column if it doesn't exist yet
    const table = await queryInterface.describeTable('Orders');
    if (!table.userId) {
      await queryInterface.addColumn('Orders', 'userId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Orders');
    if (table.userId) {
      await queryInterface.removeColumn('Orders', 'userId');
    }
  },
};
