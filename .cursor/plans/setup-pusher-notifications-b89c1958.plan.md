<!-- b89c1958-e95d-4c07-acaf-390275590d4a 74516a59-2b84-4c98-a017-aeb418654992 -->
# Hero Section 3D Glass Morphism Background

## Overview

Replace the current background with a glass morphism effect that automatically detects the dominant color from each slide's image and creates layered frosted glass panels with 3D depth.

## Implementation Steps

### 1. Add Color Extraction Utility

**File:** `app/page.tsx`

- Add a function to extract dominant color from image URL using Canvas API
- This will analyze the uploaded image and get the primary color (black, green, blue, grey)
- Store extracted colors in component state alongside hero slides

### 2. Update Hero Background Effects

**File:** `app/page.tsx` (lines ~167-267)

Replace current background layers with:

- **Base layer**: Darkened blurred image (keep existing)
- **Glass panels**: 3-4 frosted glass layers with:
- `backdrop-filter: blur()`
- Semi-transparent backgrounds using detected color
- Different z-index depths
- Subtle transforms for 3D perspective
- Border highlights using detected color
- **Depth shadows**: Drop shadows between layers
- **Animated subtle movements**: Slight parallax/floating effect

Key CSS properties:

- `backdrop-filter: blur(20px)` for frosted glass
- `background: rgba(detected-color, 0.1)` for tinting
- `transform: translateZ()` for 3D depth
- `box-shadow` for layer separation
- Smooth transitions when slides change

### 3. Remove Orange Accents

- Replace all orange color references (#ff5b00, rgba(255, 91, 0, ...))
- Use dynamically detected color instead
- Update text glow to use white/neutral or detected color

### 4. Ensure Text Visibility

- Keep strong text shadows for contrast
- Use white text as base
- Add subtle glow using the detected accent color
- Ensure legibility on all color backgrounds

## Expected Result

Each slide will have a unique 3D glass morphism background that matches its image:

- Eclipse Black: Deep black glass layers
- Forest Dusk: Green-tinted frosted glass
- Ocean Deep: Blue frosted glass panels
- Cloud Mist: Grey glass layers

All with smooth color transitions and 3D depth effect.

### To-dos

- [ ] Add HeroSlide model to Prisma schema
- [ ] Create migration for HeroSlide model
- [ ] Create API endpoints for managing hero slides
- [ ] Create admin page for hero slide management
- [ ] Update homepage to fetch hero slides from database
- [ ] Add video support to hero carousel