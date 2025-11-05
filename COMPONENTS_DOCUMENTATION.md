# Reusable Components Documentation

## 📦 Component Library Overview

This document describes the reusable, animated components built with **Framer Motion** for Zolar Drop 02.

---

## 🧭 Navbar Component

**Location:** `/components/Navbar.tsx`

### Features
- ✨ **Transparent to solid** transition on scroll
- 🎨 Glassmorphism effect with backdrop blur
- 📱 Fully responsive with mobile menu button
- 🔗 Animated underline on link hover
- 🎯 Integrated cart icon
- ⚡ Smooth scroll-based opacity and blur transitions

### Props

```typescript
interface NavbarProps {
  className?: string  // Additional CSS classes
}
```

### Usage

```tsx
import Navbar from '@/components/Navbar'

export default function Page() {
  return (
    <>
      <Navbar />
      {/* Your page content */}
    </>
  )
}
```

### Customization

The navbar automatically transitions based on scroll position:
- **0-50px scroll**: Transparent background, no blur
- **50px+ scroll**: Solid background (black/0.9), backdrop blur (12px)

Navigation links are defined internally:
```typescript
const navLinks = [
  { href: '/products', label: 'Products' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
  { href: '/admin', label: 'Admin' },
]
```

### Animations
- Initial slide down from top (y: -100 → 0)
- Logo scale on hover (1 → 1.05)
- Link underline animation (width: 0 → 100%)
- Background color and blur transform on scroll

---

## 🚀 Hero Component

**Location:** `/components/Hero.tsx`

### Features
- 🎬 Full-screen hero section
- 🌈 Animated gradient background
- ✨ Floating particle effects (20 particles)
- 📜 Parallax scroll effects
- 🎯 Animated CTA button
- 📱 Fully responsive typography
- 🏷️ Optional live badge with pulse animation
- ↓ Scroll indicator with bounce animation

### Props

```typescript
interface HeroProps {
  title: string              // Main headline
  subtitle?: string          // Secondary text
  description?: string       // Longer description
  ctaText?: string          // Button text (default: "Get Started")
  ctaLink?: string          // Button link (default: "/products")
  showBadge?: boolean       // Show badge (default: true)
  badgeText?: string        // Badge text (default: "Limited Edition Release")
  className?: string        // Additional CSS classes
}
```

### Usage

```tsx
import Hero from '@/components/Hero'

export default function HomePage() {
  return (
    <Hero
      title="DROP 02"
      subtitle="Exclusive. Limited. Yours."
      description="Experience the perfect blend of quality and style."
      ctaText="Explore Collection"
      ctaLink="/products"
      showBadge={true}
      badgeText="Limited Edition Release"
    />
  )
}
```

### Minimal Example

```tsx
<Hero title="Welcome to Zolar" />
```

### Animations
- **Parallax effects**: Y-translation, opacity fade, scale transform
- **Title gradient**: Animated background position (sliding effect)
- **Particles**: 20 floating particles with upward motion
- **CTA button**: Gradient slide on hover, arrow animation
- **Badge**: Pulsing indicator, fade-in entrance
- **Scroll indicator**: Bouncing animation (infinite loop)

### Background Effects
1. Radial gradients (purple and blue)
2. Animated grid pattern with mask
3. Floating particles
4. Bottom gradient overlay

---

## 📝 SectionTitle Component

**Location:** `/components/SectionTitle.tsx`

### Features
- 📐 Animated underline with gradient
- 🎨 Gradient text effect
- 🎯 Three alignment options (left, center, right)
- 📍 Decorative animated dots
- ✨ Optional subtitle
- 🔄 Toggle animations on/off

### Props

```typescript
interface SectionTitleProps {
  children: ReactNode        // Title text
  subtitle?: string          // Optional subtitle
  align?: 'left' | 'center' | 'right'  // Alignment (default: 'center')
  className?: string         // Additional CSS classes
  animate?: boolean          // Enable animations (default: true)
}
```

### Usage

```tsx
import SectionTitle from '@/components/SectionTitle'

// Center aligned (default)
<SectionTitle subtitle="Discover our exclusive collection">
  Featured Products
</SectionTitle>

// Left aligned with no animation
<SectionTitle align="left" animate={false}>
  About Us
</SectionTitle>

// Right aligned
<SectionTitle 
  align="right" 
  subtitle="Get in touch with our team"
>
  Contact Us
</SectionTitle>
```

### Animations
1. **Container**: Fade-in + slide up (y: 30 → 0)
2. **Line**: Width animation (0 → 100%, 1s duration)
3. **Dots**: Scale + fade-in, staggered (0.1s delay each)
4. **Subtitle**: Fade-in (0.5s delay)

### Visual Elements
- Gradient title (white → gray-400)
- Animated gradient line (purple → blue → purple)
- Three decorative dots with gradient background

---

## 🛍️ ProductPreviewCard Component

**Location:** `/components/ProductPreviewCard.tsx`

### Features
- 🖼️ Image with hover zoom effect
- ✨ Glassmorphism card design
- 🏷️ Optional badge (e.g., "NEW", "SALE")
- 📦 Stock status indicator
- 💰 Price with gradient styling
- 👁️ Quick view icon on hover
- 🌟 Shine effect animation
- 💫 Glow effect on hover
- 🔗 Automatic routing to product page

