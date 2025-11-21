<!-- 0c85d354-e32e-4090-8f44-5c859541d19e 5cd6145d-cb25-4401-8373-305c5b781f86 -->
# Complete Admin Audit System

## Overview

Extend the existing audit system to track all admin actions throughout the dashboard, including data modifications, external communications, and content management operations.

## Implementation Plan

### 1. Add Helper Functions to Audit Logger

**File: `lib/audit-logger.ts`**

Add specialized tracking functions for:

- Product operations (create, update, delete, price change, stock change)
- Content management (hero slides, carousels, collection stacks, archive)
- Settings changes (tracking IDs, configuration)
- Newsletter actions (export, view)
- External actions (WhatsApp clicks, phone calls, email)

### 2. Integrate Audit Logging into Product APIs

**File: `pages/api/admin/products/[id].ts`**

- Track product updates (price changes, stock changes, title/description edits)
- Track product deletions with full product details in oldValue
- Import and use `logAdminAction` utility

**File: `pages/api/admin/products/index.ts`**

- Track new product creation with product details

### 3. Add Audit Logging to Content Management APIs

**File: `pages/api/hero-slides.ts`**

- Track hero slide creation, updates, and deletions
- Track activation/deactivation toggles

**File: `pages/api/fashion-carousel.ts`**

- Track carousel image additions and removals
- Track order changes

**File: `pages/api/collection-stacks/[id].ts` and `index.ts`**

- Track collection stack creation, updates, and deletions
- Track image updates and settings changes

**File: `pages/api/archive-collection.ts`**

- Track archive collection modifications

### 4. Add Audit Logging to Settings

**File: `pages/api/admin/settings/tracking.ts`**

- Track changes to tracking IDs (Google Ads, Analytics, Facebook, TikTok, Snapchat)
- Log old and new values for each setting
- Track enable/disable toggle

### 5. Track Newsletter Actions

**File: `pages/api/admin/newsletter/export.ts`**

- Log CSV exports with subscriber count
- Track who exported and when

### 6. Create External Actions Tracking API

**New File: `pages/api/admin/actions/external.ts`**

- Endpoint to log external actions from client-side
- Accept action type (whatsapp, phone, email), entity (order/customer), entityId
- Create audit log entry

### 7. Add Client-Side External Action Tracking

**File: `app/admin/orders/[id]/page.tsx`**

- Track WhatsApp button clicks
- Track phone call button clicks
- Send to external actions API

**File: `app/admin/customers/[id]/page.tsx`**

- Track WhatsApp, phone, and email button clicks
- Track VIP marking and blocking actions (already done, verify)

**File: `app/admin/customers/page.tsx`**

- Track quick action button clicks

### 8. Update Activity Feed to Show All Action Types

**File: `app/admin/activity/page.tsx`**

- Add filter options for new action types (products, content, settings, external)
- Update icon mapping for new action types
- Add color coding for different categories

### 9. Add Action Type Constants

**New File: `lib/audit-action-types.ts`**

- Define constants for all action types
- Categorize actions (DATA_CHANGE, EXTERNAL_ACTION, CONTENT_MANAGEMENT)
- Export for consistent usage across codebase

## Key Features

- All data modifications tracked with old/new values
- External communications logged (WhatsApp, phone, email)
- Content management operations audited
- Settings changes tracked
- Client-side tracking for user interactions
- Real-time display in Activity Feed
- Searchable and filterable audit trail

## Testing Checklist

After implementation:

- Create/edit/delete a product → appears in Activity
- Change tracking settings → logged
- Click WhatsApp on order → tracked
- Export newsletter → recorded
- Update hero slide → audited
- All actions show user name and timestamp

### To-dos

- [ ] Fix Fragment badge color and enhance Our Story background
- [ ] Implement lazy loading for images and heavy components
- [ ] Enhance product card design with hover effects
- [ ] Remove console logs and development comments
- [ ] Move admin to secret URL and update all references
- [ ] Setup admin push notifications for orders and stock
- [ ] Update metadata and add final security checks