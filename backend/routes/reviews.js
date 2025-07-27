
const express = require('express');
const { Review, Course, User, Enrollment } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reviews
// @desc    Add course review
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      where: { studentId: req.user.id, courseId }
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to leave a review'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      where: { studentId: req.user.id, courseId }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this course'
      });
    }

    const review = await Review.create({
      studentId: req.user.id,
      courseId,
      rating,
      comment
    });

    // Update course rating
    const reviews = await Review.findAll({ where: { courseId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Course.update(
      { 
        ratingAverage: parseFloat(avgRating.toFixed(1)),
        ratingCount: reviews.length
      },
      { where: { id: courseId } }
    );

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/reviews/course/:courseId
// @desc    Get course reviews
// @access  Public
router.get('/course/:courseId', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { courseId: req.params.courseId, isApproved: true },
      include: [
        { model: User, as: 'student', attributes: ['name', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/reviews/course/:courseId/user
// @desc    Check if current user has reviewed the course
// @access  Private
router.get('/course/:courseId/user', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const review = await Review.findOne({ where: { studentId: userId, courseId } });
    res.json({ reviewed: !!review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reviewed: false, message: 'Server error' });
  }
});

module.exports = router;
