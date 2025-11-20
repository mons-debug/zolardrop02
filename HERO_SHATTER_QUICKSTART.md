# 🚀 HeroShatter Quick Start Guide

## It Works Out of the Box! ✅

The HeroShatter component now works immediately with **no image file required**! It uses a beautiful procedural gradient texture by default.

## View the Demo

```bash
npm run dev
```

Then visit: **http://localhost:3000/demo-shatter**

## What to Expect

1. **Beautiful gradient canvas**: Orange gradient with "ZOLAR" branding
2. **Proximity detection**: Move your cursor close to the image
3. **Progressive fracture**: See stress lines appear as you get closer
4. **Glass shatter effect**: Watch it explode into realistic glass shards
5. **Physics simulation**: Shards fly away with gravity and rotation

## Using Your Own Images (Optional)

Want to use a custom image instead of the gradient? Here's how:

### Step 1: Add Your Image

Place your image in the public folder:
```
/public/assets/hero-image.jpg
```

### Step 2: Update the Component

Create a version that loads images:

**File**: `components/HeroShatterWithImage.tsx`

```tsx
'use client';

import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Copy all the types and createShards logic from HeroShatter.tsx
// Then update the texture loading:

const ShatteredImageWithTexture = ({ imageUrl, ...props }) => {
  // Load image texture
  const texture = useTexture(imageUrl);
  
  // Rest of component logic...
  // Use `texture` instead of `activeTexture`
};

// Wrap in Suspense
export default function HeroShatterWithImage({ imageUrl, ...props }) {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <ShatteredImageWithTexture imageUrl={imageUrl} {...props} />
      </Suspense>
    </Canvas>
  );
}
```

### Step 3: Use It

```tsx
import HeroShatterWithImage from '@/components/HeroShatterWithImage';

<HeroShatterWithImage imageUrl="/assets/hero-image.jpg" />
```

## Image Recommendations

For best results:

| Property | Recommendation |
|----------|----------------|
| **Format** | WebP or JPEG |
| **Resolution** | 1920×1080 or 2560×1440 |
| **File Size** | < 500KB |
| **Aspect Ratio** | 16:9 or 1:1 |
| **Subject** | Centered, high contrast |

### Good Image Subjects

✅ **Works Great:**
- Portraits
- Products
- Architecture
- Typography
- Geometric designs
- Brand logos

❌ **Avoid:**
- Very busy patterns (hard to see fracture)
- All white/black images (low contrast)
- Images with important details at edges (will be cut off)

## Customization Examples

### Example 1: Faster/More Sensitive

```tsx
<HeroShatter
  proximityThreshold={300}  // Trigger earlier
  shatterThreshold={80}     // Shatter faster
  gridSize={20}             // More shards
/>
```

### Example 2: Slower/More Dramatic

```tsx
<HeroShatter
  proximityThreshold={150}  // Must get closer
  shatterThreshold={50}     // Right on top to shatter
  gridSize={25}             // Lots of small pieces
/>
```

### Example 3: Performance Mode

```tsx
<HeroShatter
  proximityThreshold={200}
  shatterThreshold={100}
  gridSize={10}             // Fewer shards = better FPS
/>
```

## Troubleshooting

### Issue: Nothing appears

**Check:**
1. Is the dev server running? (`npm run dev`)
2. Did you install dependencies? (`npm install`)
3. Check browser console for errors

### Issue: Low FPS / Laggy

**Solutions:**
- Reduce `gridSize` to 10
- Close other tabs
- Use a smaller image
- Test on desktop, not mobile

### Issue: Component appears but no interaction

**Check:**
1. Move cursor slowly closer to the center
2. Try adjusting threshold values
3. Make sure you're on the canvas area

### Issue: Shatter happens immediately

**Fix:** Increase `shatterThreshold` value:
```tsx
<HeroShatter shatterThreshold={150} />
```

## Performance Tips

### Desktop vs Mobile

```tsx
'use client';
import { useState, useEffect } from 'react';
import HeroShatter from '@/components/HeroShatter';
import StaticHero from '@/components/Hero';

export default function ResponsiveHero() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  
  return isMobile ? <StaticHero /> : <HeroShatter />;
}
```

### Lazy Loading

```tsx
import dynamic from 'next/dynamic';

const HeroShatter = dynamic(() => import('@/components/HeroShatter'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});
```

## Browser Support

| Browser | Works? | Notes |
|---------|--------|-------|
| Chrome 90+ | ✅ | Full support |
| Firefox 88+ | ✅ | Full support |
| Safari 15+ | ✅ | Full support |
| Edge 90+ | ✅ | Full support |
| Mobile Safari | ✅ | May have lower FPS |
| Mobile Chrome | ✅ | May have lower FPS |

Requires **WebGL2** support.

## What's Happening Behind the Scenes?

1. **Canvas Rendering**: Creates a 1024×1024 gradient texture
2. **3D Geometry**: PlaneGeometry with subdivisions for smooth fracture
3. **Custom Shaders**: GLSL vertex/fragment shaders for stress effect
4. **Cursor Tracking**: Converts screen coordinates to 3D space
5. **Distance Calculation**: Real-time proximity checking
6. **Shard Generation**: Breaks plane into irregular pieces on trigger
7. **Physics**: Applies velocity, rotation, gravity, and opacity fade
8. **Material**: MeshPhysicalMaterial for glass-like reflections

## Advanced: Modify the Texture

Want to change colors or design? Edit the texture generation in `HeroShatter.tsx`:

```tsx
// Find this section around line 56-96
const activeTexture = useMemo(() => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Change colors here:
  gradient.addColorStop(0, '#your-color-1');
  gradient.addColorStop(0.5, '#your-color-2');
  gradient.addColorStop(1, '#your-color-3');
  
  // Change text here:
  ctx.fillText('YOUR BRAND', ...);
}, []);
```

## Next Steps

1. ✅ View the demo at `/demo-shatter`
2. ✅ Play with the effect by moving your cursor
3. ✅ Try different `proximityThreshold` and `shatterThreshold` values
4. ✅ Integrate into your homepage (see `HERO_SHATTER_INTEGRATION_GUIDE.md`)
5. ✅ Add your own images (optional, see above)
6. ✅ Customize colors and text to match your brand

## Need Help?

- **Full Documentation**: See `HERO_SHATTER_DOCUMENTATION.md`
- **Integration Guide**: See `HERO_SHATTER_INTEGRATION_GUIDE.md`
- **Component Code**: Check inline comments in `components/HeroShatter.tsx`

---

**Enjoy your interactive 3D hero section!** 🎉✨

The effect works immediately with no additional setup required.







