'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Courses', 'courseIncludes', {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      allowNull: false,
      defaultValue: []
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Courses', 'courseIncludes');
  }
};
