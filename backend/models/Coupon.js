
module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define('Coupon', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    discountType: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    minOrderAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    maxUses: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    currentUses: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: false
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    applicableCourses: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: []
    }
  }, {
    timestamps: true
  });

  return Coupon;
};
