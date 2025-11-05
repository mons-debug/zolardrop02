# Fashion Carousel Component

## Overview
An infinite horizontal scrolling carousel component inspired by Philipp Plein's luxury aesthetic, featuring varied card dimensions and interactive hover controls.

## Component Details

### Location
- **Component File**: `/components/FashionCarousel.tsx`
- **Used In**: `/app/page.tsx` (Homepage - middle section)

### Features
1. **Infinite Horizontal Scroll**: Continuously scrolls from right to left in a seamless loop
2. **Mixed Card Dimensions**: 
   - **Tall Cards** (large): 600px × 400px - vertical editorial shots
   - **Square Cards** (medium): 450px × 380px - balanced compositions
   - **Horizontal Cards** (small): 350px × 500px - wide landscape shots
3. **Enhanced 3D Shadow Effect**: Cards have strong custom shadows for prominent depth, with even more dramatic shadows on hover
4. **Pause on Hover**: Animation stops when mouse hovers over the carousel
5. **Slower Animation**: 90-second loop for better viewing experience
6. **Enhanced Zoom**: Cards scale to 110% on hover for dramatic effect
7. **Philipp Plein Aesthetic**: Clean backgrounds, editorial photography, luxury feel
8. **Responsive Design**: Adapts to mobile and desktop screens
9. **Section Header**: "Fashion Edit" with "Latest Collection" label
10. **CTA Button**: "Explore Collection" button below carousel

### Card Dimensions
The carousel features three distinct card types for visual variety. **The layout stays the same on mobile - just scaled down proportionally!**

**Desktop Sizes (lg):**
- **Tall (large)**: 600px height × 400px width - Perfect for full-body editorial shots
- **Square (medium)**: 450px height × 380px width - Balanced product/portrait shots  
- **Horizontal (small)**: 350px height × 500px width - Wide landscape/lifestyle shots

**Tablet Sizes (md):**
- **Tall (large)**: 450px height × 300px width
- **Square (medium)**: 350px height × 300px width
- **Horizontal (small)**: 280px height × 380px width

**Mobile Sizes:**
- **Tall (large)**: 320px height × 210px width
- **Square (medium)**: 250px height × 210px width
- **Horizontal (small)**: 200px height × 280px width

Images are duplicated internally for seamless infinite loop. The same layout and proportions are maintained across all screen sizes!

### Interactive Features

#### Pause on Hover
- Carousel automatically pauses when mouse hovers over it
- Animation smoothly resumes when mouse leaves
- Works for both desktop (mouse) and mobile (touch)

#### Animation Speed
- **90 seconds** for complete loop (slower, more luxurious)
- Smooth linear movement
- Can be adjusted in `duration` property

### Customization Options

#### Image Data Structure
```typescript
{
  id: number
  url: string
  alt: string
  size: 'small' | 'medium' | 'large' // Determines card dimensions
}
```

#### Easy Updates
- **Change Images**: Modify the `images` array in the component (add/remove images)
- **Adjust Speed**: Change `duration` value (currently 90 seconds)
  - `60` = faster scroll (1 minute)
  - `90` = current speed (1.5 minutes) 
  - `120` = slower scroll (2 minutes)
- **Card Dimensions**: Adjust heights/widths in `getSizeClasses()` function
- **Shadow Intensity**: Cards use custom box-shadow for enhanced 3D effect
  - Default: `0 10px 30px -5px rgba(0, 0, 0, 0.15)` - strong, lifted appearance
  - Hover: `shadow-2xl` - even more dramatic elevation
  - Modify the inline `boxShadow` style for custom depth
- **Section Title**: Update "Fashion Edit" and "Latest Collection" text
- **CTA Link**: Change the link in the bottom button
- **Gap Between Cards**: Currently `gap-4 md:gap-5 lg:gap-6` (16px → 20px → 24px)
  - Increase for more breathing room
  - Decrease for tighter layout
- **Hover Zoom Level**: Change `group-hover:scale-110` (110% zoom)

### Usage Example
```tsx
import FashionCarousel from '@/components/FashionCarousel'

export default function Page() {
  return (
    <div>
      <FashionCarousel />
    </div>
  )
}
```

### Styling
- Uses Tailwind CSS for all styling
- Follows Zara-inspired minimalist design
- Smooth infinite scroll animation using Framer Motion
- Gradient fade edges for elegant appearance
- Clean, modern aesthetic

### Technical Implementation
- **Infinite Loop**: Images are duplicated and animated from 0% to -50% position
- **Seamless Transition**: The animation resets invisibly at the midpoint
- **Performance**: Uses CSS transforms for smooth 60fps animation
- **Responsive**: Different sizes for mobile and desktop viewports

### How to Adjust Speed
In the component, find the `duration` property:
```typescript
transition={{
  x: {
    repeat: Infinity,
    repeatType: 'loop',
    duration: 60, // Change this number
    ease: 'linear',
  },
}}
```
- **30** = Faster (completes in 30 seconds)
- **60** = Current speed (1 minute per loop)
- **90** = Slower (1.5 minutes per loop)

### Future Enhancements
- Add pause on hover functionality
- Add click-through functionality to individual images
- Add optional captions/titles per image
- Add reverse scroll direction option
- Add variable speed control