### Props

```typescript
interface ProductPreviewCardProps {
  id: string                // Product ID
  title: string             // Product name
  price: number             // Price in cents (2999 = $29.99)
  image: string             // Image URL
  slug?: string             // Custom slug for URL
  badge?: string            // Badge text (e.g., "NEW", "SALE")
  inStock?: boolean         // Stock status (default: true)
  className?: string        // Additional CSS classes
}
```

### Usage

```tsx
import ProductPreviewCard from '@/components/ProductPreviewCard'

// Basic usage
<ProductPreviewCard
  id="prod-123"
  title="Classic Cotton T-Shirt"
  price={2999}
  image="/images/tshirt.jpg"
/>

// With all options
<ProductPreviewCard
  id="prod-456"
  title="Premium Hoodie"
  price={5999}
  image="/images/hoodie.jpg"
  slug="premium-hoodie"
  badge="NEW"
  inStock={true}
/>

// Out of stock
<ProductPreviewCard
  id="prod-789"
  title="Limited Edition Jacket"
  price={12999}
  image="/images/jacket.jpg"
  badge="SOLD OUT"
  inStock={false}
/>
```

### Grid Layout Example

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map(product => (
    <ProductPreviewCard
      key={product.id}
      id={product.id}
      title={product.title}
      price={product.priceCents}
      image={product.images[0]}
      slug={product.sku}
      badge={product.badge}
      inStock={product.stock > 0}
    />
  ))}
</div>
```

### Animations
1. **Card entrance**: Fade-in + slide up on scroll
2. **Card hover**: Lift up (-8px), glow effect
3. **Image zoom**: Scale 1 → 1.1 on hover
4. **Overlay gradient**: Fade in on hover
5. **Quick view icon**: Scale + fade in
6. **Shine effect**: Horizontal sweep (infinite)
7. **Arrow animation**: Horizontal bounce (infinite)
8. **Glow effect**: Pulsing gradient background

### Price Formatting
Price is automatically formatted from cents:
- Input: `2999`
- Display: `$29.99`

---

## 🦶 Footer Component

**Location:** `/components/Footer.tsx`

### Features
- 📱 Fully responsive layout
- 🔗 Quick links with dot animation
- 📱 Social media icons (Instagram, TikTok, Twitter, Facebook)
- 🎨 Icon hover effects with tooltips
- ⚡ Staggered entrance animations
- 🎯 Optional sections (toggle links/socials)
- 📜 Automatic copyright year
- ✨ Decorative gradient line

### Props

```typescript
interface FooterProps {
  className?: string        // Additional CSS classes
  showSocials?: boolean     // Show social links (default: true)
  showLinks?: boolean       // Show quick links (default: true)
}
```

### Usage

```tsx
import Footer from '@/components/Footer'

// Full footer (default)
<Footer />

// Minimal footer (no socials)
<Footer showSocials={false} />

// Links only (no socials or brand)
<Footer showLinks={true} showSocials={false} />

// Custom class
<Footer className="bg-gray-900" />
```

### Social Links

The component includes built-in social media links:
- **Instagram**: Full SVG icon with hover effects
- **TikTok**: Full SVG icon with hover effects
- **Twitter**: Full SVG icon with hover effects
- **Facebook**: Full SVG icon with hover effects

Each icon has:
- Tooltip on hover
- Scale + rotate animation
- Glow effect
- Spring transition

### Quick Links

Default quick links:
- Products (`/products`)
- About Us (`#about`)
- Contact (`#contact`)
- Admin (`/admin`)

### Animations
1. **Staggered entrance**: 0.1s delay between sections
2. **Social icons**: Scale + rotate on hover
3. **Link hover**: Slide right (5px), dot fade-in
4. **Tooltip**: Fade-in + slide up
5. **Decorative line**: Width animation (0 → 8rem)
6. **Copyright**: Fade-in with delay

### Customization

To modify social links, edit the `socialLinks` array in the component:

```typescript
const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/yourhandle',
    icon: <svg>...</svg>
  },
  // Add more...
]
```

---

## 🎨 Complete Page Example

Here's how to use all components together:

```tsx
'use client'

import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import SectionTitle from '@/components/SectionTitle'
import ProductPreviewCard from '@/components/ProductPreviewCard'
import Footer from '@/components/Footer'

export default function HomePage() {
  const featuredProducts = [
    {
      id: '1',
      title: 'Classic T-Shirt',
      price: 2999,
      image: '/images/tshirt.jpg',
      badge: 'NEW',
    },
    {
      id: '2',
      title: 'Premium Hoodie',
      price: 5999,
      image: '/images/hoodie.jpg',
    },
    // More products...
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero
        title="DROP 02"
        subtitle="Exclusive. Limited. Yours."
        description="Experience premium quality with limited edition products."
        ctaText="Explore Collection"
        ctaLink="/products"
      />

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionTitle subtitle="Discover our latest releases">
            Featured Products
          </SectionTitle>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {featuredProducts.map(product => (
              <ProductPreviewCard
                key={product.id}
                {...product}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
```

