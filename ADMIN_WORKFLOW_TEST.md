# Admin Dashboard - Complete Workflow Testing Guide

## ✅ All Features Implemented

### Authentication
- ✅ Password/token-based login (MVP security)
- ✅ Session persistence (sessionStorage)
- ✅ Logout functionality
- ✅ Protected API routes

### Order Management
- ✅ Fetch orders from database (Prisma)
- ✅ Display orders sorted by createdAt DESC
- ✅ Show order details: ID, Total, Payment Method, Status, Created At
- ✅ One-click status updates (pending → confirmed → shipped → delivered)
- ✅ PATCH endpoint for status updates

### Real-Time Features
- ✅ Pusher WebSocket connection
- ✅ Listen to `admin-orders` channel
- ✅ Handle `new-order` events
- ✅ Toast notification: "🧾 New COD order received!"
- ✅ Auto-refresh orders list

---

## 🚀 How to Test

### Step 1: Start the Server
```bash
npm run dev
```

### Step 2: Access Admin Dashboard
1. Open browser: `http://localhost:3000/admin`
2. You'll see the login screen
3. Enter password: `admin-token-123`
4. Click "Login"

### Step 3: View Orders
After logging in, you should see:
- **Statistics Dashboard:**
  - Total Orders
  - Pending Orders  
  - COD Orders
- **Orders Table** with existing orders
- **Live indicator** (green pulsing dot)

### Step 4: Test Real-Time Notification

**Option A: Place Order via Storefront**
1. Open new tab: `http://localhost:3000/products`
2. Add items to cart
3. Complete checkout with COD
4. Switch back to admin dashboard
5. You should see:
   - ✅ Toast: "🧾 New COD order received!"
   - ✅ Orders table automatically refreshes
   - ✅ New order appears at the top
   - ✅ Statistics update

**Option B: Place Order via API (for quick testing)**
```bash
curl -X POST http://localhost:3000/api/checkout/cod \
  -H "Content-Type: application/json" \
  -d '{
    "items":[{
      "productId":"cc57ffaf-463f-4e4a-8d0f-33114ce53e2d",
      "variantId":"912d6d76-386c-4bbb-a18a-cfb7873c9094",
      "qty":2
    }],
    "customer":{
      "name":"Test Customer",
      "email":"test@example.com",
      "address":"123 Test St",
      "phone":"5551234567"
    }
  }'
```

Watch the admin dashboard for instant updates!

### Step 5: Test Status Updates

The admin dashboard has **Quick Actions** buttons that change based on order status:

1. **Pending Order** → Shows "✓ Confirm" button
   - Click to change status to "confirmed"
   
2. **Confirmed Order** → Shows "📦 Ship" button
   - Click to change status to "shipped"
   
3. **Shipped Order** → Shows "✓ Deliver" button
   - Click to change status to "delivered"
   
4. **Delivered Order** → Shows "Complete" (no action)

**Watch for:**
- ✅ Button disabled while updating
- ✅ Toast notification after update
- ✅ Status badge color changes
- ✅ Next action button appears

---

## 🧪 API Testing

### Fetch All Orders
```bash
curl -H "Authorization: Bearer admin-token-123" \
  http://localhost:3000/api/admin/orders
```

**Expected Response:**
```json
{
  "orders": [
    {
      "id": "...",
      "totalCents": 6999,
      "paymentMethod": "COD",
      "status": "pending",
      "createdAt": "2025-10-21T17:15:25.011Z",
      ...
    }
  ]
}
```

### Update Order Status
```bash
curl -X PATCH \
  -H "Authorization: Bearer admin-token-123" \
  -H "Content-Type: application/json" \
  -d '{"status":"confirmed"}' \
  http://localhost:3000/api/admin/orders/ORDER_ID_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "order": { ... },
  "message": "Order status updated to confirmed"
}
```

### Test Authorization
```bash
# Without token (should fail)
curl http://localhost:3000/api/admin/orders

# With wrong token (should fail)
curl -H "Authorization: Bearer wrong-token" \
  http://localhost:3000/api/admin/orders
```

---

## ✅ Acceptance Criteria Verification

| Requirement | Status | Evidence |
|------------|--------|----------|
| **Admin dashboard lists latest orders** | ✅ | Orders fetched from DB, sorted by `createdAt DESC` |
| **Password/token check for MVP** | ✅ | Login screen with `admin-token-123` validation |
| **Display order details** | ✅ | Table shows: ID, Total, Payment Method, Status, Created At |
| **Quick status actions** | ✅ | One-click buttons: Confirm, Ship, Deliver |
| **Real-time new order notification** | ✅ | Toast "🧾 New COD order received!" via Pusher |
| **Auto-refresh orders list** | ✅ | List refreshes when new order received |
| **PATCH endpoint for status** | ✅ | `/api/admin/orders/[id]` with PATCH method |

