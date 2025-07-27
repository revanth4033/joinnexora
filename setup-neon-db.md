# 🗄️ Neon Database Setup for JoinNexora

## Quick Setup Guide

### 1. Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub/Google
3. Create new project: `joinnexora-db`

### 2. Get Connection Details
After creating project, you'll get:
```
Host: ep-cool-name-123456.us-east-1.aws.neon.tech
Database: neondb
User: your_username
Password: your_password
```

### 3. Connection String Format
```
postgresql://username:password@host/database
```

### 4. Environment Variables for Render
Set these in your Render backend service:
```
DB_HOST=ep-cool-name-123456.us-east-1.aws.neon.tech
DB_NAME=neondb
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_PORT=5432
```

### 5. Test Connection
After deployment, your backend will automatically connect to Neon.

### 6. Run Migrations
In Render backend shell:
```bash
npm run migrate
```

## ✅ Neon Benefits
- **Free Tier**: 3GB storage, 10GB transfer
- **Auto-scaling**: Handles traffic spikes
- **Branching**: Create database branches for testing
- **Connection pooling**: Built-in performance optimization

## 🔗 Next Steps
1. Set up Neon database (above)
2. Deploy backend to Render
3. Deploy frontend to Render
4. Test the full application 