const express = require('express');
const { Enrollment, Course, User } = require('../models');
const auth = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// @route   POST /api/enrollments
// @desc    Enroll in a course
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { courseId, paymentId, paymentAmount } = req.body;

    // Check if course exists
    const course = await Course.findByPk(courseId, {
      include: [{ model: User, as: 'instructor', attributes: ['name'] }]
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: { studentId: req.user.id, courseId }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      studentId: req.user.id,
      courseId,
      paymentId,
      paymentAmount: paymentAmount || course.price,
      paymentStatus: 'completed'
    });

    // Update course enrollment count
    await Course.increment('enrollmentCount', { where: { id: courseId } });

    // Send course access email
    if (req.user.email) {
      await emailService.sendCourseAccessEmail(
        req.user.email,
        req.user.name,
        course.title
      );
    }

    const populatedEnrollment = await Enrollment.findByPk(enrollment.id, {
      include: [
        { model: Course, as: 'course' },
        { model: User, as: 'student', attributes: ['name', 'email'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: populatedEnrollment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/enrollments/my-courses
// @desc    Get user's enrolled courses
// @access  Private
router.get('/my-courses', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { studentId: req.user.id },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'thumbnail', 'description', 'instructorId', 'totalDuration'],
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['name']
            },
            {
              model: require('../models').Section,
              as: 'sections',
              attributes: ['id', 'title', 'order'],
              include: [
                {
                  model: require('../models').Lesson,
                  as: 'lessons',
                  attributes: ['id', 'title', 'duration', 'order']
                }
              ]
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/enrollments/:courseId/progress
// @desc    Update course progress
// @access  Private
router.put('/:courseId/progress', auth, async (req, res) => {
  try {
    const { lessonId, watchTime } = req.body;
    const { courseId } = req.params;

    // FIX: Use correct Sequelize query
    const enrollment = await Enrollment.findOne({
      where: { studentId: req.user.id, courseId }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check if lesson progress already exists
    const existingProgress = enrollment.progress.find(
      p => p.lessonId.toString() === lessonId
    );

    let newProgressArr;
    if (existingProgress) {
      // Update watchTime if needed
      newProgressArr = enrollment.progress.map(p =>
        p.lessonId.toString() === lessonId
          ? { ...p, watchTime: Math.max(p.watchTime, watchTime) }
          : p
      );
    } else {
      newProgressArr = [
        ...enrollment.progress,
        { lessonId, watchTime, completedAt: new Date() }
      ];
    }
    enrollment.progress = newProgressArr;

    // FIX: Use correct Sequelize method and include lessons
    const course = await Course.findByPk(courseId, {
      include: [{ model: require('../models').Lesson, as: 'lessons' }]
    });
    const totalLessons = course.lessons.length;
    const completedLessons = enrollment.progress.length;
    enrollment.completionRate = Math.round((completedLessons / totalLessons) * 100);

    // Mark as completed if 100%
    if (enrollment.completionRate === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: enrollment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/enrollments/:courseId/progress
// @desc    Get lesson progress for a user's enrollment in a course
// @access  Private
router.get('/:courseId/progress', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({
      where: { studentId: req.user.id, courseId }
    });
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }
    res.json({
      success: true,
      data: {
        progress: enrollment.progress,
        completionRate: enrollment.completionRate,
        completedAt: enrollment.completedAt
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

module.exports = router;
