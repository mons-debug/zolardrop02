# Image Upload Setup Guide

## ✅ What's Been Implemented

I've added image upload functionality to your site! Here's what works now:

### Components Created:
1. **ImageUpload Component** (`/components/admin/ImageUpload.tsx`)
   - ✅ Drag and drop files
   - ✅ Click to browse
   - ✅ Image preview
   - ✅ Upload progress indicator
   - ✅ File validation (type & size)
   - ✅ Delete option
   - ✅ Fallback to paste URL

2. **Upload API** (`/pages/api/upload.ts`)
   - ✅ Handles file uploads
   - ✅ Integrates with Vercel Blob storage
   - ✅ Returns public CDN URLs

### Pages Updated:
- ✅ **Fashion Carousel** (`/admin/carousel`) - Upload carousel images
- ✅ **Archive Collection** (`/admin/archive`) - Upload collection images

---

## 🚀 Setup Steps (IMPORTANT!)

To make image uploads work, you need to configure Vercel Blob storage:

### Step 1: Create Vercel Blob Store

1. Go to: https://vercel.com/dashboard
2. Click on your project: **zolardrop02**
3. Go to **Storage** tab
4. Click **Create Database** or **Create Store**
5. Select **Blob**
6. Give it a name: `zolar-images`
7. Click **Create**

### Step 2: Get Your Token

After creating the store:
1. You'll see a connection string/token
2. Copy the **`BLOB_READ_WRITE_TOKEN`**
3. It looks like: `vercel_blob_rw_XXXXXXXXXX`

### Step 3: Add Token to Vercel

1. In your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Click **Add New**
4. Key: `BLOB_READ_WRITE_TOKEN`
5. Value: Paste your token
6. Select all environments (Production, Preview, Development)
7. Click **Save**

### Step 4: Add Token Locally (Optional)

For local testing, add to your `.env` file:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXX
```

---

## 📤 Deploy the Changes

Now push the code and redeploy:

```bash
git push origin main
vercel --prod
```

Vercel will auto-deploy from GitHub once pushed.

---

## 🎯 How to Use

### Upload Carousel Images

1. Go to: **Admin → Carousel**
2. Click **"+ Add Image"**
3. Either:
   - **Drag & drop** an image file
   - **Click** the upload area to browse
   - **Or paste** an Unsplash URL
4. Choose size (Tall/Square/Wide)
5. Add alt text
6. Click **"Save"**

### Upload Archive Images

1. Go to: **Admin → Archive**
2. For each image slot:
   - **Drag & drop** an image
   - **Click** to browse files
   - **Or paste** a URL
3. Add alt text for each
4. Click **"Save Changes"**

---

## ✨ Features

- **10MB max file size**
- **Supported formats**: JPG, PNG, WEBP, GIF
- **Automatic CDN delivery** (via Vercel Blob)
- **Image optimization** (built into Next.js Image component)
- **Fallback to URL** (can still paste Unsplash URLs)
- **Preview before saving**
- **Replace or delete images**

---

## 🔍 Testing

After deploying with the token:

1. Visit: https://zolardrop02.vercel.app/admin/carousel
2. Try uploading an image
3. Check if it saves successfully
4. Visit homepage to see if it displays

---

## 💡 Cost

**Vercel Blob Free Tier:**
- ✅ 500MB storage
- ✅ Unlimited bandwidth
- ✅ Automatic CDN
- ✅ Perfect for getting started

**After 500MB:** $0.08/GB (very cheap!)

---

## 🛠 Troubleshooting

### Upload fails with "Upload failed"
- **Fix**: Make sure `BLOB_READ_WRITE_TOKEN` is set in Vercel environment variables
- Redeploy after adding the token

### Images don't display
- Check if URL starts with `https://`
- Verify Vercel Blob store is active
- Check browser console for errors

### File too large error
- Maximum 10MB per file
- Compress images before uploading
- Use online tools like TinyPNG

---

## 📋 Summary

**What you need to do:**
1. ✅ Create Vercel Blob store
2. ✅ Get BLOB_READ_WRITE_TOKEN
3. ✅ Add token to Vercel environment variables
4. ✅ Push code to GitHub
5. ✅ Deploy to Vercel
6. ✅ Test uploading images!

**Files changed:**
- `package.json` (added @vercel/blob)
- `components/admin/ImageUpload.tsx` (new)
- `pages/api/upload.ts` (enhanced)
- `app/admin/carousel/page.tsx` (updated)
- `app/admin/archive/page.tsx` (updated)

---

## 🎉 Next Steps

After this works, I can add:
- ✅ Hero Slides management (upload hero images)
- ✅ Product image uploads
- ✅ Multiple image galleries

Just let me know when the token is configured and deployed!

