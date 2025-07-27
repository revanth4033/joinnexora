# Render Deployment Guide for Join Nexora LMS

## 🚀 Complete Application Deployment on Render

This guide will help you deploy your entire application (frontend, backend, and database) on Render in one platform.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Payment Services**: Stripe/Razorpay accounts for payments
4. **Storage Service**: Local file storage (no external service needed)

## 🛠️ Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done)
2. **Ensure the `render.yaml` file is in your root directory**

### Step 2: Deploy on Render

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Blueprint"

2. **Connect Your Repository**
   - Connect your GitHub account
   - Select your repository
   - Render will automatically detect the `render.yaml` file

3. **Review and Deploy**
   - Render will show you the services it will create:
     - `skillspark-database` (PostgreSQL)
     - `skillspark-backend` (Node.js API)
     - `skillspark-frontend` (React App)
   - Click "Apply" to start deployment

### Step 3: Configure Environment Variables

After deployment, configure these in your backend service:

#### Required Variables (Set in Render Dashboard):
```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

BREVO_API_KEY=your_brevo_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Auto-Configured Variables:
- Database credentials (auto-linked)
- JWT_SECRET (auto-generated)
- SESSION_SECRET (auto-generated)
- FRONTEND_URL (auto-set)

### Step 4: Database Setup

1. **Run Migrations**
   - Go to your backend service in Render
   - Open the shell/terminal
   - Run: `npm run migrate`

2. **Seed Data (Optional)**
   - Run: `npm run seed`

### Step 5: Update Frontend Configuration

1. **Update API URL**
   - The frontend will automatically use the backend URL
   - Verify in your frontend service that `VITE_API_URL` points to your backend

2. **Update Payment Keys**
   - Set `VITE_RAZORPAY_KEY_ID` in frontend environment variables

## 🔧 Manual Deployment (Alternative)

If you prefer to deploy services individually:

### 1. Deploy Database
- New → PostgreSQL
- Name: `skillspark-database`
- Plan: Free

### 2. Deploy Backend
- New → Web Service
- Connect your GitHub repo
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables: (see above)

### 3. Deploy Frontend
- New → Static Site
- Connect your GitHub repo
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

## 🌐 Your Application URLs

After deployment, you'll have:
- **Frontend**: `https://skillspark-frontend.onrender.com`
- **Backend API**: `https://skillspark-backend.onrender.com`
- **Database**: Managed by Render

## 🔍 Testing Your Deployment

1. **Health Check**: Visit `https://skillspark-backend.onrender.com/api/health`
2. **Frontend**: Visit `https://skillspark-frontend.onrender.com`
3. **Test User Registration/Login**
4. **Test Course Creation and Enrollment**

## 🚨 Important Notes

### Free Tier Limitations:
- **Database**: 90 days free, then $7/month
- **Web Services**: Sleep after 15 minutes of inactivity
- **Static Sites**: Always active

### Production Considerations:
- **Upgrade to paid plans** for always-on services
- **Set up custom domains** for better branding
- **Configure SSL certificates** (auto-handled by Render)
- **Set up monitoring and alerts**

### Security:
- **Environment variables** are encrypted in Render
- **Database** is automatically secured
- **HTTPS** is enabled by default

## 🔄 Continuous Deployment

Render automatically deploys when you push to your main branch. To disable:
- Go to your service settings
- Toggle "Auto-Deploy" off

## 📞 Support

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Render Community**: [community.render.com](https://community.render.com)
- **GitHub Issues**: For application-specific issues

## 🎉 Success!

Your complete application is now deployed on Render with:
- ✅ Frontend (React)
- ✅ Backend (Node.js/Express)
- ✅ Database (PostgreSQL)
- ✅ Automatic deployments
- ✅ SSL certificates
- ✅ Global CDN

Your LMS is ready for users! 🚀 