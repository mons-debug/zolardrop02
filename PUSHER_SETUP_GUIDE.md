# Pusher Real-Time Notifications Setup Guide

This guide explains how to set up Pusher for real-time order notifications in the ZOLAR admin dashboard.

## What is Pusher?

Pusher Channels is a hosted service that makes it easy to add real-time functionality to your application. For ZOLAR, we use it to:
- Instantly notify admins when a new order is placed
- Alert admins when product stock is low
- Auto-refresh the dashboard without manual page reload
- Play a notification sound for new orders

## Step 1: Create a Pusher Account

1. Go to [https://pusher.com](https://pusher.com)
2. Click "Sign Up" (it's free to start)
3. Create your account with email/password or use GitHub/Google

## Step 2: Create a Channels App

1. After logging in, click "Create app" or go to the Channels section
2. Configure your app:
   - **App name**: `zolar-notifications` (or any name you prefer)
   - **Cluster**: Choose the closest to your users (e.g., `us2` for US, `eu` for Europe)
   - **Frontend tech**: Select "React"
   - **Backend tech**: Select "Node.js"
3. Click "Create app"

## Step 3: Get Your Credentials

After creating the app, you'll see the "App Keys" tab. You need these credentials:

```
App ID: 1234567
Key: abc123def456ghi789
Secret: xyz789abc123def456
Cluster: us2
```

## Step 4: Add Environment Variables to Vercel

### Via Vercel Dashboard:

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your ZOLAR project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables (one by one):

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `PUSHER_APP_ID` | Your App ID (e.g., 1234567) | Production, Preview, Development |
| `PUSHER_KEY` | Your Key | Production, Preview, Development |
| `PUSHER_SECRET` | Your Secret | Production, Preview, Development |
| `PUSHER_CLUSTER` | Your Cluster (e.g., us2) | Production, Preview, Development |
| `NEXT_PUBLIC_PUSHER_KEY` | Your Key (same as PUSHER_KEY) | Production, Preview, Development |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | Your Cluster (same as PUSHER_CLUSTER) | Production, Preview, Development |

**Important Notes:**
- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for Pusher public key)
- Non-prefixed variables are server-side only
- Make sure to add them to all environments (Production, Preview, Development)

5. After adding all variables, **redeploy your application**:
   - Go to **Deployments** tab
   - Click the three dots (...) on the latest deployment
   - Click **Redeploy**
   - Check "Use existing Build Cache" if available
   - Click **Redeploy**

### Via Vercel CLI (Alternative):

```bash
vercel env add PUSHER_APP_ID
# Enter your App ID when prompted

vercel env add PUSHER_KEY
# Enter your Key when prompted

vercel env add PUSHER_SECRET
# Enter your Secret when prompted

vercel env add PUSHER_CLUSTER
# Enter your Cluster when prompted

vercel env add NEXT_PUBLIC_PUSHER_KEY
# Enter your Key when prompted

vercel env add NEXT_PUBLIC_PUSHER_CLUSTER
# Enter your Cluster when prompted
```

Then redeploy:
```bash
vercel --prod
```

## Step 5: Set Up Local Development (Optional)

To test locally, create a `.env.local` file in your project root:

```bash
# .env.local
PUSHER_APP_ID="your-app-id"
PUSHER_KEY="your-key"
PUSHER_SECRET="your-secret"
PUSHER_CLUSTER="your-cluster"
NEXT_PUBLIC_PUSHER_KEY="your-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-cluster"
```

**Note:** `.env.local` is already in `.gitignore` - never commit this file!

Then restart your development server:
```bash
npm run dev
```

## Step 6: Verify It's Working

### In Pusher Dashboard:

1. Go to your Pusher app dashboard
2. Click on "Debug Console" in the left sidebar
3. Keep this tab open

### Test the Flow:

1. Log into your ZOLAR admin dashboard at `/admin`
2. Check the browser console (F12) for these logs:
   ```
   ✅ Pusher client initializing with key: abc123def4...
   📍 Pusher cluster: us2
   🔄 Pusher: Connecting...
   ✅ Pusher: Connected!
   🆔 Socket ID: 12345.67890
   📡 Subscribing to Pusher channel: admin-orders
   ✅ Successfully subscribed to admin-orders channel
   ```

3. Place a test order on your website
4. You should see in the admin dashboard:
   - 🎉 A notification badge appears on the bell icon (red circle with count)
   - 🔊 A "cha-ching" sound plays (after enabling sound)
   - 📊 Dashboard stats refresh automatically
   - 📝 New order appears in the "Recent Orders" table
   - 🔔 Notification appears in the dropdown panel

5. In the Pusher Debug Console, you should see:
   ```
   admin-orders new-order
   ```

## Troubleshooting

### "Connection unavailable" in notification panel

**Cause:** Pusher environment variables are not set correctly.

**Solution:**
1. Double-check all 6 environment variables in Vercel
2. Make sure there are no extra spaces in the values
3. Redeploy your application after adding/updating variables

### No console logs about Pusher

**Cause:** Browser cached an old version without Pusher.

**Solution:**
1. Hard refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+F5 on Windows)
2. Clear browser cache
3. Try incognito/private browsing mode

