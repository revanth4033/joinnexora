const express = require('express');
const { User, Course, Enrollment, Certificate } = require('../models');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Enrollment,
          as: 'enrollments',
          include: [{ model: Course, as: 'course' }]
        },
        {
          model: Certificate,
          as: 'certificates',
          include: [{ model: Course, as: 'course' }]
        }
      ],
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const allowedFields = [
      'name', 'email', 'phone', 'bio', 'title',
      'dateOfBirth', 'gender', 'country', 'state', 'city', 'address',
      'educationLevel', 'institution', 'fieldOfStudy', 'occupation', 'linkedin', 'website'
    ];
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });
    await User.update(updateData, { where: { id: req.user.id } });
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (user.role === 'student') {
      // Student dashboard
      const enrollments = await Enrollment.findAll({
        where: { studentId: req.user.id },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'thumbnail', 'totalDuration'],
            include: [
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
        order: [['enrolledAt', 'DESC']]
      });

      const certificates = await Certificate.findAll({
        where: { studentId: req.user.id },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['title']
          }
        ],
        order: [['issuedAt', 'DESC']]
      });

      const stats = {
        totalEnrolled: enrollments.length,
        coursesCompleted: enrollments.filter(e => e.completionRate === 100).length,
        totalLearningTime: enrollments.reduce((total, e) => total + (e.course?.totalDuration || 0), 0),
        averageProgress: enrollments.length > 0 
          ? enrollments.reduce((total, e) => total + parseFloat(e.completionRate), 0) / enrollments.length 
          : 0,
        certificatesEarned: certificates.length
      };

      res.json({
        success: true,
        data: {
          user,
          enrollments,
          certificates,
          stats
        }
      });
    } else if (user.role === 'instructor') {
      // Instructor dashboard
      const courses = await Course.findAll({
        where: { instructorId: req.user.id },
        include: [
          {
            model: Enrollment,
            as: 'enrollments'
          }
        ]
      });
      
      const totalStudents = courses.reduce((total, course) => total + course.enrollmentCount, 0);
      const totalRevenue = courses.reduce((total, course) => {
        return total + (course.enrollments?.reduce((sum, e) => sum + parseFloat(e.paymentAmount || 0), 0) || 0);
      }, 0);
      
      res.json({
        success: true,
        data: {
          user,
          courses,
          stats: {
            totalCourses: courses.length,
            totalStudents,
            totalRevenue,
            publishedCourses: courses.filter(c => c.isPublished).length,
            averageRating: courses.length > 0 
              ? courses.reduce((total, c) => total + parseFloat(c.ratingAverage || 0), 0) / courses.length 
              : 0
          }
        }
      });
    } else {
      // Admin dashboard - redirect to admin routes
      res.redirect('/api/admin/dashboard');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/instructors
// @desc    Get all instructors for admin course creation
// @access  Private (Admin)
router.get('/instructors', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can view instructors.'
      });
    }

    const instructors = await User.findAll({
      where: { role: 'instructor' },
      attributes: ['id', 'name', 'avatar', 'title', 'bio'],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: instructors
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
