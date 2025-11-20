# 🎠 Auto-Shatter Carousel Setup Guide

## ✨ What You Get

An **automatic image carousel** where each image **shatters into glass pieces** and transitions to the next image - no mouse interaction needed!

### Features:
- ✅ Automatic timing (customizable interval)
- ✅ Realistic glass shatter physics
- ✅ Smooth transitions between images
- ✅ Infinite loop
- ✅ Works with real images (JPG, PNG, WebP)
- ✅ Mobile responsive
- ✅ Production ready

## 🚀 Quick Start

### Option 1: View Demo with Placeholder Images

```bash
npm run dev
```

Visit: **http://localhost:3000/carousel-demo**

The demo generates colorful placeholder images automatically - no setup needed!

### Option 2: Use Your Own Images

#### Step 1: Add Your Images

Place 3-5 images in your public folder:

```
/public/assets/
  ├── hero1.jpg
  ├── hero2.jpg
  ├── hero3.jpg
  └── hero4.jpg
```

**Image Requirements:**
- Format: JPG, PNG, or WebP
- Resolution: 1920×1080 or higher
- File size: < 500KB recommended
- Aspect ratio: 16:9 or 4:3

#### Step 2: Create Your Page

```tsx
// app/page.tsx or wherever you want the carousel
'use client';

import dynamic from 'next/dynamic';

const HeroShatterCarousel = dynamic(
  () => import('@/components/HeroShatterCarousel'),
  { ssr: false }
);

export default function Home() {
  const images = [
    '/assets/hero1.jpg',
    '/assets/hero2.jpg',
    '/assets/hero3.jpg',
    '/assets/hero4.jpg',
  ];
  
  return (
    <HeroShatterCarousel
      images={images}
      interval={5}
      title="Welcome to Zolar"
      subtitle="Experience fashion that breaks boundaries"
    />
  );
}
```

#### Step 3: Customize Settings

```tsx
<HeroShatterCarousel
  images={yourImages}
  interval={6}              // Seconds before shatter (3-10 recommended)
  title="Your Brand"
  subtitle="Your tagline"
  className="custom-class"
/>
```

## 📥 Download Sample Images (Optional)

### Quick Download Script

Create a file `scripts/download-hero-images.js`:

```javascript
const https = require('https');
const fs = require('fs');
const path = require('path');

const sampleImages = [
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
];

const assetsDir = path.join(__dirname, '../public/assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

sampleImages.forEach((url, index) => {
  const filename = `hero${index + 1}.jpg`;
  const filepath = path.join(assetsDir, filename);
  
  https.get(url, (response) => {
    const fileStream = fs.createWriteStream(filepath);
    response.pipe(fileStream);
    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`✅ Downloaded: ${filename}`);
    });
  });
});
```

Run it:
```bash
node scripts/download-hero-images.js
```

## 🎨 Customization Examples

### Example 1: Fast Fashion Carousel

```tsx
<HeroShatterCarousel
  images={fashionImages}
  interval={3}              // Quick transitions
  title="New Arrivals"
  subtitle="Fresh styles every second"
/>
```

### Example 2: Luxury Slow Motion

```tsx
<HeroShatterCarousel
  images={luxuryImages}
  interval={8}              // Longer display time
  title="Timeless Elegance"
  subtitle="Savor each moment"
/>
```

### Example 3: Product Showcase

```tsx
<HeroShatterCarousel
  images={productImages}
  interval={5}
  title="Featured Collection"
  subtitle="Breaking conventions in every piece"
/>
```

## 🎛️ Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `images` | `string[]` | ✅ Yes | - | Array of image URLs (min 2) |
| `interval` | `number` | No | `5` | Seconds before shatter (3-10 recommended) |
| `title` | `string` | No | `"Experience Innovation"` | Main heading |
| `subtitle` | `string` | No | Auto-generated | Subtitle text |
| `className` | `string` | No | `""` | Additional CSS classes |

## 🔧 How It Works

### Timeline:

```
[0s] ──────────> [5s] ──────────> [7s] ──────────> [0s]
  │                │                 │                │
Show Image     Shatter          Complete         Next Image
                Starts          Transition
```

### Process:

1. **Display Phase (0-5s)**: Image shows normally
2. **Shatter Phase (5-7s)**: Image breaks into glass shards
3. **Transition (7s)**: Switch to next image
4. **Loop**: Repeat with next image

