const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const path = require('path');

const db = require('./models');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');
const enrollmentRoutes = require('./routes/enrollments');
const paymentsRouter = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const reviewRoutes = require('./routes/reviews');
const quizRoutes = require('./routes/quizzes');
const couponRoutes = require('./routes/coupons');
const resourceRoutes = require('./routes/resources');
const certificatesRouter = require('./routes/certificates');
const session = require('express-session');
const passport = require('./auth/google');
const contactRoutes = require('./routes/contact');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session and Passport middleware for Google OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Database connection and sync
db.sequelize.sync({ force: false })
  .then(async () => {
    console.log('✅ Database connected and synced');
    
    // Run migrations automatically in production
    if (process.env.NODE_ENV === 'production') {
      try {
        console.log('🔄 Running database migrations...');
        const { exec } = require('child_process');
        const path = require('path');
        
        exec('npx sequelize-cli db:migrate', { cwd: __dirname }, (error, stdout, stderr) => {
          if (error) {
            console.error('❌ Migration error:', error);
          } else {
            console.log('✅ Migrations completed successfully');
            console.log('Migration output:', stdout);
          }
        });
      } catch (err) {
        console.error('❌ Migration error:', err);
      }
    }
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/payments', paymentsRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/certificates', certificatesRouter);
app.use('/api/contact', contactRoutes);
app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
