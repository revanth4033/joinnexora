
const { Sequelize } = require('sequelize');
const config = require('../config/database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// Import models
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Course = require('./Course')(sequelize, Sequelize.DataTypes);
const Enrollment = require('./Enrollment')(sequelize, Sequelize.DataTypes);
const Lesson = require('./Lesson')(sequelize, Sequelize.DataTypes);
const Certificate = require('./Certificate')(sequelize, Sequelize.DataTypes);
const Review = require('./Review')(sequelize, Sequelize.DataTypes);
const Quiz = require('./Quiz')(sequelize, Sequelize.DataTypes);
const QuizAttempt = require('./QuizAttempt')(sequelize, Sequelize.DataTypes);
const Coupon = require('./Coupon')(sequelize, Sequelize.DataTypes);
const Section = require('./Section')(sequelize, Sequelize.DataTypes);
const Resource = require('./Resource')(sequelize, Sequelize.DataTypes);
const ContactMessage = require('./ContactMessage')(sequelize, Sequelize.DataTypes);

// Define associations
// Removed instructor associations since instructor is now a string field, not a foreign key

User.belongsToMany(Course, { 
  through: Enrollment, 
  foreignKey: 'studentId',
  as: 'enrolledCourses'
});
Course.belongsToMany(User, { 
  through: Enrollment, 
  foreignKey: 'courseId',
  as: 'students'
});

Course.hasMany(Lesson, { foreignKey: 'courseId', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Section associations
Course.hasMany(Section, { foreignKey: 'courseId', as: 'sections' });
Section.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Section.hasMany(Lesson, { foreignKey: 'sectionId', as: 'lessons' });
Lesson.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });

// Resource associations
Course.hasMany(Resource, { foreignKey: 'courseId', as: 'resources' });
Resource.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Section.hasMany(Resource, { foreignKey: 'sectionId', as: 'resources' });
Resource.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });

Lesson.hasMany(Resource, { foreignKey: 'lessonId', as: 'resources' });
Resource.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' });

Enrollment.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Certificate associations
User.hasMany(Certificate, { foreignKey: 'studentId', as: 'certificates' });
Course.hasMany(Certificate, { foreignKey: 'courseId', as: 'certificates' });
Certificate.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Certificate.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Review associations
User.hasMany(Review, { foreignKey: 'studentId', as: 'reviews' });
Course.hasMany(Review, { foreignKey: 'courseId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Review.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Quiz associations
Course.hasMany(Quiz, { foreignKey: 'courseId', as: 'quizzes' });
Quiz.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

User.hasMany(QuizAttempt, { foreignKey: 'studentId', as: 'quizAttempts' });
Quiz.hasMany(QuizAttempt, { foreignKey: 'quizId', as: 'attempts' });
QuizAttempt.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
QuizAttempt.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });

const db = {
  sequelize,
  Sequelize,
  User,
  Course,
  Enrollment,
  Lesson,
  Certificate,
  Review,
  Quiz,
  QuizAttempt,
  Coupon,
  Section,
  Resource,
  ContactMessage
};

module.exports = db;

if (Course.associate) {
  Course.associate({ User });
}
