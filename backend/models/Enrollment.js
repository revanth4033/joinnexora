
module.exports = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define('Enrollment', {
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
    enrolledAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    progress: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    completionRate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    certificateIssued: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['studentId', 'courseId']
      }
    ]
  });

  return Enrollment;
};
