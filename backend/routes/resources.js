const express = require('express');
const router = express.Router();
const { Resource, Course, Section, Lesson } = require('../models');
const auth = require('../middleware/auth');

// Get all resources for a course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const resources = await Resource.findAll({
      where: { courseId },
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title'] },
        { model: Section, as: 'section', attributes: ['id', 'title'] },
        { model: Lesson, as: 'lesson', attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Get all resources for a section
router.get('/section/:sectionId', auth, async (req, res) => {
  try {
    const { sectionId } = req.params;
    
    const resources = await Resource.findAll({
      where: { sectionId },
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title'] },
        { model: Section, as: 'section', attributes: ['id', 'title'] },
        { model: Lesson, as: 'lesson', attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(resources);
  } catch (error) {
    console.error('Error fetching section resources:', error);
    res.status(500).json({ error: 'Failed to fetch section resources' });
  }
});

// Get all resources for a lesson
router.get('/lesson/:lessonId', auth, async (req, res) => {
  try {
    const { lessonId } = req.params;
    
    const resources = await Resource.findAll({
      where: { lessonId },
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title'] },
        { model: Section, as: 'section', attributes: ['id', 'title'] },
        { model: Lesson, as: 'lesson', attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(resources);
  } catch (error) {
    console.error('Error fetching lesson resources:', error);
    res.status(500).json({ error: 'Failed to fetch lesson resources' });
  }
});

// Create a new resource
router.post('/', auth, async (req, res) => {
  try {
    const { title, url, type, courseId, sectionId, lessonId } = req.body;
    
    // Validate required fields
    if (!title || !url || !type) {
      return res.status(400).json({ error: 'Title, URL, and type are required' });
    }

    // At least one of courseId, sectionId, or lessonId must be provided
    if (!courseId && !sectionId && !lessonId) {
      return res.status(400).json({ error: 'Must specify courseId, sectionId, or lessonId' });
    }

    const resource = await Resource.create({
      title,
      url,
      type,
      courseId,
      sectionId,
      lessonId
    });

    // Fetch the created resource with associations
    const createdResource = await Resource.findByPk(resource.id, {
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title'] },
        { model: Section, as: 'section', attributes: ['id', 'title'] },
        { model: Lesson, as: 'lesson', attributes: ['id', 'title'] }
      ]
    });

    res.status(201).json(createdResource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
});

// Update a resource
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, type, courseId, sectionId, lessonId } = req.body;
    
    const resource = await Resource.findByPk(id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Update fields
    if (title !== undefined) resource.title = title;
    if (url !== undefined) resource.url = url;
    if (type !== undefined) resource.type = type;
    if (courseId !== undefined) resource.courseId = courseId;
    if (sectionId !== undefined) resource.sectionId = sectionId;
    if (lessonId !== undefined) resource.lessonId = lessonId;

    await resource.save();

    // Fetch the updated resource with associations
    const updatedResource = await Resource.findByPk(id, {
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title'] },
        { model: Section, as: 'section', attributes: ['id', 'title'] },
        { model: Lesson, as: 'lesson', attributes: ['id', 'title'] }
      ]
    });

    res.json(updatedResource);
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// Delete a resource
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const resource = await Resource.findByPk(id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    await resource.destroy();
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

module.exports = router; 