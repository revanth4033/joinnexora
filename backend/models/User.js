
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        len: [10, 15]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null for social logins
      validate: {
        len: [6, 255]
      }
    },
    role: {
      type: DataTypes.ENUM('student', 'instructor', 'admin'),
      defaultValue: 'student'
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      validate: {
        len: [0, 500]
      }
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isPhoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpire: {
      type: DataTypes.DATE,
      allowNull: true
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emailVerificationExpire: {
      type: DataTypes.DATE,
      allowNull: true
    },
    emailVerificationOtp: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    emailVerificationOtpExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resetPasswordOtp: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    resetPasswordOtpExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // New profile fields
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    educationLevel: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    institution: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    fieldOfStudy: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    occupation: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    linkedin: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    },
    validate: {
      emailOrPhone() {
        if (!this.email && !this.phone) {
          throw new Error('Either email or phone number is required');
        }
      }
    }
  });

  User.prototype.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  return User;
};