---

## 🎭 Animation System

All components use **Framer Motion** for animations.

### Common Animation Patterns

#### 1. Fade In + Slide Up
```tsx
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8 }}
```

#### 2. Scroll-Triggered Animation
```tsx
initial="hidden"
whileInView="visible"
viewport={{ once: true, margin: '-100px' }}
```

#### 3. Hover Effects
```tsx
whileHover={{ scale: 1.05, y: -5 }}
whileTap={{ scale: 0.95 }}
```

#### 4. Staggered Children
```tsx
variants={{
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}}
```

#### 5. Parallax Scroll
```tsx
const { scrollYProgress } = useScroll()
const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

<motion.div style={{ y }}>...</motion.div>
```

---

## 🎨 Design System

### Color Palette

```css
/* Gradients */
--gradient-primary: linear-gradient(to right, #a855f7, #3b82f6)
--gradient-title: linear-gradient(to right, #fff, #9ca3af)

/* Backgrounds */
--bg-card: rgba(255, 255, 255, 0.05)
--bg-hover: rgba(255, 255, 255, 0.1)

/* Borders */
--border-card: rgba(255, 255, 255, 0.1)
--border-hover: rgba(255, 255, 255, 0.2)

/* Text */
--text-primary: #ffffff
--text-secondary: #9ca3af
--text-muted: #6b7280
```

### Spacing Scale

```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
```

### Border Radius

```
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
full: 9999px
```

---

## 📱 Responsive Breakpoints

All components use Tailwind's responsive breakpoints:

```
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large
```

### Mobile-First Approach

Components are styled mobile-first:

```tsx
// Base styles apply to mobile
className="text-base"

// Then override for larger screens
className="text-base md:text-lg lg:text-xl"
```

---

## ⚡ Performance Tips

### 1. Use `viewport={{ once: true }}`
Animations only trigger once for better performance:
```tsx
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
/>
```

### 2. Optimize Images
Use Next.js Image component with proper sizes:
```tsx
<Image
  src={image}
  alt={title}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 3. Lazy Load Animations
Use `whileInView` instead of `animate` for below-the-fold content.

### 4. Reduce Motion
Consider adding reduced motion support:
```tsx
const shouldReduceMotion = useReducedMotion()

<motion.div
  animate={shouldReduceMotion ? {} : { y: -10 }}
/>
```

---

## 🔧 Customization Guide

### Changing Colors

Edit Tailwind config or component styles:

```tsx
// Change gradient colors
className="bg-gradient-to-r from-purple-500 to-blue-500"
// To:
className="bg-gradient-to-r from-pink-500 to-orange-500"
```

### Adjusting Animation Speed

Modify `transition` duration:

```tsx
// Default
transition={{ duration: 0.8 }}

// Faster
transition={{ duration: 0.4 }}

// Slower
transition={{ duration: 1.2 }}
```

### Custom Animation Variants

Create your own variants:

```tsx
const customVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    rotate: -10 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotate: 0,
    transition: { duration: 0.6 }
  }
}

<motion.div
  variants={customVariants}
  initial="hidden"
  animate="visible"
/>
```

---

## 📦 Installation & Setup

### Dependencies Required

```json
{
  "framer-motion": "^10.x",
  "next": "^14.x",
  "react": "^18.x",
  "tailwindcss": "^3.x"
}
```

### Install Framer Motion

```bash
npm install framer-motion
```

### Import Components

```tsx
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import SectionTitle from '@/components/SectionTitle'
import ProductPreviewCard from '@/components/ProductPreviewCard'
import Footer from '@/components/Footer'
```

---

## 🎯 Best Practices

1. **Always provide alt text** for images
2. **Use semantic HTML** (nav, header, footer, section)
3. **Keep animations subtle** - don't overdo it
4. **Test on mobile** - ensure touch interactions work
5. **Add loading states** for images
6. **Use `viewport={{ once: true }}`** to prevent re-triggering
7. **Provide fallbacks** for reduced motion preferences
8. **Keep components small** and focused on one task
9. **Use TypeScript** for type safety
10. **Test accessibility** with screen readers

---

## 🐛 Troubleshooting

### Animations Not Working

1. Check if Framer Motion is installed
2. Ensure `'use client'` directive is at the top
3. Verify motion components are being used (`motion.div`, not `div`)

### Layout Shifts

1. Use `fill` prop for images with `relative` parent
2. Provide width/height for images when possible
3. Add `aspect-ratio` to containers

### Performance Issues

1. Reduce number of animated elements
2. Use `will-change: transform` for frequently animated elements
3. Enable `once: true` for scroll animations
4. Optimize images (WebP, proper sizes)

---

## 📚 Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hooks](https://react.dev/reference/react)

---

## ✅ Component Checklist

- [x] Navbar - Transparent to solid on scroll
- [x] Hero - Gradient background with motion headline
- [x] SectionTitle - Heading with line animation
- [x] ProductPreviewCard - Mini card with hover zoom
- [x] Footer - Copyright + social links

**All components use Framer Motion for smooth, performant animations! 🎉**