## 💡 Performance Tips

### For Desktop
```tsx
<HeroShatterCarousel
  images={images}
  interval={5}
  // Default settings work great
/>
```

### For Mobile (Better Performance)
```tsx
// Modify HeroShatterCarousel.tsx line 211:
gridSize={10}  // Instead of 15 (fewer shards = better FPS)
```

### Optimize Images

```bash
# Install sharp for image optimization
npm install sharp

# Then use a script to optimize
const sharp = require('sharp');

sharp('hero1.jpg')
  .resize(1920, 1080)
  .webp({ quality: 85 })
  .toFile('hero1.webp');
```

## 🐛 Troubleshooting

### Images Not Loading

**Problem**: Images show as broken/blank

**Solution**:
1. Check file paths are correct
2. Ensure images are in `/public/assets/`
3. Use relative paths: `/assets/image.jpg` not `./assets/`
4. Check console for 404 errors

### Low FPS / Stuttering

**Problem**: Animation is choppy

**Solutions**:
1. Reduce `gridSize` to 10 or 12
2. Optimize image file sizes (< 300KB)
3. Use WebP format instead of JPG
4. Close other browser tabs
5. Test on desktop first

### Shatter Too Fast/Slow

**Problem**: Timing feels off

**Solution**:
```tsx
// Adjust both interval and shatter duration
interval={7}  // Display time

// In HeroShatterCarousel.tsx, adjust:
if (shatterTimeRef.current > 3) // Shatter duration (line 106)
```

### Only One Image Shows

**Problem**: Carousel doesn't loop

**Solution**:
- Ensure you have at least 2 images in array
- Check console for errors
- Verify `onShatterComplete` is being called

## 📱 Mobile Optimization

### Conditional Loading

```tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import StaticCarousel from '@/components/StaticCarousel';

const HeroShatterCarousel = dynamic(
  () => import('@/components/HeroShatterCarousel'),
  { ssr: false }
);

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  
  return isMobile ? (
    <StaticCarousel images={images} /> // Simple fade carousel
  ) : (
    <HeroShatterCarousel images={images} /> // 3D shatter effect
  );
}
```

## 🌟 Real-World Use Cases

### 1. Fashion E-commerce Homepage
```tsx
const seasonalImages = [
  '/collections/spring.jpg',
  '/collections/summer.jpg',
  '/collections/fall.jpg',
  '/collections/winter.jpg',
];

<HeroShatterCarousel images={seasonalImages} interval={6} />
```

### 2. Product Launch Landing Page
```tsx
const productViews = [
  '/products/view1.jpg',
  '/products/view2.jpg',
  '/products/view3.jpg',
];

<HeroShatterCarousel 
  images={productViews} 
  interval={4}
  title="New Release"
  subtitle="Breaking the mold"
/>
```

### 3. Brand Story Page
```tsx
const storyImages = [
  '/story/beginning.jpg',
  '/story/growth.jpg',
  '/story/today.jpg',
];

<HeroShatterCarousel 
  images={storyImages} 
  interval={7}
  title="Our Journey"
/>
```

## 📊 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | Best performance |
| Firefox 88+ | ✅ Full | Excellent |
| Safari 15+ | ✅ Full | Good |
| Edge 90+ | ✅ Full | Excellent |
| Mobile Safari | ✅ Good | Reduce gridSize |
| Mobile Chrome | ✅ Good | Reduce gridSize |

**Requirements**: WebGL2 support

## 🎓 Next Steps

1. ✅ Visit `/carousel-demo` to see it in action
2. ✅ Add your own images to `/public/assets/`
3. ✅ Customize the interval and text
4. ✅ Test on desktop and mobile
5. ✅ Deploy to production

## 📚 Related Components

- **HeroShatter.tsx**: Mouse proximity-based shatter
- **HeroShatterCarousel.tsx**: Auto-shatter carousel (this component)
- Both components share similar physics and rendering

## 🆘 Need Help?

- Check `HERO_SHATTER_DOCUMENTATION.md` for detailed 3D concepts
- See `HERO_SHATTER_INTEGRATION_GUIDE.md` for integration tips
- Review inline comments in `HeroShatterCarousel.tsx`

---

**Ready to shatter some images?** 🚀💥

Visit `/carousel-demo` now to see it in action!








