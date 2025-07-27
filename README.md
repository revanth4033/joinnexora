
# Join Nexora - Complete Learning Management System (LMS)

A modern, full-stack Learning Management System built with React frontend and Node.js backend, featuring PostgreSQL database and Wasabi cloud storage.

## 🚀 Updated Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI component library
- **React Router DOM** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database (Railway)
- **Sequelize** - PostgreSQL ORM
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Stripe** - Payment processing
- **Wasabi** - S3-compatible cloud storage
- **NodeMailer** - Email sending

### Database & Storage
- **PostgreSQL (Railway)** - Production-ready database with ACID compliance
- **Wasabi Cloud Storage** - Cost-effective S3-compatible storage for videos and files

### Deployment
- **Frontend**: Vercel - Global CDN with automatic deployments
- **Backend + Database**: Railway - Containerized deployment with built-in PostgreSQL

## 📋 Key Features

### User Management
- User registration and authentication with JWT
- Role-based access (Student, Instructor, Admin)
- Profile management with avatar upload to Wasabi
- Password reset functionality via email

### Course Management
- Create, edit, and delete courses
- Video lessons with progress tracking
- Course categories and difficulty levels
- Course ratings and reviews system
- Advanced search and filtering capabilities

### Learning Experience
- Course enrollment system
- Video player with progress tracking
- Course completion certificates
- Personal learning dashboard
- Learning statistics and analytics

### Payment System
- Secure payment processing with Stripe
- Course purchase functionality
- Payment history and receipts
- Subscription management

### Admin Features
- User management dashboard
- Course approval system
- Platform analytics and reporting
- Content moderation tools

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **Railway Account** (for PostgreSQL database)
- **Wasabi Account** (for cloud storage)
- **Stripe Account** (for payments)
- **npm** or **yarn**

### Quick Setup

1. **Install Dependencies**
   ```bash
   # Option A: Manual installation
   npm install
   cd backend && npm install && cd ..
   
   # Option B: Using setup script
   node scripts/install.js
   ```

2. **Database Setup (Railway)**
   - Create account at [railway.app](https://railway.app)
   - Create new project with PostgreSQL
   - Copy database credentials from Railway dashboard

3. **Storage Setup (Wasabi)**
   - Create account at [wasabi.com](https://wasabi.com)
   - Create bucket with public read access
   - Generate API access keys

4. **Environment Configuration**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your credentials
   ```

5. **Database Migration**
   ```bash
   cd backend
   npm install -g sequelize-cli
   npm run migrate
   cd ..
   ```

6. **Start Development Servers**
   ```bash
   # Option A: Separate terminals
   cd backend && npm run dev  # Terminal 1
   npm run dev                # Terminal 2
   
   # Option B: Single command
   node scripts/dev.js
   ```

### Environment Variables

Configure these in `backend/.env`:

```env
# Database (Railway PostgreSQL)
DB_HOST=containers-us-west-xx.railway.app
DB_PORT=5432
DB_NAME=railway
DB_USERNAME=postgres
DB_PASSWORD=your_railway_password

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Wasabi Storage
WASABI_ENDPOINT=s3.wasabisys.com
WASABI_ACCESS_KEY=your_wasabi_access_key
WASABI_SECRET_KEY=your_wasabi_secret_key
WASABI_BUCKET_NAME=your_bucket_name
WASABI_REGION=us-east-1

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel login
vercel

# Configure:
# - Build Command: npm run build
# - Output Directory: dist
# - Install Command: npm install
```

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Add environment variables in Railway dashboard  
3. Railway automatically deploys from your repo
4. Update `FRONTEND_URL` to your Vercel domain

### Production URLs
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`
- Database: Managed by Railway

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses (with filtering)
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (instructor/admin)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Enrollments
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments/my-courses` - Get user's courses
- `PUT /api/enrollments/:courseId/progress` - Update progress

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/dashboard` - Get dashboard data

### Payments
- `POST /api/payments/create-payment-intent` - Create Stripe payment
- `POST /api/payments/webhook` - Stripe webhook handler

## 🎯 Why This Tech Stack?

### PostgreSQL over MongoDB
- **ACID Compliance**: Ensures data integrity for payments and enrollments
- **Complex Queries**: Better support for reporting and analytics
- **Relationships**: Natural fit for user-course relationships
- **Railway Integration**: Seamless deployment and scaling

### Wasabi over Traditional CDNs
- **Cost Effective**: 80% cheaper than AWS S3
- **No Egress Fees**: Free data transfer out
- **S3 Compatible**: Drop-in replacement for existing S3 code
- **Global Performance**: Built-in CDN for fast video delivery

### Vercel + Railway Deployment
- **Vercel Frontend**: 
  - Global edge network
  - Automatic deployments from Git
  - Built-in performance optimization
- **Railway Backend**:
  - Containerized deployment
  - Automatic scaling
  - Built-in database management
  - Simple environment management

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Database connection test
node -e "const db = require('./backend/models'); db.sequelize.authenticate().then(() => console.log('✅ Database connected')).catch(err => console.error('❌ Database error:', err));"
```

## 📖 Usage Guide

### For Students
1. Register and verify email
2. Browse courses by category
3. Preview lessons before purchase
4. Secure payment via Stripe
5. Track learning progress
6. Download completion certificates

### For Instructors  
1. Apply for instructor status
2. Create courses with video uploads to Wasabi
3. Set pricing and course details
4. Monitor student progress
5. Earn revenue from enrollments

### For Administrators
1. Manage users and permissions
2. Review and approve courses
3. Monitor platform analytics
4. Handle payments and disputes
5. Configure system settings

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

- Email: support@skillsparkpro.com
- Documentation: Complete setup guide in `setup-instructions.md`
- Issues: GitHub Issues for bug reports

---

**Built with ❤️ using modern web technologies for scalable learning platforms**