### "pusherServer.trigger is not a function"

**Cause:** Server-side Pusher credentials are missing.

**Solution:**
1. Verify `PUSHER_APP_ID`, `PUSHER_KEY`, and `PUSHER_SECRET` are set in Vercel
2. Redeploy the application

### Sound doesn't play

**Cause:** Browser autoplay policy requires user interaction.

**Solution:**
1. Click the "Enable Sound" button in the orange banner that appears
2. Or click "Enable Sound" in the notification dropdown footer

### Orders trigger but don't show in notification

**Cause:** Notification panel is working, but might need to click the bell.

**Solution:**
1. Click the bell icon in the top right of the admin dashboard
2. Check the notification dropdown for new orders

## Testing in Pusher Dashboard

You can manually trigger events to test without placing real orders:

1. Go to Pusher Dashboard → Your App → Debug Console
2. Click "Event Creator"
3. Fill in:
   - **Channel**: `admin-orders`
   - **Event**: `new-order`
   - **Data**:
   ```json
   {
     "id": "test-order-123",
     "totalCents": 50000,
     "customer": {
       "name": "Test Customer",
       "phone": "0612345678",
       "city": "Casablanca"
     }
   }
   ```
4. Click "Send Event"
5. You should see the notification appear in the admin dashboard immediately!

## Cost & Limits

Pusher free tier includes:
- **200,000 messages per day**
- **100 concurrent connections**
- **Unlimited channels**

For ZOLAR's typical usage (a few orders per day), the free tier is more than sufficient.

## Security Notes

- ✅ `PUSHER_SECRET` is server-side only (never exposed to browser)
- ✅ `NEXT_PUBLIC_PUSHER_KEY` is safe to expose (it's a public key)
- ✅ Channel `admin-orders` is public but only receives events from your backend
- ⚠️ For production at scale, consider enabling authentication for private channels

## Support

If you encounter issues:
1. Check Pusher's status page: [https://status.pusher.com](https://status.pusher.com)
2. Review Pusher docs: [https://pusher.com/docs/channels](https://pusher.com/docs/channels)
3. Check browser console for detailed error messages
4. Verify all environment variables are set correctly in Vercel

## Summary Checklist

- [ ] Created Pusher account
- [ ] Created Channels app
- [ ] Got all 6 credentials (App ID, Key, Secret, Cluster)
- [ ] Added all 6 environment variables to Vercel
- [ ] Redeployed the application
- [ ] Verified connection in browser console
- [ ] Tested with a real order
- [ ] Enabled notification sound
- [ ] Confirmed notifications appear and auto-refresh works

Once all items are checked, your real-time notifications are fully set up! 🎉

