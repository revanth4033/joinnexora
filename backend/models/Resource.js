module.exports = (sequelize, DataTypes) => {
  const Resource = sequelize.define('Resource', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING, // e.g., 'pdf', 'slide', 'code', 'other'
      allowNull: false
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    sectionId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Sections',
        key: 'id'
      }
    },
    lessonId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Lessons',
        key: 'id'
      }
    }
  }, {
    timestamps: true
  });

  return Resource;
}; 