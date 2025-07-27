
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 1000]
      }
    },
    shortDescription: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [1, 200]
      }
    },
    instructorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    category: {
      type: DataTypes.ENUM(
        'Web Development', 
        'Mobile Development', 
        'Data Science', 
        'Design', 
        'Marketing', 
        'Business', 
        'Photography', 
        'Music', 
        'Other'
      ),
      allowNull: false
    },
    level: {
      type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 0
      }
    },
    thumbnail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    previewVideoUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    totalDuration: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    enrollmentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    ratingAverage: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    prerequisites: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    whatYouWillLearn: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    courseIncludes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: 'instructorId',
      as: 'instructor'
    });
  };

  return Course;
};
