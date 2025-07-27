const express = require('express');
const { Enrollment, Course, Certificate, User } = require('../models');
const { auth } = require('../middleware/auth');
const certificateService = require('../services/certificateService');
const emailService = require('../services/emailService');

const router = express.Router();

// @route   POST /api/certificates/request
// @desc    Issue certificate if all lessons completed
// @access  Private
router.post('/request', auth, async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required' });
    }
    const userId = req.user.id;
    const enrollment = await Enrollment.findOne({
      where: { studentId: userId, courseId },
      include: [{ model: Course, as: 'course' }]
    });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    // Check if all lessons are completed
    const course = enrollment.course;
    const sections = await course.getSections({ include: ['lessons'] });
    const allLessons = sections.flatMap(s => s.lessons);
    const completedLessonIds = (enrollment.progress || []).map(p => p.lessonId);
    const allCompleted = allLessons.length > 0 && allLessons.every(l => completedLessonIds.includes(l.id));
    if (!allCompleted) {
      return res.status(400).json({ success: false, message: 'All lessons must be completed to get certificate.' });
    }
    // Check if certificate already exists
    let certificate = await Certificate.findOne({ where: { studentId: userId, courseId } });
    if (certificate) {
      return res.json({ success: true, certificateUrl: certificate.certificateUrl });
    }
    // Generate certificate
    const user = await User.findByPk(userId);
    const pdfBuffer = await certificateService.generateCertificate(
      user.name,
      course.title,
      new Date().toLocaleDateString(),
      'JoinNexora'
    );
    const fileName = `${user.name.replace(/\s+/g, '_')}_${course.title.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    const certificateUrl = await certificateService.uploadCertificate(pdfBuffer, fileName);
    certificate = await certificateService.createCertificateRecord(userId, courseId, certificateUrl);
    // Optionally send email
    if (user.email) {
      await emailService.sendCertificateEmail(user.email, user.name, course.title, certificateUrl);
    }
    return res.json({ success: true, certificateUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router; 