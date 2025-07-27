// Migration to add OTP fields for email verification and password reset to Users table

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'emailVerificationOtp', { type: Sequelize.STRING(10), allowNull: true });
    await queryInterface.addColumn('Users', 'emailVerificationOtpExpires', { type: Sequelize.DATE, allowNull: true });
    await queryInterface.addColumn('Users', 'resetPasswordOtp', { type: Sequelize.STRING(10), allowNull: true });
    await queryInterface.addColumn('Users', 'resetPasswordOtpExpires', { type: Sequelize.DATE, allowNull: true });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'emailVerificationOtp');
    await queryInterface.removeColumn('Users', 'emailVerificationOtpExpires');
    await queryInterface.removeColumn('Users', 'resetPasswordOtp');
    await queryInterface.removeColumn('Users', 'resetPasswordOtpExpires');
  }
}; 