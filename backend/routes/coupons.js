
const express = require('express');
const { Coupon } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/coupons/validate
// @desc    Validate coupon code
// @access  Public
router.post('/validate', async (req, res) => {
  try {
    const { code, courseId, orderAmount } = req.body;

    const coupon = await Coupon.findOne({
      where: { 
        code: code.toUpperCase(),
        isActive: true
      }
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    // Check validity period
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has expired'
      });
    }

    // Check usage limit
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return res.status(400).json({
        success: false,
        message: 'Coupon usage limit exceeded'
      });
    }

    // Check minimum order amount
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is $${coupon.minOrderAmount}`
      });
    }

    // Check course applicability
    if (courseId && coupon.applicableCourses.length > 0 && !coupon.applicableCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Coupon not applicable to this course'
      });
    }

    // Calculate discount
    let discountAmount;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed order amount
    discountAmount = Math.min(discountAmount, orderAmount);

    res.json({
      success: true,
      data: {
        coupon: {
          id: coupon.id,
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue
        },
        discountAmount,
        finalAmount: orderAmount - discountAmount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/coupons/:id/use
// @desc    Mark coupon as used
// @access  Private
router.put('/:id/use', auth, async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    await coupon.increment('currentUses');

    res.json({
      success: true,
      message: 'Coupon usage updated'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
