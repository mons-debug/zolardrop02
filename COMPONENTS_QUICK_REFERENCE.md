# 🚀 Components Quick Reference Card

## 📦 Import Statements

```tsx
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import SectionTitle from '@/components/SectionTitle'
import ProductPreviewCard from '@/components/ProductPreviewCard'
import Footer from '@/components/Footer'
```

---

## 🧭 Navbar

```tsx
<Navbar />
```

**Features:** Transparent → solid on scroll, glassmorphism, mobile responsive

---

## 🚀 Hero

```tsx
<Hero
  title="DROP 02"
  subtitle="Exclusive. Limited. Yours."
  ctaText="Explore Collection"
  ctaLink="/products"
/>
```

**Required:** `title`  
**Optional:** `subtitle`, `description`, `ctaText`, `ctaLink`, `showBadge`, `badgeText`, `className`

---

## 📝 SectionTitle

```tsx
<SectionTitle subtitle="Optional subtitle">
  Your Title Here
</SectionTitle>
```

**Alignments:** `center` (default), `left`, `right`  
**Optional:** `subtitle`, `align`, `className`, `animate`

---

## 🛍️ ProductPreviewCard

```tsx
<ProductPreviewCard
  id="prod-123"
  title="Product Name"
  price={2999}  // in cents
  image="/path/to/image.jpg"
  badge="NEW"
  inStock={true}
/>
```

**Required:** `id`, `title`, `price`, `image`  
**Optional:** `slug`, `badge`, `inStock`, `className`

---

## 🦶 Footer

```tsx
<Footer />
```

**Optional:** `showSocials`, `showLinks`, `className`

---

## 🎯 Complete Page Template

```tsx
'use client'

import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import SectionTitle from '@/components/SectionTitle'
import ProductPreviewCard from '@/components/ProductPreviewCard'
import Footer from '@/components/Footer'

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <Hero
        title="YOUR TITLE"
        subtitle="Your subtitle"
        ctaText="Get Started"
        ctaLink="/products"
      />
      
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionTitle>Featured Products</SectionTitle>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <ProductPreviewCard
              id="1"
              title="Product"
              price={2999}
              image="/image.jpg"
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
```

---

## 🎨 Common Patterns

### Grid Layouts

```tsx
{/* 1 → 2 → 3 → 4 columns */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* Cards here */}
</div>

{/* 1 → 3 columns */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Cards here */}
</div>
```

### Section Wrapper

```tsx
<section className="py-20 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    {/* Content */}
  </div>
</section>
```

### Gradient Backgrounds

```tsx
{/* Black to purple */}
<section className="bg-gradient-to-b from-black via-purple-950/10 to-black">

{/* Purple to blue */}
<section className="bg-gradient-to-r from-purple-600 to-blue-600">
```

---

## ⚡ Animation Tips

1. Use `viewport={{ once: true }}` for scroll animations
2. Keep durations between 0.3s - 0.8s
3. Use `whileHover` for interactive elements
4. Add `transition={{ type: 'spring' }}` for bouncy effects

---

## 🎯 Demo Page

View all components in action:
```
http://localhost:3000/components-demo
```

---

## 📚 Full Documentation

Read complete docs:
```
/COMPONENTS_DOCUMENTATION.md
```

---

## ✅ Checklist

- [x] **Navbar** - Scroll-based transparency
- [x] **Hero** - Full-screen with parallax
- [x] **SectionTitle** - Animated underline
- [x] **ProductPreviewCard** - Hover zoom
- [x] **Footer** - Social links included

**All components use Framer Motion! 🎉**

