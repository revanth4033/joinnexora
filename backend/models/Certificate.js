
module.exports = (sequelize, DataTypes) => {
  const Certificate = sequelize.define('Certificate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    certificateNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    issuedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    certificateUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    grade: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    }
  }, {
    timestamps: true
  });

  return Certificate;
};
