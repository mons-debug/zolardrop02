# 🔧 HeroShatter Integration Guide

## Quick Integration into Existing Zolar 2.0 Site

This guide shows you how to integrate the HeroShatter component into your existing Zolar 2.0 e-commerce site.

## Step 1: Install Dependencies

```bash
npm install three @react-three/fiber @react-three/drei
```

## Step 2: Component is Ready

The component has been created at:
```
/components/HeroShatter.tsx
```

## Step 3: Integration Options

### Option A: Replace Existing Hero Section

If you want to replace your current hero section with the interactive shatter effect:

**File**: `app/page.tsx`

```tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Your existing imports
import ProductCard from '@/components/ProductCard';
import ArchiveCollection from '@/components/ArchiveCollection';
// ... other imports

// Dynamic import for HeroShatter (no SSR for 3D components)
const HeroShatter = dynamic(() => import('@/components/HeroShatter'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="animate-pulse text-white text-xl">Loading Experience...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Replace your existing Hero component with HeroShatter */}
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <HeroShatter
          imageUrl="/assets/hero-image.jpg"
          title="Welcome to Zolar"
          subtitle="Experience the future of fashion with interactive 3D technology"
        />
      </Suspense>
      
      {/* Keep all your existing sections */}
      <section className="py-20">
        {/* Your products section */}
      </section>
      
      <ArchiveCollection />
      
      {/* Rest of your content */}
    </main>
  );
}
```

### Option B: Add as a New Landing Section

Add the shatter effect as a special landing page feature:

**File**: Create `app/experience/page.tsx`

```tsx
'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const HeroShatter = dynamic(() => import('@/components/HeroShatter'), {
  ssr: false,
});

export default function ExperiencePage() {
  return (
    <div>
      <HeroShatter
        imageUrl="/assets/experience-hero.jpg"
        title="Interactive Experience"
        subtitle="Discover our innovative approach to web design"
      />
      
      <section className="bg-white py-12 text-center">
        <Link 
          href="/products"
          className="px-8 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Explore Products
        </Link>
      </section>
    </div>
  );
}
```

### Option C: Add to About Page

Make your about page more engaging:

**File**: `app/about/page.tsx`

```tsx
'use client';

import dynamic from 'next/dynamic';

const HeroShatter = dynamic(() => import('@/components/HeroShatter'), {
  ssr: false,
});

export default function AboutPage() {
  return (
    <main>
      <HeroShatter
        imageUrl="/assets/about-hero.jpg"
        title="About Zolar"
        subtitle="Innovation meets tradition in luxury fashion"
        proximityThreshold={300}
        shatterThreshold={150}
        gridSize={12}
      />
      
      {/* Your existing about content */}
      <section className="container mx-auto py-20">
        <h2>Our Story</h2>
        {/* ... */}
      </section>
    </main>
  );
}
```

## Step 4: Prepare Your Images

### Image Requirements

1. **Location**: Place images in `/public/assets/`
2. **Format**: WebP (recommended) or JPEG
3. **Size**: 1920x1080 or 2560x1440
4. **File Size**: < 500KB for optimal performance
5. **Content**: Choose images that look good when shattered (portraits, products, architecture work well)

### Image Optimization Script

```bash
# Install sharp for image optimization
npm install sharp

# Create optimize-images.js
node scripts/optimize-images.js
```

**File**: `scripts/optimize-images.js`

```javascript
const sharp = require('sharp');
const fs = require('fs');

async function optimizeImage(input, output) {
  await sharp(input)
    .resize(1920, 1080, { fit: 'cover' })
    .webp({ quality: 85 })
    .toFile(output);
  console.log(`✅ Optimized: ${output}`);
}

// Optimize your hero images
optimizeImage(
  './public/assets/hero-original.jpg',
  './public/assets/hero-image.webp'
);
```

## Step 5: Test the Integration

Visit the demo page to see it in action:

```bash
npm run dev
```

Navigate to:
- Demo: http://localhost:3000/demo-shatter
- Your integration: http://localhost:3000 (or your chosen route)

## Step 6: Customize for Your Brand

### Match Your Brand Colors

```tsx
<HeroShatter
  imageUrl="/assets/hero.jpg"
  title="Your Brand"
  subtitle="Your message"
  className="custom-brand-hero"
/>
```

**File**: `app/globals.css`

```css
.custom-brand-hero {
  /* Override default gradient */
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}

/* Customize buttons */
.custom-brand-hero button {
  background: #your-brand-color;
}

/* Customize ring indicator */
.custom-brand-hero .ring-indicator {
  border-color: #your-brand-color;
}
```

### Adjust Sensitivity

