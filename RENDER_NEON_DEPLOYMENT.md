# 🚀 Render + Neon Deployment Guide for JoinNexora

## 📋 **Deployment Architecture**
- **Frontend**: Render Static Site
- **Backend**: Render Web Service  
- **Database**: Neon PostgreSQL (External)

## 🛠️ **Step-by-Step Deployment**

### Step 1: Set Up Neon Database

1. **Create Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up for free account
   - Create new project

2. **Get Database Credentials**
   - Copy your connection string from Neon dashboard
   - It will look like: `postgresql://username:password@host/database`

3. **Database Setup**
   - Neon automatically creates your database
   - No manual setup needed

### Step 2: Deploy Backend to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up and connect GitHub

2. **Deploy Backend Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     ```
     Name: joinnexora-backend
     Root Directory: backend
     Environment: Node
     Build Command: npm install
     Start Command: npm start
     ```

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   
   # Neon Database
   DB_USERNAME=your_neon_username
   DB_PASSWORD=your_neon_password
   DB_NAME=your_neon_database
   DB_HOST=your_neon_host
   DB_PORT=5432
   
   # JWT & Session
   JWT_SECRET=your_very_long_random_secret_key
   SESSION_SECRET=your_very_long_random_session_key
   
   # Frontend URL (will be set after frontend deployment)
   FRONTEND_URL=https://your-frontend-url.onrender.com
   
   # Payment (Razorpay)
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   
   # Email (Brevo)
   BREVO_API_KEY=your_brevo_api_key
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Run Database Migrations**
   - Go to your backend service in Render
   - Open Shell/Console
   - Run: `npm run migrate`

### Step 3: Deploy Frontend to Render

1. **Deploy Frontend Service**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     ```
     Name: joinnexora-frontend
     Root Directory: (leave empty - root)
     Build Command: npm install && npm run build
     Publish Directory: dist
     ```

2. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
   ```

3. **Update Backend CORS**
   - Go back to your backend service
   - Update `FRONTEND_URL` environment variable with your frontend URL

### Step 4: Test Your Deployment

1. **Health Check**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Frontend Test**
   - Visit your frontend URL
   - Should load without errors

3. **Database Test**
   - Try user registration
   - Check if data is saved in Neon database

## 🔧 **Manual Deployment (Alternative)**

If you prefer manual setup:

### Backend Deployment
```bash
# In Render Dashboard
Service Type: Web Service
Repository: your-github-repo
Root Directory: backend
Build Command: npm install
Start Command: npm start
Environment: Node
```

### Frontend Deployment
```bash
# In Render Dashboard  
Service Type: Static Site
Repository: your-github-repo
Root Directory: (empty)
Build Command: npm install && npm run build
Publish Directory: dist
```

## 🌐 **Your URLs After Deployment**

- **Frontend**: `https://joinnexora-frontend.onrender.com`
- **Backend**: `https://joinnexora-backend.onrender.com`
- **Database**: Managed by Neon

## 🔍 **Troubleshooting**

### Common Issues:

1. **Database Connection Error**
   - Verify Neon credentials in environment variables
   - Check if Neon database is active

2. **CORS Errors**
   - Ensure `FRONTEND_URL` in backend matches your frontend URL
   - Check for typos in URLs

3. **Build Failures**
   - Check build logs in Render dashboard
   - Verify all dependencies are in package.json

4. **Environment Variables**
   - Double-check all variables are set correctly
   - No spaces around `=` in environment variables

## 📊 **Costs**

- **Render**: Free tier available
  - Web Services: Sleep after 15 minutes (free)
  - Static Sites: Always active (free)
- **Neon**: Free tier available
  - 3GB storage
  - 10GB transfer
  - Perfect for development/small production

## 🎯 **Success Checklist**

- [ ] Neon database created and connected
- [ ] Backend deployed and responding to health check
- [ ] Frontend deployed and loading
- [ ] Database migrations run successfully
- [ ] User registration working
- [ ] Course creation working
- [ ] Payment integration working

## 🚀 **Ready to Deploy!**

Your JoinNexora project is configured for Render + Neon deployment. Follow the steps above and you'll have a production-ready LMS platform! 