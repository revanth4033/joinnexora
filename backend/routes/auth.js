const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { auth } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService');
const crypto = require('crypto');
const passport = require('../auth/google');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Helper to generate a 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.phone) {
      throw new Error('Either email or phone number is required');
    }
    if (req.body.email && !/\S+@\S+\.\S+/.test(req.body.email)) {
      throw new Error('Please enter a valid email');
    }
    if (req.body.phone && !/^\+?[\d\s\-\(\)]{10,15}$/.test(req.body.phone)) {
      throw new Error('Please enter a valid phone number');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone, password, role } = req.body;

    // Check if user exists
    let existingUser;
    if (email) {
      existingUser = await User.findOne({ where: { email } });
    }
    if (!existingUser && phone) {
      existingUser = await User.findOne({ where: { phone } });
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Generate OTP for email verification
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user (email not verified yet)
    const user = await User.create({
      name,
      email: email || null,
      phone: phone || null,
      password,
      role: role || 'student',
      emailVerificationOtp: otp,
      emailVerificationOtpExpires: otpExpires,
      isEmailVerified: false
    });

    // Send OTP email
    if (email) {
      await sendEmail(
        email,
        'Your Join Nexora Email Verification Code',
        `<h2>Email Verification</h2><p>Your OTP code is: <b>${otp}</b></p><p>This code will expire in 10 minutes.</p>`
      );
    }

    res.status(201).json({
      success: true,
      message: 'User registered. Please verify your email with the OTP sent.',
      userId: user.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email with OTP
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findByPk(userId);
    if (!user || !user.emailVerificationOtp || !user.emailVerificationOtpExpires) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }
    if (user.emailVerificationOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP.' });
    }
    if (new Date() > user.emailVerificationOtpExpires) {
      return res.status(400).json({ success: false, message: 'OTP expired.' });
    }
    user.isEmailVerified = true;
    user.emailVerificationOtp = null;
    user.emailVerificationOtpExpires = null;
    await user.save();
    res.json({ success: true, message: 'Email verified successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send OTP for password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = otpExpires;
    await user.save();
    await sendEmail(
      email,
      'Your Join Nexora Password Reset Code',
      `<h2>Password Reset</h2><p>Your OTP code is: <b>${otp}</b></p><p>This code will expire in 10 minutes.</p>`
    );
    res.json({ success: true, message: 'OTP sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/auth/verify-reset-otp
// @desc    Verify OTP for password reset
// @access  Public
router.post('/verify-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }
    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP.' });
    }
    if (new Date() > user.resetPasswordOtpExpires) {
      return res.status(400).json({ success: false, message: 'OTP expired.' });
    }
    // OTP is valid, allow password reset
    res.json({ success: true, message: 'OTP verified. You can now reset your password.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password after OTP verification
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }
    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP.' });
    }
    if (new Date() > user.resetPasswordOtpExpires) {
      return res.status(400).json({ success: false, message: 'OTP expired.' });
    }
    user.password = newPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpires = null;
    await user.save();
    res.json({ success: true, message: 'Password reset successful.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('password').exists().withMessage('Password is required'),
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.phone) {
      throw new Error('Either email or phone number is required');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, phone, password } = req.body;

    // Check for user
    let user;
    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (phone) {
      user = await User.findOne({ where: { phone } });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
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

// Google OAuth: Start
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// Google OAuth: Callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Generate JWT and redirect to frontend with token
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    // You can change the redirect URL to your frontend dashboard or a special handler
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/login?token=${token}`);
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json({
      success: true,
      user
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
