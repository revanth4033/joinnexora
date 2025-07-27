
# Join Nexora - Local Development Setup

## Prerequisites
- Node.js (v18 or later)
- PostgreSQL (v12 or later)
- Git

## Database Setup

1. **Install PostgreSQL** (if not already installed)
   - Windows: Download from https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql postgresql-contrib`

2. **Create Database**
   ```bash
   # Start PostgreSQL service
   sudo service postgresql start  # Linux
   brew services start postgresql  # macOS

   # Create database
   createdb skillspark_pro_dev

   # Or using psql
   psql -U postgres
   CREATE DATABASE skillspark_pro_dev;
   \q
   ```

3. **Run Database Schema**
   ```bash
   psql -U postgres -d skillspark_pro_dev -f database-schema.sql
   ```

## Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=skillspark_pro_dev
   DB_USERNAME=postgres
   DB_PASSWORD=your_postgres_password

   # JWT Secret (generate a secure random string)
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex

   # Frontend URL
   FRONTEND_URL=http://localhost:8080

   # Stripe Configuration (get from your Stripe dashboard)
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

   # Email Configuration (optional - for sending emails)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

3. **Start Backend Server**
   ```bash
   npm run dev
   ```

## Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

## Testing the Application

1. **Access the Application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5000

2. **Test User Accounts**
   - Admin: admin@skillspark.com / password123
   - Instructor: instructor@skillspark.com / password123
   - Student: student@skillspark.com / password123

3. **API Endpoints to Test**
   - `GET /api/health` - Health check
   - `POST /api/auth/login` - User login
   - `GET /api/courses` - Get all courses
   - `POST /api/courses` - Create course (instructor/admin only)

## Common Issues and Solutions

### Database Connection Issues
- Ensure PostgreSQL is running: `sudo service postgresql status`
- Check database credentials in `.env` file
- Verify database exists: `psql -U postgres -l`

### Backend Not Starting
- Check if port 5000 is available: `lsof -i :5000`
- Verify all environment variables are set
- Check database connection

### Frontend Not Connecting to Backend
- Ensure backend is running on port 5000
- Check CORS configuration in backend
- Verify API endpoints in frontend code

## Additional Configuration

### Stripe Integration
1. Create a Stripe account at https://stripe.com
2. Get your test API keys from the Stripe dashboard
3. Add the keys to your `.env` file
4. Test payments will work with Stripe's test card numbers

### File Upload (Optional)
For file uploads (course thumbnails, user avatars), you can:
1. Use local file storage (default setup)
2. Configure AWS S3 or compatible storage
3. Update the upload middleware configuration

## Production Deployment

When ready for production:
1. Update environment variables for production
2. Use production database
3. Configure domain and SSL certificates
4. Set up proper error logging and monitoring

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify database connections
3. Ensure all dependencies are installed
4. Check that all environment variables are properly set
