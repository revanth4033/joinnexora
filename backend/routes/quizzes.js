
const express = require('express');
const { Quiz, QuizAttempt, Course, Certificate } = require('../models');
const { auth } = require('../middleware/auth');
const certificateService = require('../services/certificateService');
const emailService = require('../services/emailService');

const router = express.Router();

// @route   POST /api/quizzes/:quizId/attempt
// @desc    Submit quiz attempt
// @access  Private
router.post('/:quizId/attempt', auth, async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;
    const { quizId } = req.params;

    const quiz = await Quiz.findByPk(quizId, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / totalQuestions) * 100;
    const passed = score >= quiz.passingScore;

    // Get attempt number
    const previousAttempts = await QuizAttempt.count({
      where: { studentId: req.user.id, quizId }
    });

    const attempt = await QuizAttempt.create({
      studentId: req.user.id,
      quizId,
      answers,
      score,
      passed,
      timeSpent,
      attemptNumber: previousAttempts + 1
    });

    // If passed and no certificate exists, generate one
    if (passed) {
      const existingCertificate = await Certificate.findOne({
        where: { studentId: req.user.id, courseId: quiz.course.id }
      });

      if (!existingCertificate) {
        // Generate certificate
        const user = req.user;
        const pdfBuffer = await certificateService.generateCertificate(
          user.name,
          quiz.course.title,
          new Date().toLocaleDateString(),
          quiz.course.instructor?.name || 'Instructor'
        );

        const fileName = `${user.name.replace(/\s+/g, '_')}_${quiz.course.title.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        const certificateUrl = await certificateService.uploadCertificate(pdfBuffer, fileName);

        await certificateService.createCertificateRecord(
          user.id,
          quiz.course.id,
          certificateUrl,
          score
        );

        // Send certificate email
        if (user.email) {
          await emailService.sendCertificateEmail(
            user.email,
            user.name,
            quiz.course.title,
            certificateUrl
          );
        }
      }
    }

    res.json({
      success: true,
      data: {
        attempt,
        passed,
        score,
        correctAnswers,
        totalQuestions
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

// @route   GET /api/quizzes/course/:courseId
// @desc    Get course quiz
// @access  Private
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      where: { courseId: req.params.courseId, isActive: true }
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'No quiz found for this course'
      });
    }

    // Remove correct answers from questions for students
    const sanitizedQuestions = quiz.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      type: q.type
    }));

    res.json({
      success: true,
      data: {
        ...quiz.toJSON(),
        questions: sanitizedQuestions
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