```tsx
<HeroShatter
  proximityThreshold={200}  // More sensitive (triggers earlier)
  shatterThreshold={80}     // Breaks more easily
  gridSize={20}             // More shards
/>

{/* OR */}

<HeroShatter
  proximityThreshold={350}  // Less sensitive
  shatterThreshold={180}    // Requires closer approach
  gridSize={10}             // Fewer shards (better performance)
/>
```

## Step 7: Mobile Optimization

### Disable on Mobile (Performance)

```tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/Hero'; // Your regular hero

const HeroShatter = dynamic(() => import('@/components/HeroShatter'), {
  ssr: false,
});

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  
  return (
    <main>
      {isMobile ? (
        <Hero /> // Regular hero for mobile
      ) : (
        <HeroShatter imageUrl="/assets/hero.jpg" /> // 3D for desktop
      )}
      
      {/* Rest of content */}
    </main>
  );
}
```

### Reduced Quality on Mobile

```tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const HeroShatter = dynamic(() => import('@/components/HeroShatter'), {
  ssr: false,
});

export default function Home() {
  const [gridSize, setGridSize] = useState(15);
  
  useEffect(() => {
    setGridSize(window.innerWidth < 768 ? 8 : 15);
  }, []);
  
  return (
    <HeroShatter
      imageUrl="/assets/hero.jpg"
      gridSize={gridSize}
    />
  );
}
```

## Step 8: Add Navigation Integration

Add a navigation link to your shatter experience:

**File**: `components/Navbar.tsx`

```tsx
<nav>
  {/* Your existing nav items */}
  <Link 
    href="/demo-shatter"
    className="nav-link hover:text-orange-500"
  >
    Experience 3D
  </Link>
</nav>
```

## Step 9: Performance Monitoring

### Add Performance Tracking

```tsx
'use client';

import { useEffect } from 'react';

export default function ShatterPage() {
  useEffect(() => {
    // Track load time
    const startTime = performance.now();
    
    return () => {
      const loadTime = performance.now() - startTime;
      console.log(`HeroShatter loaded in ${loadTime}ms`);
      
      // Send to analytics if needed
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'timing_complete', {
          name: 'hero_shatter_load',
          value: Math.round(loadTime),
        });
      }
    };
  }, []);
  
  return <HeroShatter {...props} />;
}
```

## Step 10: Fallback for Older Browsers

```tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';

const HeroShatter = dynamic(() => import('@/components/HeroShatter'), {
  ssr: false,
});

export default function Home() {
  const [supportsWebGL, setSupportsWebGL] = useState(true);
  
  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    setSupportsWebGL(!!gl);
  }, []);
  
  return (
    <main>
      {supportsWebGL ? (
        <HeroShatter imageUrl="/assets/hero.jpg" />
      ) : (
        <Hero /> // Fallback to regular hero
      )}
    </main>
  );
}
```

## Common Use Cases

### 1. Product Launch Page

```tsx
<HeroShatter
  imageUrl="/assets/new-product.jpg"
  title="New Collection"
  subtitle="Breaking boundaries in fashion"
  proximityThreshold={200}
  shatterThreshold={100}
/>
```

### 2. Campaign Landing Page

```tsx
<HeroShatter
  imageUrl="/assets/campaign.jpg"
  title="Summer Sale"
  subtitle="Get close to incredible deals"
/>
```

### 3. Brand Story Section

```tsx
<HeroShatter
  imageUrl="/assets/brand-story.jpg"
  title="Our Journey"
  subtitle="Breaking conventions since 2020"
  gridSize={20} // More dramatic effect
/>
```

## Troubleshooting

### Issue: Black screen or component not rendering

**Solution**: 
1. Check that all dependencies are installed
2. Ensure image path is correct
3. Add error boundary:

```tsx
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<Hero />}>
  <HeroShatter imageUrl="/assets/hero.jpg" />
</ErrorBoundary>
```

### Issue: Poor performance on mobile

**Solution**:
1. Reduce gridSize to 8-10
2. Use smaller images (< 300KB)
3. Consider disabling on mobile

### Issue: Image doesn't shatter

**Solution**:
1. Check threshold values
2. Ensure cursor tracking is working
3. Verify canvas is receiving pointer events

## Next Steps

1. ✅ Install dependencies
2. ✅ Choose integration option (A, B, or C)
3. ✅ Prepare and optimize images
4. ✅ Test on desktop and mobile
5. ✅ Customize colors and sensitivity
6. ✅ Add to navigation
7. ✅ Monitor performance
8. ✅ Deploy!

## Resources

- **Demo**: `/demo-shatter`
- **Documentation**: `HERO_SHATTER_DOCUMENTATION.md`
- **Component**: `/components/HeroShatter.tsx`
- **Support**: Check inline code comments

---

**Ready to break the internet?** 🚀

Start with the demo page to see it in action, then choose your integration option!








