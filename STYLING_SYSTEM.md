# 🎨 Styling System Documentation

## Overview

Complete styling polish with custom Tailwind theme, smooth animations, and micro-interactions.

---

## 🎨 Custom Theme Configuration

### Color Palette

#### Brand Colors (#ff5500 - Orange)
```css
brand-DEFAULT: #ff5500  /* Primary brand color */
brand-50:  #fff7ed     /* Lightest */
brand-100: #ffedd5
brand-200: #fed7aa
brand-300: #fdba74
brand-400: #fb923c
brand-500: #ff5500     /* Base */
brand-600: #ea580c
brand-700: #c2410c
brand-800: #9a3412
brand-900: #7c2d12     /* Darkest */
```

#### Dark Colors (#0a0a0a)
```css
dark-DEFAULT: #0a0a0a  /* Primary dark color */
dark-50:  #f5f5f5     /* Lightest */
dark-100: #e5e5e5
dark-200: #d4d4d4
dark-300: #a3a3a3
dark-400: #737373
dark-500: #525252
dark-600: #404040
dark-700: #262626
dark-800: #171717
dark-900: #0a0a0a     /* Darkest - Base */
```

### Usage Examples

```tsx
// Brand colors
<div className="bg-brand text-white">Brand Background</div>
<div className="text-brand-500">Brand Text</div>
<div className="border-brand-600">Brand Border</div>

// Dark colors
<div className="bg-dark text-white">Dark Background</div>
<div className="bg-dark-800">Darker Background</div>
```

---

## 📝 Typography

### Font Families

**Heading Font:** Poppins (Google Fonts)
- Weights: 400, 500, 600, 700, 800, 900
- Use: Headlines, titles, hero text

**Body Font:** Inter (Google Fonts)
- Weights: 300, 400, 500, 600, 700, 800, 900
- Use: Body text, paragraphs, UI elements

### Usage

```tsx
// Headings automatically use Poppins
<h1 className="font-heading text-6xl">Big Title</h1>

// Body text uses Inter
<p className="font-body text-base">Paragraph text</p>

// Or use font-sans (defaults to Inter)
<span className="font-sans">UI Element</span>
```

### Responsive Typography

- **Mobile (< 640px):** Base font size 14px
- **Desktop (640px - 1920px):** Base font size 16px
- **Large Desktop (> 1920px):** Base font size 18px

---

## ✨ Custom Gradients

### Background Gradients

```tsx
// Brand gradient (orange fade)
<div className="bg-gradient-brand">...</div>
// Output: linear-gradient(135deg, #ff5500 0%, #ff8800 100%)

// Dark gradient (black to gray)
<div className="bg-gradient-dark">...</div>
// Output: linear-gradient(180deg, #000 0%, #0a0a0a 50%, #111 100%)

// Radial gradient
<div className="bg-gradient-radial from-brand-500 to-transparent">...</div>

// Mesh pattern background
<div className="bg-mesh">...</div>
```

---

## 💫 Animations

### Built-in Animations

```tsx
// Fade in
<div className="animate-fade-in">Fades in on load</div>

// Fade in up
<div className="animate-fade-in-up">Fades in while sliding up</div>

// Slide in from left
<div className="animate-slide-in-left">Slides from left</div>

// Slide in from right
<div className="animate-slide-in-right">Slides from right</div>

// Scale in
<div className="animate-scale-in">Scales up on load</div>

// Glow pulse (infinite)
<div className="animate-glow-pulse">Pulses with glow effect</div>
```

### Keyframes Defined

1. **fadeIn** - Simple opacity transition
2. **fadeInUp** - Opacity + translate Y
3. **slideInLeft** - Opacity + translate X (left)
4. **slideInRight** - Opacity + translate X (right)
5. **scaleIn** - Opacity + scale
6. **glowPulse** - Pulsing box shadow

---

## 🎯 Box Shadows (Glow Effects)

### Shadow Utilities

```tsx
// Standard glow
<button className="shadow-glow">...</button>
// Output: 0 0 20px rgba(255, 85, 0, 0.5)

// Large glow
<button className="shadow-glow-lg">...</button>
// Output: 0 0 40px rgba(255, 85, 0, 0.6)

// Extra large glow
<button className="shadow-glow-xl">...</button>
// Output: 0 0 60px rgba(255, 85, 0, 0.7)

// Neon effect
<div className="shadow-neon">...</div>
// Output: 0 0 5px brand, 0 0 20px brand
```

