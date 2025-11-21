<!-- 0c85d354-e32e-4090-8f44-5c859541d19e 5cd6145d-cb25-4401-8373-305c5b781f86 -->
# Admin Audit & Activity Tracking System

## What You'll Get

### 1. Order Activity Log

- **Who confirmed** each order (with timestamp)
- **Who changed status** (pending → confirmed → shipped)
- **Who added notes** to the order
- **Who marked as delivered/refunded**
- Full history timeline for each order

### 2. Admin User Analytics (Super Admin Only)

- **Dashboard showing:**
  - Each admin user's activity stats
  - Orders they've handled
  - Last login time
  - Actions performed today/week/month

### 3. Customer CRM Enhancements

- **Show who:**
  - Marked customer as VIP
  - Blocked/unblocked customer
  - Added notes to customer
  - Last contacted customer

### 4. System Activity Feed

- Real-time feed of all admin actions
- Filter by: User, Action Type, Date
- Export to CSV for auditing

## Database Changes

### New Table: `AdminAction`

```
- id: unique ID
- userId: which admin did it
- actionType: 'order-confirm', 'order-edit', 'customer-vip', etc.
- targetType: 'order', 'customer', 'product'
- targetId: ID of the affected item
- details: JSON with before/after values
- ipAddress: where action was performed
- createdAt: when it happened
```

### Update Existing Tables:

- **Order**: Add fields
  - `confirmedBy` (userId)
  - `shippedBy` (userId)
  - `lastEditedBy` (userId)

- **Customer**: Add fields
  - `markedVipBy` (userId)
  - `blockedBy` (userId)

## UI Additions

### 1. Order Details Page

Show activity timeline:

```
┌─────────────────────────────────┐
│ ORDER ACTIVITY                  │
├─────────────────────────────────┤
│ ✓ Delivered by Ahmed            │
│   Today at 3:45 PM              │
│                                 │
│ 📦 Shipped by Sara              │
│   Yesterday at 10:20 AM         │
│                                 │
│ ✓ Confirmed by Mohammed         │
│   2 days ago at 9:15 AM         │
│                                 │
│ 📝 Created (COD Checkout)       │
│   3 days ago at 2:30 PM         │
└─────────────────────────────────┘
```

### 2. Super Admin Dashboard

New section: "Team Activity"

```
┌──────────────────────────────────┐
│ ADMIN USERS                      │
├──────────────────────────────────┤
│ Ahmed (You)                      │
│ • 45 orders this week            │
│ • Last active: Just now          │
│                                  │
│ Sara (Manager)                   │
│ • 23 orders this week            │
│ • Last active: 2 hours ago       │
│                                  │
│ Mohammed (Viewer)                │
│ • 5 orders viewed this week      │
│ • Last active: Yesterday         │
└──────────────────────────────────┘
```

### 3. Activity Feed Page

New page: `/admin/activity`

- Shows all actions across the system
- Filter by user, date, action type
- Search functionality

## Technical Implementation

### Automatic Logging

Every time an admin:

- Updates order status → Log it
- Adds notes → Log it
- Marks customer as VIP → Log it
- Blocks customer → Log it
- Changes product → Log it

### Who's Logged In?

Track current admin user:

- Store in session/JWT
- Pass to all API calls
- Log with every action

### Permissions

- **Super Admin**: See all activity, all users
- **Admin/Manager**: See own activity only
- **Viewer**: No access to activity logs

## Files to Create/Modify

### Database:

- `prisma/schema.prisma` - Add AdminAction table

### API:

- `pages/api/admin/activity/index.ts` - Fetch activity logs
- `pages/api/admin/users/stats.ts` - User analytics
- `lib/audit-log.ts` - Helper to log actions

### Pages:

- `app/admin/activity/page.tsx` - Activity feed page
- `app/admin/users/page.tsx` - Team management (super admin only)

### Updates:

- `pages/api/admin/orders/[id].ts` - Log when status changes
- `pages/api/admin/customers/[id].ts` - Log customer actions
- `components/admin/OrderTimeline.tsx` - Show activity on orders

### To-dos

- [ ] Fix Fragment badge color and enhance Our Story background
- [ ] Implement lazy loading for images and heavy components
- [ ] Enhance product card design with hover effects
- [ ] Remove console logs and development comments
- [ ] Move admin to secret URL and update all references
- [ ] Setup admin push notifications for orders and stock
- [ ] Update metadata and add final security checks