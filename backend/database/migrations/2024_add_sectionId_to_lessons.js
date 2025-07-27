module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Lessons', 'sectionId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Sections',
        key: 'id'
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Lessons', 'sectionId');
  }
}; 