'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add title field to Users table
    await queryInterface.addColumn('Users', 'title', {
      type: Sequelize.STRING(100),
      allowNull: true
    });

    // Add instructorId field to Courses table
    await queryInterface.addColumn('Courses', 'instructorId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Remove the old instructor field from Courses table
    await queryInterface.removeColumn('Courses', 'instructor');
  },

  async down (queryInterface, Sequelize) {
    // Remove instructorId field from Courses table
    await queryInterface.removeColumn('Courses', 'instructorId');

    // Add back the old instructor field to Courses table
    await queryInterface.addColumn('Courses', 'instructor', {
      type: Sequelize.STRING(100),
      allowNull: true
    });

    // Remove title field from Users table
    await queryInterface.removeColumn('Users', 'title');
  }
};
