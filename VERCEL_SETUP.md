# Vercel Deployment Setup Guide

## ✅ Repository Status
- ✓ Repository cloned from GitHub: `mons-debug/zolardrop02`
- ✓ Vercel CLI installed (version 48.10.7)
- ✓ Project ready for deployment

## 🚀 Quick Setup Steps

### 1. Login to Vercel
Run this command in the `zolardrop02` directory:
```powershell
cd C:\Users\pc\z\zolardrop02
vercel login
```

This will:
- Open a browser window for authentication
- Or provide a device code to enter at https://vercel.com/oauth/device

### 2. Link Your Project
After logging in, link your project to Vercel:
```powershell
vercel link
```

You'll be prompted to:
- Link to an existing project, or
- Create a new project

### 3. Deploy to Vercel
Deploy your project:
```powershell
# Preview deployment
vercel

# Production deployment
vercel --prod
```

## 📋 Environment Variables

Before deploying, make sure to set up environment variables in Vercel:

1. Go to your project settings in Vercel dashboard
2. Navigate to "Environment Variables"
3. Add the following variables (based on your `.env` file):

```
DATABASE_URL=your_database_url
ADMIN_TOKEN=admin-token-123
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=your-pusher-cluster
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=your-pusher-cluster
```

## 🔗 GitHub Integration (Optional)

To enable automatic deployments on git push:

1. In Vercel dashboard, go to your project
2. Navigate to "Settings" → "Git"
3. Connect your GitHub repository
4. Select the repository: `mons-debug/zolardrop02`
5. Configure build settings (already configured in `vercel.json`)

## 📝 Project Configuration

Your project already has `vercel.json` configured with:
- Build command: `prisma generate && next build`
- Framework: Next.js
- Region: `iad1` (US East)
- API function timeout: 30 seconds

## 🛠️ Troubleshooting

### If Vercel login fails:
- Make sure you have a Vercel account (sign up at https://vercel.com)
- Try using the device code method if browser doesn't open

### If deployment fails:
- Check that all environment variables are set
- Verify your database connection string
- Check build logs in Vercel dashboard

## 📚 Additional Resources

- Vercel Documentation: https://vercel.com/docs
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs
- Prisma on Vercel: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel





