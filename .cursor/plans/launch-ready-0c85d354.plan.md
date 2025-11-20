<!-- 0c85d354-e32e-4090-8f44-5c859541d19e 51f2a84a-6668-41fa-a530-59de6da772a8 -->
# Enhanced Admin CRM & Order Management

## 1. Create Order Detail Page

**New file:** `app/admin/orders/[id]/page.tsx`

- Display full order details with customer info, products, status timeline
- Show products list with images, names, quantities, prices
- Include quick action buttons: Mark Shipped, Cancel Order, Refund
- Add editable fields with permission checks (admin notes, internal status)
- Show customer profile summary with link to customer detail page

**API Route:** `pages/api/admin/orders/[id].ts`

- GET endpoint to fetch single order with full details
- Include customer data, order items with product info, order history

## 2. Update Notifications to Navigate to Order Details

**File:** `components/admin/NotificationSystem.tsx`

- Change `onClick` handler to navigate to `/admin/orders/[orderId]` 
- Use `useRouter` from `next/navigation`
- Pass order ID from notification data

## 3. Improve Order Display Format

**Files:**

- `app/admin/orders/page.tsx` - orders list
- `components/admin/NotificationSystem.tsx` - notification display
- `app/admin/page.tsx` - dashboard recent orders

**Change from:** Order ID (e.g., "d3f13947...")

**Change to:** Phone + City + Total (e.g., "0663406326 - Tangier - 50.00 MAD")

Update display logic:

```typescript
const formatOrderDisplay = (order) => {
  const phone = order.customer?.phone || 'Unknown'
  const city = order.customer?.city || 'N/A'
  const total = formatPrice(order.totalCents)
  return `${phone} - ${city} - ${total}`
}
```

## 4. Enhanced Customer Search & Filtering

**File:** `app/admin/customers/page.tsx`

Add advanced filters:

- Search by name, phone, city, email
- Filter by tags (New, Regular, VIP, Premium)
- Filter by order count ranges (1, 2-4, 5-9, 10+)
- Filter by spending tiers (< 500 MAD, 500-1000, 1000-5000, 5000+)
- Sort options: Recent orders, Total spent, Name A-Z

Update UI with multi-select dropdown filters and enhanced search bar.

## 5. Customer Order History View

**New file:** `app/admin/customers/[id]/page.tsx`

- Display customer profile with full details
- Show complete order history in chronological table
- Include order totals, dates, statuses, products purchased
- Add customer lifetime value stats
- Show customer activity timeline

**API Route:** `pages/api/admin/customers/[id].ts`

- GET endpoint with customer data + all orders
- Include order items and product details

## 6. Quick Actions for Customers

**File:** `app/admin/customers/page.tsx`

Add action buttons per customer row:

- Call button (opens tel: link with phone number)
- Message button (opens WhatsApp with pre-filled message)
- Mark as VIP (updates customer tags)
- Block/Unblock customer (toggle isBlocked status)
- View orders (navigate to customer detail page)

**API Route:** `pages/api/admin/customers/[id].ts`

- PATCH endpoint to update customer tags, blocked status, notes

## 7. Order Quick Actions with Permissions

**File:** `app/admin/orders/page.tsx`

Add inline action buttons:

- View details (navigate to order page)
- Mark as Shipped (update status)
- Cancel order (update status + restore stock)
- Quick status dropdown (pending/processing/shipped/delivered/cancelled)

Add permission check:

```typescript
const canEditOrders = session?.user?.role === 'admin' || session?.user?.permissions?.includes('edit_orders')
```

Show actions only if user has permission.

## 8. Display Products in Orders List

**File:** `app/admin/orders/page.tsx`

Parse `items` JSON field and display:

- Product count badge (e.g., "3 items")
- On hover/expand: Show product names and quantities
- Use compact product list component

## Key Files to Modify

- `components/admin/NotificationSystem.tsx` - clickable notifications, display format
- `app/admin/orders/page.tsx` - display format, quick actions, products list
- `app/admin/orders/[id]/page.tsx` - NEW - order detail page
- `app/admin/customers/page.tsx` - enhanced search/filters, quick actions
- `app/admin/customers/[id]/page.tsx` - NEW - customer detail page
- `app/admin/page.tsx` - display format for recent orders
- `pages/api/admin/orders/[id].ts` - NEW/update - single order endpoint
- `pages/api/admin/customers/[id].ts` - NEW/update - single customer endpoint with orders

## Implementation Notes

- Use existing `CustomerBadge` component for loyalty status display
- Maintain consistent MAD currency formatting throughout
- Add loading states for all async actions
- Include error handling and toast notifications
- Preserve real-time Pusher updates for new orders
- Use existing authentication/session for permission checks

### To-dos

- [ ] Fix Fragment badge color and enhance Our Story background
- [ ] Implement lazy loading for images and heavy components
- [ ] Enhance product card design with hover effects
- [ ] Remove console logs and development comments
- [ ] Move admin to secret URL and update all references
- [ ] Setup admin push notifications for orders and stock
- [ ] Update metadata and add final security checks
- [ ] Create order detail page with full info and quick actions
- [ ] Update notifications to navigate to order detail page
- [ ] Change order display to phone + city + total format
- [ ] Add advanced search and filtering to customers page
- [ ] Create customer detail page with order history
- [ ] Add call, message, VIP, block quick actions
- [ ] Add order quick actions with permission checks
- [ ] Show products in orders list with counts