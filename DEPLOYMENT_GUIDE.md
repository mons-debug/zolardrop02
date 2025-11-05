# ZOLAR Deployment Guide - Vercel with PostgreSQL

This guide will walk you through deploying your ZOLAR fashion e-commerce site to Vercel with a PostgreSQL database.

## Prerequisites

- A GitHub account (recommended) or access to your Git repository
- A Vercel account (sign up at https://vercel.com)
- A PostgreSQL database (options below)

---

## Part 1: Database Setup

### Option A: Vercel Postgres (Recommended - Easiest)

1. Go to https://vercel.com/dashboard
2. Click on the "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose a name for your database
6. Select a region (choose one close to your users)
7. Click "Create"
8. **Save the connection string** - you'll need it

### Option B: Railway

1. Go to https://railway.app
2. Create a new project
3. Click "New" → "Database" → "PostgreSQL"
4. Once created, go to "Connect" tab
5. Copy the "Postgres Connection URL"

### Option C: Supabase

1. Go to https://supabase.com
2. Create a new project
3. Wait for database to initialize
4. Go to Project Settings → Database
5. Copy the connection string (URI format)

---

## Part 2: Deploy to Vercel

### Step 1: Push Code to GitHub (if not already done)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/zolar.git
git push -u origin main
```

### Step 2: Import Project to Vercel

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Next.js project

### Step 3: Configure Environment Variables

In the Vercel project settings, add these environment variables:

#### Required Variables:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname?schema=public
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=your-cluster
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=your-cluster
```

#### Optional Variables:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=1234567
ADMIN_TOKEN=admin-token-123
```

**Important:** 
- Replace all placeholder values with your actual credentials
- For `JWT_SECRET`, generate a strong random string:
  ```bash
  openssl rand -base64 32
  ```

### Step 4: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. Wait for deployment to complete (usually 2-5 minutes)

---

## Part 3: Post-Deployment Setup

### Step 1: Run Database Migrations

After first deployment, you need to set up your database schema:

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Run migrations
vercel env pull .env.production
DATABASE_URL="your-production-db-url" npx prisma migrate deploy
```

**Option B: Using a temporary build**

1. In Vercel dashboard, go to your project
2. Settings → Functions
3. Add a one-time serverless function to run migrations
4. Or use Vercel's "Build Command" override: `prisma migrate deploy && prisma generate && next build`

### Step 2: Seed Initial Data

```bash
# With production DATABASE_URL in your .env.production
npm run prisma:seed
```

This will create:
- Default admin account (email: admin@zolar.com, password: Admin123!)
- Sample products (if any in seed file)

### Step 3: Add Fashion Carousel Images

1. Go to your deployed site: `https://your-project.vercel.app`
2. Login to admin: `https://your-project.vercel.app/admin/login`
   - Email: admin@zolar.com
   - Password: Admin123!
3. Navigate to "Carousel" in the admin sidebar
4. Add your fashion images (use Unsplash URLs or upload your own)
5. Set image sizes: Mix Tall (vertical), Square, and Horizontal (wide) for variety
6. Save each image

### Step 4: Change Default Admin Password

1. Go to Admin → Profile
2. Update your password
3. Update your email if needed

---

## Part 4: Pusher Setup (Real-time Notifications)

1. Go to https://dashboard.pusher.com/
2. Create a free account
3. Create a new app (Channels)
4. Copy your credentials:
   - App ID
   - Key
   - Secret
   - Cluster
5. Add to Vercel environment variables (both regular and NEXT_PUBLIC_ versions)
6. Redeploy your app for changes to take effect

---

## Part 5: Verification Checklist

After deployment, verify everything works:

- [ ] Homepage loads correctly
- [ ] Products page displays products
- [ ] Fashion Carousel shows images
- [ ] Admin login works
- [ ] Can create/edit products in admin
- [ ] Can manage fashion carousel images
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Real-time notifications work (place test order)
- [ ] Mobile responsive design works
- [ ] Images load properly
- [ ] Navigation links work

---

## Part 6: Domain Setup (Optional)

### Add Custom Domain

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., www.zolar.com)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

---

## Troubleshooting

### Build Fails

**Error: "Prisma Client not generated"**
- Solution: The `postinstall` script in package.json should handle this
- Check: Build logs show "Running 'prisma generate'"

**Error: "DATABASE_URL not found"**
- Solution: Add DATABASE_URL to Vercel environment variables
- Make sure to redeploy after adding

### Database Connection Issues

**Error: "Can't reach database server"**
- Check DATABASE_URL format is correct
- Ensure database accepts connections from Vercel IPs
- For Supabase: Use the "Connection Pooling" URL

### Images Not Loading

**Error: "Invalid src prop"**
- Add image domains to `next.config.js` remotePatterns
- Redeploy after changes

### API Routes Timeout

**Error: "Function execution timed out"**
- Optimize database queries
- Add indexes to frequently queried fields
- Consider connection pooling

---

## Maintenance

### Update Content

- Products: Admin → Products
- Fashion Carousel: Admin → Carousel  
- Archive Collection: Admin → Archive

### Monitor Performance

- Vercel Analytics: Automatic in Vercel dashboard
- Add Google Analytics: Set NEXT_PUBLIC_GA_MEASUREMENT_ID
- Add Hotjar: Set NEXT_PUBLIC_HOTJAR_ID

### Database Backups

**Vercel Postgres:**
- Automatic backups included
- Access via Vercel dashboard

**Railway:**
- Automatic daily backups
- Manual backups via CLI

**Supabase:**
- Automatic backups on paid plans
- Manual export via dashboard

### Update Application

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Vercel auto-deploys on push
```

---

## Production Best Practices

1. **Security:**
   - Change default admin password immediately
   - Use strong JWT_SECRET
   - Enable 2FA on admin accounts
   - Use HTTPS (automatic with Vercel)

2. **Performance:**
   - Enable caching
   - Optimize images (already done with Next.js Image)
   - Use CDN (automatic with Vercel)
   - Monitor Core Web Vitals

3. **Monitoring:**
   - Set up error tracking (Sentry)
   - Monitor database performance
   - Check Vercel logs regularly

4. **Backups:**
   - Regular database backups
   - Keep staging environment
   - Version control everything

---

## Support

For issues:
- Check Vercel deployment logs
- Review database connection
- Verify environment variables
- Check browser console for client errors

For Next.js issues: https://nextjs.org/docs
For Vercel issues: https://vercel.com/docs
For Prisma issues: https://www.prisma.io/docs

---

## Summary

Your ZOLAR fashion website is now live! 🎉

**Your URLs:**
- Production: https://your-project.vercel.app
- Admin: https://your-project.vercel.app/admin
- API: https://your-project.vercel.app/api/*

**Next Steps:**
1. Add real products
2. Upload fashion carousel images
3. Customize content
4. Set up custom domain
5. Enable analytics
6. Launch marketing! 🚀

