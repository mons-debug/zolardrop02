<!-- 0c85d354-e32e-4090-8f44-5c859541d19e 806fd92d-2d31-4414-82e4-c6ef1f8d309c -->
# Dashboard Notifications Fix & Pro Enhancement

## The Problem

When dashboard is closed and orders come in, notifications are lost. When user returns, they don't see what they missed.

## The Solution

### 1. Missed Notifications System

- Store "last seen" timestamp in localStorage
- On dashboard open, fetch orders created since last visit
- Show missed notifications with visual indicator (NEW badge)
- Notification bell shows count of missed items
- Play catch-up sound for missed orders

### 2. Better Notification Management

- Persistent notification history (doesn't disappear)
- Mark as read/unread functionality
- Filter: All / Unread / Orders / Low Stock
- Clear individual notifications
- Timestamp showing "5 mins ago", "2 hours ago"

### 3. Professional Dashboard UI

- Stats cards with trend indicators (↑ ↓)
- Quick action buttons (Filter by status, Export)
- Better notification dropdown with sections
- Loading states for better UX
- Empty states with helpful messages

### 4. Sound & Visual Improvements

- Different sound for missed vs live notifications
- Badge animation when new items arrive
- Smooth transitions for notification panel
- Professional color scheme (orange accents)

## Technical Approach - Multi-Device Support

### Database Solution (Proper Way)

1. **New Table: `AdminNotification`**

- Tracks all notification events (orders, low stock)
- Each notification has unique ID
- Timestamp when created

2. **New Table: `AdminNotificationRead`**

- Tracks which notifications the admin has seen
- Links notification ID to admin user
- Timestamp when marked as read

3. **On Dashboard Open (Any Device):**

- Fetch all notifications
- Check which ones user has already seen
- Show unread count on bell icon
- Display unread notifications prominently

4. **Real-time Updates:**

- Pusher delivers new notifications to ALL open tabs
- Database stores them for devices that are closed
- When user marks as read on one device → syncs to all devices

5. **Benefits:**

- Works across multiple devices/tabs
- Notification history persists
- Can track which admin saw which notification
- Can add "unread" filter

### Fallback: Hybrid Approach (Simpler)

If you want to avoid database changes:

- Use localStorage + timestamp
- Each tab checks for orders since last localStorage update
- Real-time works for open tabs
- Closed tabs show missed orders on reopen
- **Limitation:** Marking as "read" doesn't sync across devices

## Files to Modify

- `prisma/schema.prisma` - Add notification tables (if using database approach)
- `pages/api/admin/notifications.ts` - New API for fetching/marking read
- `components/admin/NotificationSystem.tsx` - Enhanced notification logic
- `app/admin/page.tsx` - Dashboard integration

## Which Approach Do You Prefer?

**Option A (Recommended):** Database tracking - proper multi-device support
**Option B (Simpler):** localStorage - works but no cross-device sync

### To-dos

- [ ] Fix Fragment badge color and enhance Our Story background
- [ ] Implement lazy loading for images and heavy components
- [ ] Enhance product card design with hover effects
- [ ] Remove console logs and development comments
- [ ] Move admin to secret URL and update all references
- [ ] Setup admin push notifications for orders and stock
- [ ] Update metadata and add final security checks