---

## 🔘 Button Components

### Pre-built Button Classes

```tsx
// Brand button (orange with glow on hover)
<button className="btn btn-brand">Click Me</button>

// Outline button
<button className="btn btn-outline">Outlined</button>

// Ghost button
<button className="btn btn-ghost">Ghost</button>
```

### Button Micro-interactions

All buttons include:
- **Hover:** Scale 1.05x + glow shadow
- **Active:** Scale 0.95x
- **Transition:** 300ms ease-out

### Custom Button Examples

```tsx
// Basic button with scale + glow
<button className="hover:scale-105 hover:shadow-glow-lg transition-all duration-300">
  Hover Me
</button>

// Button with all effects
<button className="btn-brand hover-lift hover-glow">
  Premium Button
</button>
```

---

## 📥 Input Styles

### Input Component

```tsx
<input className="input" type="email" placeholder="Enter email" />
```

**Includes:**
- Glassmorphism background (`bg-white/5`)
- Border animation on focus (brand color)
- Ring effect on focus
- Smooth transitions

### Focus States

- **Border:** Changes to brand color
- **Ring:** 2px brand-colored ring with 50% opacity
- **Transition:** 300ms ease-out

---

## 🃏 Card Components

### Card Class

```tsx
<div className="card p-6">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>
```

**Includes:**
- Glassmorphism effect
- Border animation on hover
- Shadow glow on hover
- Smooth transitions

### Glass Effect

```tsx
<div className="glass p-8 rounded-2xl">
  Glassmorphism container
</div>
```

---

## ✨ Utility Classes

### Hover Effects

```tsx
// Lift on hover (-8px translateY)
<div className="hover-lift">...</div>

// Glow on hover
<div className="hover-glow">...</div>

// Scale on hover (1.05x)
<div className="hover-scale">...</div>
```

### Text Effects

```tsx
// Glow text
<h1 className="text-glow">Glowing Text</h1>

// Gradient text
<h2 className="gradient-text">Gradient Text</h2>
```

### Line Clamp

```tsx
<p className="line-clamp-1">Single line with ellipsis</p>
<p className="line-clamp-2">Two lines with ellipsis</p>
<p className="line-clamp-3">Three lines with ellipsis</p>
```

### Aspect Ratios

```tsx
<div className="aspect-square">1:1 ratio</div>
<div className="aspect-video">16:9 ratio</div>
<div className="aspect-portrait">3:4 ratio</div>
```

---

## 🌐 Smooth Scrolling

### HTML Scroll Behavior

```css
html {
  scroll-behavior: smooth;
}
```

All anchor links now scroll smoothly to their targets.

### Usage

```tsx
<a href="#section">Smooth scroll to section</a>

<section id="section">
  Target content
</section>
```

---

## 🎨 Custom Scrollbar

### Styled Scrollbar

