// Migration to add new profile fields to Users table

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'dateOfBirth', { type: Sequelize.DATE, allowNull: true });
    await queryInterface.addColumn('Users', 'gender', { type: Sequelize.ENUM('male', 'female', 'other', 'prefer_not_to_say'), allowNull: true });
    await queryInterface.addColumn('Users', 'country', { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn('Users', 'state', { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn('Users', 'city', { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn('Users', 'address', { type: Sequelize.STRING(255), allowNull: true });
    await queryInterface.addColumn('Users', 'educationLevel', { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn('Users', 'institution', { type: Sequelize.STRING(150), allowNull: true });
    await queryInterface.addColumn('Users', 'fieldOfStudy', { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn('Users', 'occupation', { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn('Users', 'linkedin', { type: Sequelize.STRING(255), allowNull: true });
    await queryInterface.addColumn('Users', 'website', { type: Sequelize.STRING(255), allowNull: true });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'dateOfBirth');
    await queryInterface.removeColumn('Users', 'gender');
    await queryInterface.removeColumn('Users', 'country');
    await queryInterface.removeColumn('Users', 'state');
    await queryInterface.removeColumn('Users', 'city');
    await queryInterface.removeColumn('Users', 'address');
    await queryInterface.removeColumn('Users', 'educationLevel');
    await queryInterface.removeColumn('Users', 'institution');
    await queryInterface.removeColumn('Users', 'fieldOfStudy');
    await queryInterface.removeColumn('Users', 'occupation');
    await queryInterface.removeColumn('Users', 'linkedin');
    await queryInterface.removeColumn('Users', 'website');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_gender";');
  }
}; 