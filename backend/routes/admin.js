
const express = require('express');
const { User, Course, Enrollment, Certificate, Review, Quiz, Coupon } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');
const { Op } = require('sequelize');
const { Sequelize } = require('../models');
const { exec } = require('child_process');
const path = require('path');

const router = express.Router();

// Admin middleware - using the imported adminAuth from middleware/auth.js

// @route   POST /api/admin/migrate
// @desc    Run database migrations
// @access  Private (Admin)
router.post('/migrate', adminAuth, async (req, res) => {
  try {
    console.log('🔄 Running database migrations...');
    
    // Run migrations using sequelize-cli
    exec('npx sequelize-cli db:migrate', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
      if (error) {
        // Check if it's just a "column already exists" error (which is okay)
        if (error.message && error.message.includes('already exists')) {
          console.log('✅ Database schema is up to date (migrations already applied)');
          return res.json({
            success: true,
            message: 'Database schema is up to date (migrations already applied)',
            output: stdout
          });
        } else {
          console.error('❌ Migration error:', error);
          return res.status(500).json({
            success: false,
            message: 'Migration failed',
            error: error.message
          });
        }
      }
      
      console.log('✅ Migrations completed successfully');
      console.log('Migration output:', stdout);
      
      res.json({
        success: true,
        message: 'Database migrations completed successfully',
        output: stdout
      });
    });
  } catch (error) {
    console.error('❌ Migration error:', error);
    res.status(500).json({
      success: false,
      message: 'Migration failed',
      error: error.message
    });
  }
});

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Admin)
router.get('/dashboard', [auth, adminAuth], async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalCourses = await Course.count();
    const totalEnrollments = await Enrollment.count();
    const totalInstructors = await User.count({ where: { role: 'instructor' } });

    // Revenue calculation (assuming completed payments)
    const totalRevenue = await Enrollment.sum('paymentAmount', {
      where: { paymentStatus: 'completed' }
    }) || 0;

    // Recent enrollments
    const recentEnrollments = await Enrollment.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'student', attributes: ['name', 'email'] },
        { model: Course, as: 'course', attributes: ['title', 'price'] }
      ]
    });

    // Fetch all courses with instructor details
    const coursesRaw = await Course.findAll({
      include: [{
        model: User,
        as: 'instructor',
        attributes: ['name', 'avatar', 'title', 'bio']
      }]
    });
    // For each course, count enrollments
    const courses = await Promise.all(coursesRaw.map(async (course) => {
      const enrollmentCount = await Enrollment.count({ where: { courseId: course.id } });
      return { ...course.toJSON(), enrollmentCount };
    }));

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalCourses,
          totalEnrollments,
          totalInstructors,
          totalRevenue
        },
        courses, // Add courses array to the response
        recentEnrollments
      }
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin)
router.get('/users', [auth, adminAuth], async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;

    let whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (role) {
      whereClause.role = role;
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: users.rows,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(users.count / parseInt(limit)),
        count: users.rows.length,
        totalUsers: users.count
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

// @route   PUT /api/admin/users/:id
// @desc    Update user role or status
// @access  Private (Admin)
router.put('/users/:id', [auth, adminAuth], async (req, res) => {
  try {
    const { role, isActive } = req.body;
    
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({ role, isActive });

    res.json({
      success: true,
      message: 'User updated successfully',
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

// Get all enrollments with user and course details
router.get('/enrollments', [auth, adminAuth], async (req, res) => {
  try {
    const { Enrollment, User, Course } = require('../models');
    const enrollments = await Enrollment.findAll({
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
        { model: Course, as: 'course', attributes: ['id', 'title'] }
      ]
    });
    res.json({ success: true, data: enrollments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

// @route   GET /api/admin/certificates
// @desc    Manage all certificates
// @access  Private (Admin)
router.get('/certificates', [auth, adminAuth], async (req, res) => {
  try {
    const certificates = await Certificate.findAll({
      include: [
        { model: User, as: 'student', attributes: ['name', 'email'] },
        { model: Course, as: 'course', attributes: ['title'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: certificates
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Analytics endpoints
router.get('/analytics/user-growth', [auth, adminAuth], async (req, res) => {
  try {
    // Group users by month of registration
    const users = await User.findAll({
      attributes: [
        [Sequelize.fn('to_char', Sequelize.col('createdAt'), 'Mon YYYY'), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'users']
      ],
      group: [Sequelize.fn('to_char', Sequelize.col('createdAt'), 'Mon YYYY')],
      order: [[Sequelize.fn('MIN', Sequelize.col('createdAt')), 'ASC']]
    });
    const data = users.map(u => ({ month: u.get('month'), users: parseInt(u.get('users')) }));
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/analytics/enrollments-by-course', [auth, adminAuth], async (req, res) => {
  try {
    // Count enrollments grouped by course
    const enrollments = await Enrollment.findAll({
      attributes: [
        'courseId',
        [Sequelize.fn('COUNT', Sequelize.col('Enrollment.id')), 'enrollments']
      ],
      group: ['courseId'],
      include: [{ model: Course, as: 'course', attributes: ['title'] }],
      order: [[Sequelize.fn('COUNT', Sequelize.col('Enrollment.id')), 'DESC']]
    });
    const data = enrollments.map(e => ({
      course: e.course?.title || 'Unknown',
      enrollments: parseInt(e.get('enrollments'))
    }));
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/analytics/revenue', [auth, adminAuth], async (req, res) => {
  try {
    // Sum paymentAmount from completed enrollments grouped by month
    const revenue = await Enrollment.findAll({
      attributes: [
        [Sequelize.fn('to_char', Sequelize.col('createdAt'), 'Mon YYYY'), 'month'],
        [Sequelize.fn('SUM', Sequelize.col('paymentAmount')), 'revenue']
      ],
      where: { paymentStatus: 'completed' },
      group: [Sequelize.fn('to_char', Sequelize.col('createdAt'), 'Mon YYYY')],
      order: [[Sequelize.fn('MIN', Sequelize.col('createdAt')), 'ASC']]
    });
    const data = revenue.map(r => ({ month: r.get('month'), revenue: parseFloat(r.get('revenue')) || 0 }));
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/analytics/completion-rates', [auth, adminAuth], async (req, res) => {
  try {
    // Get all courses
    const courses = await Course.findAll({ attributes: ['id', 'title'] });
    // For each course, calculate completion rate
    const data = await Promise.all(courses.map(async (course) => {
      const total = await Enrollment.count({ where: { courseId: course.id } });
      const completed = await Enrollment.count({ where: { courseId: course.id, completionRate: 100 } });
      return {
        course: course.title,
        rate: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    }));
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/analytics/top-courses', [auth, adminAuth], async (req, res) => {
  try {
    // Count enrollments grouped by course, get top 5
    const enrollments = await Enrollment.findAll({
      attributes: [
        'courseId',
        [Sequelize.fn('COUNT', Sequelize.col('Enrollment.id')), 'enrollments']
      ],
      group: ['courseId', 'course.id', 'course.title'],
      include: [{ model: Course, as: 'course', attributes: ['id', 'title'] }],
      order: [[Sequelize.fn('COUNT', Sequelize.col('Enrollment.id')), 'DESC']],
      limit: 5
    });
    const data = enrollments.map(e => ({
      course: e.course?.title || 'Unknown',
      enrollments: parseInt(e.get('enrollments'))
    }));
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/analytics/certificates-issued', [auth, adminAuth], async (req, res) => {
  try {
    // Count certificates grouped by month
    const certs = await Certificate.findAll({
      attributes: [
        [Sequelize.fn('to_char', Sequelize.col('createdAt'), 'Mon YYYY'), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'certificates']
      ],
      group: [Sequelize.fn('to_char', Sequelize.col('createdAt'), 'Mon YYYY')],
      order: [[Sequelize.fn('MIN', Sequelize.col('createdAt')), 'ASC']]
    });
    const data = certs.map(c => ({ month: c.get('month'), certificates: parseInt(c.get('certificates')) }));
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/analytics/enrollments-over-time', [auth, adminAuth], async (req, res) => {
  try {
    // Count enrollments grouped by month
    const enrollments = await Enrollment.findAll({
      attributes: [
        [Sequelize.fn('to_char', Sequelize.col('createdAt'), 'Mon YYYY'), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'enrollments']
      ],
      group: [Sequelize.fn('to_char', Sequelize.col('createdAt'), 'Mon YYYY')],
      order: [[Sequelize.fn('MIN', Sequelize.col('createdAt')), 'ASC']]
    });
    const data = enrollments.map(e => ({ month: e.get('month'), enrollments: parseInt(e.get('enrollments')) }));
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
