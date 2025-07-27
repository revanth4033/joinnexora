
module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    videoUrl: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isPreview: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
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
    }
  }, {
    timestamps: true
  });

  return Lesson;
};
