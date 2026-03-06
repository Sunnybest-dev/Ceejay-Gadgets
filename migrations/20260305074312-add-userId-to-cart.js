'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Carts', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true, // A user can only have one cart
      references: {
        model: 'Users', // name of the target table
        key: 'id',      // name of the target column
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Carts', 'userId');
  }
};
