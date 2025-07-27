
const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const Course = db.Course;
const User = db.User;
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const Section = db.Section;
const Lesson = db.Lesson;
const Resource = db.Resource;

const router = express.Router();

// Helper to update totalDuration for a course
async function updateCourseTotalDuration(courseId) {
  const lessons = await Lesson.findAll({ where: { courseId } });
  const total = lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
  await Course.update({ totalDuration: total }, { where: { id: courseId } });
}

// @route   GET /api/courses
// @desc    Get all courses with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      level,
      search,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    let query = { isPublished: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (level && level !== 'all') {
      query.level = level;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    // Execute query with pagination
    const courses = await Course.findAll({
      where: query,
      include: [{ 
        model: User, 
        as: 'instructor',
        attributes: ['name', 'avatar', 'title', 'bio'] 
      }],
      order: [[sort, order]],
      limit: limit * 1,
      offset: (page - 1) * limit,
      attributes: { exclude: ['lessons'] }
    });

    const total = await Course.count({ where: query });

    res.json({
      success: true,
      data: courses,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: courses.length,
        totalCourses: total
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

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [{ 
        model: User, 
        as: 'instructor',
        attributes: ['name', 'avatar', 'title', 'bio'] 
      }]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Count enrollments for this course
    const Enrollment = require('../models').Enrollment;
    const enrollmentCount = await Enrollment.count({ where: { courseId: course.id } });
    const courseWithCount = course.toJSON();
    courseWithCount.enrollmentCount = enrollmentCount;

    res.json({
      success: true,
      data: courseWithCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/courses
// @desc    Create course
// @access  Private (Instructor/Admin)
router.post('/', [auth, upload.single('thumbnail')], [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('shortDescription').notEmpty().withMessage('Short description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('level').notEmpty().withMessage('Level is required'),
  body('price').isNumeric().withMessage('Price must be a number')
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

    // Check if user is instructor or admin
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only instructors can create courses.'
      });
    }

    const courseData = {
      ...req.body,
      instructorId: req.body.instructorId, // Save instructor ID
      thumbnail: req.file ? req.file.path : req.body.thumbnail
    };

    // Parse array fields if they are sent as JSON strings
    const arrayFields = ['whatYouWillLearn', 'prerequisites', 'tags', 'courseIncludes'];
    arrayFields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        try {
          courseData[field] = JSON.parse(req.body[field]);
        } catch {
          courseData[field] = [];
        }
      }
    });

    const course = await Course.create(courseData);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private (Instructor/Admin)
router.put('/:id', [auth, upload.single('thumbnail')], async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership - instructor field now contains the instructor name, not user ID
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.thumbnail = req.file.path;
    }

    if (req.body.whatYouWillLearn && typeof req.body.whatYouWillLearn === 'string') {
      updateData.whatYouWillLearn = req.body.whatYouWillLearn.split(',');
    }

    if (req.body.prerequisites && typeof req.body.prerequisites === 'string') {
      updateData.prerequisites = req.body.prerequisites.split(',');
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      updateData.tags = req.body.tags.split(',');
    }

    const updatedCourse = await Course.update(updateData, {
      where: { id: req.params.id },
      returning: true,
      plain: true
    }).then(([rowsUpdated, [updatedCourse]]) => updatedCourse);

    await updatedCourse.reload({ 
      include: [{ 
        model: User, 
        as: 'instructor',
        attributes: ['name', 'avatar', 'title', 'bio'] 
      }] 
    });

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private (Instructor/Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership - instructor field now contains the instructor name, not user ID
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Course.destroy({ where: { id: req.params.id } });

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// SECTION ROUTES
router.get('/:courseId/sections', async (req, res) => {
  try {
    const sections = await Section.findAll({
      where: { courseId: req.params.courseId },
      order: [['order', 'ASC']]
    });
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:courseId/sections', auth, async (req, res) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }
  try {
    const { title, order } = req.body;
    const section = await Section.create({
      title,
      order,
      courseId: req.params.courseId
    });
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:courseId/sections/:sectionId', auth, async (req, res) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }
  try {
    const section = await Section.findByPk(req.params.sectionId);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    section.title = req.body.title || section.title;
    section.order = req.body.order || section.order;
    await section.save();
    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:courseId/sections/:sectionId', auth, async (req, res) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }
  try {
    const section = await Section.findByPk(req.params.sectionId);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    await section.destroy();
    res.json({ success: true, message: 'Section deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// LESSON ROUTES (within section)
router.get('/:courseId/sections/:sectionId/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.findAll({
      where: { sectionId: req.params.sectionId },
      order: [['order', 'ASC']]
    });
    res.json({ success: true, data: lessons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:courseId/sections/:sectionId/lessons', auth, async (req, res) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }
  try {
    const { title, description, videoUrl, duration, order, isPreview } = req.body;
    const lesson = await Lesson.create({
      title,
      description,
      videoUrl,
      duration,
      order,
      isPreview,
      courseId: req.params.courseId,
      sectionId: req.params.sectionId
    });
    // Update totalDuration
    await updateCourseTotalDuration(req.params.courseId);
    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    console.error(error); // Ensure error is logged
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:courseId/sections/:sectionId/lessons/:lessonId', auth, async (req, res) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }
  try {
    const lesson = await Lesson.findByPk(req.params.lessonId);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    Object.assign(lesson, req.body);
    await lesson.save();
    // Update totalDuration
    await updateCourseTotalDuration(req.params.courseId);
    res.json({ success: true, data: lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:courseId/sections/:sectionId/lessons/:lessonId', auth, async (req, res) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }
  try {
    const lesson = await Lesson.findByPk(req.params.lessonId);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    await lesson.destroy();
    // Update totalDuration
    await updateCourseTotalDuration(req.params.courseId);
    res.json({ success: true, message: 'Lesson deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// RESOURCE ROUTES
router.get('/:courseId/resources', async (req, res) => {
  try {
    const resources = await Resource.findAll({
      where: { courseId: req.params.courseId }
    });
    res.json({ success: true, data: resources });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:courseId/resources', auth, async (req, res) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }
  try {
    const { title, url, type, sectionId, lessonId } = req.body;
    const resource = await Resource.create({
      title,
      url,
      type,
      courseId: req.params.courseId,
      sectionId,
      lessonId
    });
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:courseId/resources/:resourceId', auth, async (req, res) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }
  try {
    const resource = await Resource.findByPk(req.params.resourceId);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    await resource.destroy();
    res.json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