- **Width:** 10px
- **Track:** Dark background (#0a0a0a)
- **Thumb:** Gray (#333)
- **Thumb Hover:** Brand color (#ff5500)

Automatically applied to all scrollable elements.

---

## 📱 Responsive Hero

### Mobile Optimizations

```tsx
// Responsive text sizes
<h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl">
  Responsive Hero
</h1>

// Responsive spacing
<section className="py-12 sm:py-16 md:py-20 lg:py-32">
  ...
</section>

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
  ...
</div>
```

### Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## ♿ Accessibility Features

### Focus Visible

```css
:focus-visible {
  outline: 2px solid var(--brand-color);
  outline-offset: 2px;
}
```

All interactive elements have visible focus indicators.

### Text Selection

```css
::selection {
  background-color: #ff5500;
  color: white;
}
```

Selected text uses brand colors.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Animations disabled for users who prefer reduced motion */
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}
```

### High Contrast Mode

```css
@media (prefers-contrast: high) {
  /* Enhanced borders and outlines for better visibility */
}
```

---

## 🎯 Complete Button Example

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="btn btn-brand"
>
  <span>Click Me</span>
  <span>→</span>
</motion.button>
```

**Includes:**
- Custom button base styles (`.btn`)
- Brand color styling (`.btn-brand`)
- Hover scale animation (Framer Motion)
- Tap feedback (Framer Motion)
- Glow effect on hover
- Smooth transitions

---

## 📐 Layout Utilities

### Container Sizes

```tsx
// Max width with centered content
<div className="max-w-7xl mx-auto px-4">...</div>

// Specific max widths
<div className="max-w-xl">Small container</div>
<div className="max-w-4xl">Medium container</div>
<div className="max-w-7xl">Large container</div>
```

### Spacing Scale

```tsx
// Padding
px-4   // 1rem (16px)
px-6   // 1.5rem (24px)
px-8   // 2rem (32px)
py-12  // 3rem (48px)
py-20  // 5rem (80px)
py-32  // 8rem (128px)

// Gaps
gap-4  // 1rem (16px)
gap-6  // 1.5rem (24px)
gap-8  // 2rem (32px)
```

---

## 🎨 Color Usage Guidelines

### Primary Brand Color (#ff5500)

**Use for:**
- Primary CTAs
- Important buttons
- Hover states
- Focus indicators
- Links
- Highlights

### Dark Color (#0a0a0a)

**Use for:**
- Backgrounds
- Cards (with opacity)
- Modal overlays
- Section backgrounds

### Accent Usage

```tsx
// Orange accent
<span className="text-orange-400">Accent text</span>

// Cyan accent (secondary)
<span className="text-cyan-400">Secondary accent</span>
```

---

## 🌟 Best Practices

### 1. Button Interactions

Always include:
- Hover scale (1.05x)
- Active scale (0.95x)
- Glow shadow on hover
- 300ms transition

```tsx
<button className="hover:scale-105 active:scale-95 hover:shadow-glow-lg transition-all duration-300">
  Button
</button>
```

### 2. Card Interactions

```tsx
<div className="card hover:shadow-glow hover:-translate-y-2 transition-all duration-300">
  Card content
</div>
```

### 3. Text Hierarchy

```tsx
<h1 className="font-heading text-6xl font-bold">Main Title</h1>
<h2 className="font-heading text-4xl font-semibold">Section Title</h2>
<p className="font-body text-base">Body text</p>
```

### 4. Glassmorphism Effect

```tsx
<div className="glass p-8 rounded-2xl border border-white/10">
  Glassmorphism content
</div>
```

### 5. Responsive Images

```tsx
<Image
  src="/image.jpg"
  alt="Description"
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

---

## 📊 Performance Tips

### 1. Use Transform for Animations

```tsx
// Good: Uses GPU acceleration
<div className="hover:scale-105">...</div>

// Avoid: Can cause repaints
<div className="hover:w-64">...</div>
```

### 2. Minimize Shadow Usage

Use glow shadows sparingly on hover states only.

### 3. Optimize Font Loading

Fonts are preloaded via Google Fonts with `display=swap`.

---

## 🎁 Quick Reference

### Color Variables

```css
--brand-color: #ff5500
--dark-color: #0a0a0a
--brand-glow: rgba(255, 85, 0, 0.5)
--transition-base: 0.3s ease-out
--transition-slow: 0.6s ease-out
```

### Common Patterns

```tsx
// Button with all effects
<button className="btn btn-brand hover-lift hover-glow">
  Button
</button>

// Card with hover effects
<div className="card hover-lift hover-glow p-6">
  Card
</div>

// Input with focus effects
<input className="input" type="text" />

// Gradient text
<h2 className="gradient-text text-4xl">Title</h2>

// Responsive container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  Content
</div>
```

---

## ✅ Checklist

- [x] Custom brand colors (#ff5500)
- [x] Custom dark colors (#0a0a0a)
- [x] Poppins heading font
- [x] Inter body font
- [x] Smooth scroll behavior
- [x] Fade transitions
- [x] Button micro-interactions (scale + glow)
- [x] Responsive hero on all devices
- [x] Custom scrollbar
- [x] Focus indicators
- [x] Reduced motion support
- [x] High contrast mode
- [x] Glassmorphism effects
- [x] Glow shadows
- [x] Animation utilities
- [x] Responsive typography

---

## 🎉 Result

A polished, professional styling system with:
- Custom brand colors throughout
- Beautiful typography with Google Fonts
- Smooth animations and transitions
- Micro-interactions on all buttons
- Fully responsive design
- Accessibility features
- Performance optimized
- Easy to extend

**All styling is production-ready!** 🚀

