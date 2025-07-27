
const express = require('express');
const crypto = require('crypto');
const { Enrollment, Course, User } = require('../models');
const router = express.Router();

const Razorpay = require('razorpay');
const { key_id, key_secret } = require('../config/razorpay');
const razorpay = new Razorpay({ key_id, key_secret });

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  console.log('▶️ /create-order body:', req.body);
  const { amount, currency = 'INR', receipt } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency,
      receipt,
    });
    console.log('✅ Razorpay order result:', order);
    res.json(order);
  } catch (err) {
    console.error('❌ Razorpay error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Verify payment and unlock course
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, userId } = req.body;
  const { key_secret } = require('../config/razorpay');
  const generated_signature = crypto.createHmac('sha256', key_secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');
  if (generated_signature === razorpay_signature) {
    try {
      // Check if course exists
      const course = await Course.findByPk(courseId);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      // Check if already enrolled
      const existingEnrollment = await Enrollment.findOne({ where: { studentId: userId, courseId } });
      if (existingEnrollment) {
        return res.json({ success: true, message: 'Already enrolled' });
      }
      // Create enrollment
      await Enrollment.create({
        studentId: userId,
        courseId,
        paymentId: razorpay_payment_id,
        paymentAmount: course.price,
        paymentStatus: 'completed'
      });
      // Optionally increment course enrollment count, send email, etc.
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  } else {
    return res.status(400).json({ success: false, error: 'Invalid signature' });
  }
});

module.exports = router;
