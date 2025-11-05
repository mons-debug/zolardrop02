# Pusher Configuration Guide

## Setup Instructions

### 1. Create a Pusher Account
1. Go to https://pusher.com/
2. Sign up for a free account
3. Create a new app/channel

### 2. Get Your Credentials
From your Pusher dashboard, copy:
- App ID
- Key
- Secret
- Cluster (e.g., us2, eu, ap1)

### 3. Update Environment Variables

Create or update your `.env` file with:

```env
DATABASE_URL="file:./dev.db"
ADMIN_TOKEN="admin-token-123"

# Pusher Configuration
PUSHER_APP_ID="your-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="your-cluster"
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-cluster"
```

**Important:** Replace the placeholder values with your actual Pusher credentials.

### 4. Testing Without Pusher (Development)

If you don't have Pusher credentials yet, the COD endpoint will still work! The Pusher broadcasting is wrapped in a try-catch block, so:
- ✅ Orders will be created successfully
- ✅ Stock will be updated
- ⚠️ Real-time notifications won't work until Pusher is configured

## How It Works

### Backend (COD Endpoint)
When a new order is placed:
1. Order is created in the database
2. Stock is decremented
3. Pusher event is triggered on channel `admin-orders` with event name `new-order`
4. Event payload includes: `{ id, totalCents, paymentMethod, customer, createdAt, itemCount }`

### Frontend (Admin Dashboard)
The admin dashboard at `/admin`:
1. Subscribes to the `admin-orders` channel
2. Listens for `new-order` events
3. Shows a toast notification: "New COD order received"
4. Adds the order to the real-time orders table
5. Updates statistics automatically

## Testing the Real-Time Feature

### Option 1: With Pusher Configured
1. Open the admin dashboard: http://localhost:3000/admin
2. Place a test order through the storefront
3. You should see:
   - Green toast notification appear
   - New order added to the table
   - Statistics updated in real-time

### Option 2: Without Pusher (Testing Endpoint Only)
```bash
curl -X POST http://localhost:3000/api/checkout/cod \
  -H "Content-Type: application/json" \
  -d '{
    "items":[{
      "productId":"9c4e0bc2-382a-45e9-8f3e-d2138a47edf6",
      "variantId":"cc284000-5f92-423e-a023-e8fc6df519fb",
      "qty":1
    }],
    "customer":{
      "name":"Test User",
      "email":"test@example.com",
      "address":"123 Test St",
      "phone":"1234567890"
    }
  }'
```

The order will be created, but the admin dashboard won't receive real-time updates.

## Features

### Admin Dashboard Features
- ✅ Real-time order notifications with toast alerts
- ✅ Live order table updates
- ✅ Statistics dashboard (Total Orders, Pending, Revenue)
- ✅ Live connection indicator
- ✅ Animated toast notifications
- ✅ Order details (ID, Customer, Items, Total, Payment Method, Date)
- ✅ Action buttons (View, Process)

### COD Endpoint Features
- ✅ Stock validation
- ✅ Customer information validation
- ✅ Order creation with status "pending"
- ✅ Stock decrement
- ✅ Real-time broadcasting via Pusher
- ✅ Graceful error handling (Pusher failures don't break order creation)

## Troubleshooting

### Orders Not Appearing in Real-Time
1. Check that Pusher credentials are correct in `.env`
2. Verify the channel name is `admin-orders`
3. Check browser console for Pusher connection errors
4. Ensure both `PUSHER_KEY` (server) and `NEXT_PUBLIC_PUSHER_KEY` (client) are set

### Pusher Connection Errors
- Make sure the cluster matches your Pusher app settings
- Check that the key is copied correctly (no extra spaces)
- Verify your Pusher app is active

### Orders Create But No Broadcast
- This is expected if Pusher is not configured
- Check server logs for "Failed to broadcast order to Pusher" messages
- Orders will still be created successfully

## Alternative: Free Pusher Account Limits
- Free tier includes: 200k messages/day, 100 concurrent connections
- Perfect for development and small-scale production
- Upgrade if you need more capacity

