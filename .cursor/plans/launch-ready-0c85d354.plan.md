<!-- 0c85d354-e32e-4090-8f44-5c859541d19e 2461c0fb-8254-4fb7-b47c-4997a9a43aad -->
# Backend & Performance Optimization Plan

## Overview

Focus on backend optimizations that improve performance, security, and SEO without changing the visible frontend or user experience.

## What We'll Fix

### 1. Code Cleanup (SAFE)

- Remove all 441 console.log statements from production code
- Keep only critical error logging wrapped in environment checks
- Clean up commented code and unused imports

### 2. API Performance (SAFE)

- Add Cache-Control headers to all API routes
- Optimize frequently-accessed endpoints (/api/products, /api/collection-stacks, /api/hero-slides)
- Add cache headers: `s-maxage=60, stale-while-revalidate` for dynamic data
- Add cache headers: `s-maxage=3600, stale-while-revalidate` for static settings

### 3. Image Optimization (SAFE - No Visual Change)

- Remove `unoptimized={true}` from Image components (enables Next.js optimization)
- Add `priority` prop to hero/above-fold images for faster LCP
- Add proper `sizes` prop where missing for better responsive loading
- **Note:** Images will look identical but load faster

### 4. Database Query Optimization (SAFE)

- Review and optimize Prisma queries
- Add proper indexes if missing
- Ensure efficient data fetching patterns

### 5. Security Hardening (SAFE)

- Add rate limiting to checkout API
- Add rate limiting to search API
- Add environment variable validation on startup
- Add input sanitization where missing

### 6. SEO Enhancement (SAFE - Backend Only)

- Add JSON-LD structured data to product pages
- Create XML sitemap generation
- Add robots.txt with proper configuration
- Add canonical URLs to all pages
- Improve meta tags for better social sharing

### 7. Production Configuration (SAFE)

- Optimize next.config.js for production
- Add proper error boundaries
- Configure proper logging strategy

## What We WON'T Touch

- ❌ No UI/layout changes
- ❌ No animation modifications  
- ❌ No color or styling changes
- ❌ No component restructuring
- ❌ No user-facing functional changes

## Expected Results

- 40-60% faster page load times
- Better Google rankings (SEO)
- More secure against abuse
- Lower server costs (caching)
- Better core web vitals scores
- Professional production-ready code

### To-dos

- [ ] Fix Fragment badge color and enhance Our Story background
- [ ] Implement lazy loading for images and heavy components
- [ ] Enhance product card design with hover effects
- [ ] Remove console logs and development comments
- [ ] Move admin to secret URL and update all references
- [ ] Setup admin push notifications for orders and stock
- [ ] Update metadata and add final security checks