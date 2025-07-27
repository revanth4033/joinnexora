
module.exports = (sequelize, DataTypes) => {
  const QuizAttempt = sequelize.define('QuizAttempt', {
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
    quizId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Quizzes',
        key: 'id'
      }
    },
    answers: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    passed: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    attemptNumber: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    timestamps: true
  });

  return QuizAttempt;
};
