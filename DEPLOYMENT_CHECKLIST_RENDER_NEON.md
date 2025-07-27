# ✅ Render + Neon Deployment Checklist

## 🗄️ **Step 1: Neon Database Setup**
- [ ] Create Neon account at [neon.tech](https://neon.tech)
- [ ] Create new project: `joinnexora-db`
- [ ] Copy database credentials:
  - [ ] Host
  - [ ] Database name
  - [ ] Username
  - [ ] Password
  - [ ] Port (usually 5432)

## 🚀 **Step 2: Render Backend Deployment**
- [ ] Create Render account at [render.com](https://render.com)
- [ ] Connect GitHub repository
- [ ] Create new Web Service:
  - [ ] Name: `joinnexora-backend`
  - [ ] Repository: Your GitHub repo
  - [ ] Root Directory: `backend`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
  - [ ] Environment: Node

### Environment Variables (Backend)
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `DB_HOST=your_neon_host`
- [ ] `DB_NAME=your_neon_database`
- [ ] `DB_USERNAME=your_neon_username`
- [ ] `DB_PASSWORD=your_neon_password`
- [ ] `DB_PORT=5432`
- [ ] `JWT_SECRET=your_long_random_secret`
- [ ] `SESSION_SECRET=your_long_random_session_secret`
- [ ] `FRONTEND_URL=https://your-frontend-url.onrender.com`
- [ ] `RAZORPAY_KEY_ID=your_razorpay_key`
- [ ] `RAZORPAY_KEY_SECRET=your_razorpay_secret`
- [ ] `BREVO_API_KEY=your_brevo_api_key`
- [ ] `GOOGLE_CLIENT_ID=your_google_client_id`
- [ ] `GOOGLE_CLIENT_SECRET=your_google_client_secret`

## 🌐 **Step 3: Render Frontend Deployment**
- [ ] Create new Static Site:
  - [ ] Name: `joinnexora-frontend`
  - [ ] Repository: Your GitHub repo
  - [ ] Root Directory: (leave empty)
  - [ ] Build Command: `npm install && npm run build`
  - [ ] Publish Directory: `dist`

### Environment Variables (Frontend)
- [ ] `VITE_API_URL=https://your-backend-url.onrender.com`
- [ ] `VITE_RAZORPAY_KEY_ID=your_razorpay_key`

## 🔧 **Step 4: Database Setup**
- [ ] Go to backend service in Render
- [ ] Open Shell/Console
- [ ] Run: `npm run migrate`
- [ ] Verify tables created successfully

## 🧪 **Step 5: Testing**
- [ ] Backend health check: `https://your-backend-url.onrender.com/api/health`
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Course creation works (admin)
- [ ] Course enrollment works
- [ ] Payment integration works

## 🔗 **Step 6: Update URLs**
- [ ] Update backend `FRONTEND_URL` with actual frontend URL
- [ ] Update frontend `VITE_API_URL` with actual backend URL
- [ ] Test CORS is working

## 📊 **Step 7: Monitor**
- [ ] Check Render logs for errors
- [ ] Monitor Neon database usage
- [ ] Test all major features
- [ ] Verify admin panel access

## 🎯 **Success Indicators**
- [ ] ✅ Backend responds to health check
- [ ] ✅ Frontend loads completely
- [ ] ✅ Database migrations successful
- [ ] ✅ User registration/login working
- [ ] ✅ Course management working
- [ ] ✅ Payment processing working
- [ ] ✅ Admin panel accessible

## 🚨 **Troubleshooting**
If something fails:
1. Check Render build logs
2. Verify environment variables
3. Check Neon database connection
4. Test API endpoints manually
5. Check CORS configuration

## 🎉 **Deployment Complete!**
Your JoinNexora LMS is now live on:
- **Frontend**: `https://joinnexora-frontend.onrender.com`
- **Backend**: `https://joinnexora-backend.onrender.com`
- **Database**: Neon (managed)

**Congratulations! 🚀** 