---

## 🎨 UI Features

### Login Screen
- Clean, centered design
- Password input field
- Submit button
- Helper text showing MVP password

### Dashboard Header
- Title and subtitle
- Live connection indicator (green pulsing dot)
- Logout button

### Statistics Cards
- 📦 Total Orders (Blue)
- ⏳ Pending Orders (Yellow)  
- 💰 COD Orders (Green)
- Auto-update with new orders

### Orders Table
- Responsive design
- Hover effects on rows
- Color-coded status badges:
  - Yellow: Pending
  - Blue: Confirmed
  - Purple: Shipped
  - Green: Delivered
- Contextual action buttons
- Loading states
- Empty state

### Toast Notifications
- Green success toast
- Animated slide-in from right
- Auto-dismiss after 5 seconds
- Checkmark icon

---

## 🔧 Technical Implementation

### Authentication Flow
1. User enters password
2. Compared with `admin-token-123`
3. Stored in `sessionStorage` as `admin_token`
4. Sent as `Authorization: Bearer` header
5. Validated on API routes

### Order Fetching
```typescript
// GET /api/admin/orders
const orders = await prisma.order.findMany({
  orderBy: { createdAt: 'desc' }
})
```

### Status Update
```typescript
// PATCH /api/admin/orders/[id]
await prisma.order.update({
  where: { id },
  data: { status }
})
```

### Real-Time Events
```typescript
// Frontend: Subscribe to channel
const channel = pusherClient.subscribe('admin-orders')

// Frontend: Listen for events
channel.bind('new-order', (data) => {
  setToast('🧾 New COD order received!')
  fetchOrders() // Refresh list
})

// Backend: Broadcast event
await pusherServer.trigger('admin-orders', 'new-order', {
  id, totalCents, paymentMethod, ...
})
```

---

## 🐛 Troubleshooting

### Orders Not Loading
- ✅ Check server is running (`npm run dev`)
- ✅ Verify logged in with correct password
- ✅ Check browser console for errors
- ✅ Try clicking "🔄 Refresh" button

### Status Update Fails
- ✅ Check auth token in sessionStorage
- ✅ Verify order ID exists
- ✅ Check server logs for errors

### Real-Time Not Working
- ✅ Verify Pusher credentials in `.env` (optional for MVP)
- ✅ Check "Live" indicator is showing
- ✅ Open browser console to see connection logs
- ✅ Note: App works without Pusher, but no real-time updates

### Can't Login
- ✅ Password must be exactly: `admin-token-123`
- ✅ Check for typos
- ✅ Try refreshing the page

---

## 📊 Test Results

### ✅ Manual Testing Completed
- [x] Login with correct password
- [x] Login with wrong password (rejected)
- [x] View orders list
- [x] Place new COD order
- [x] See real-time toast notification
- [x] Orders list auto-refreshes
- [x] Update order status: pending → confirmed
- [x] Update order status: confirmed → shipped
- [x] Update order status: shipped → delivered
- [x] Logout functionality
- [x] Session persistence across page reloads
- [x] Statistics update correctly

### ✅ API Testing Completed
- [x] GET /api/admin/orders (with auth)
- [x] GET /api/admin/orders (without auth - 401)
- [x] PATCH /api/admin/orders/[id] (status update)
- [x] PATCH /api/admin/orders/[id] (invalid status - 400)
- [x] PATCH /api/admin/orders/invalid-id (404)

### ✅ Real-Time Testing Completed
- [x] New order triggers Pusher event
- [x] Admin dashboard receives event
- [x] Toast notification appears
- [x] Orders list refreshes automatically
- [x] Statistics update in real-time

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] Replace `admin-token-123` with secure password/JWT
- [ ] Add rate limiting to admin endpoints
- [ ] Implement proper user roles (admin, staff, etc.)
- [ ] Add audit logs for status changes
- [ ] Set up Pusher with production credentials
- [ ] Add HTTPS for secure token transmission
- [ ] Implement CSRF protection
- [ ] Add email notifications for order updates
- [ ] Create admin user management system
- [ ] Add order filtering and search
- [ ] Implement pagination for large order lists

---

## 🎉 Success!

All acceptance criteria met:
✅ Admin dashboard lists latest orders
✅ Real-time toast notification on new COD orders  
✅ One-click order status updates
✅ Password-protected MVP authentication
✅ Complete API endpoints with proper auth
✅ Professional UI with live indicators

