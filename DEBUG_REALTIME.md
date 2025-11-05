# 🔍 Real-Time Debug Guide

## Quick Diagnosis

### Check 1: Is Pusher Connected?

Open browser console (F12) and look for:
```
✅ "Pusher : State changed : connecting -> connected"
✅ "Subscribed to admin-orders"
```

If you see these, Pusher is working!

### Check 2: Is Order Being Created?

When you place an order, check server logs for:
```
✅ "New order received: { customer: { name:... } }"
✅ No "Failed to broadcast order to Pusher" error
```

### Check 3: Browser Console Checklist

Open `/admin` in browser, press F12, and check console:

**Should see:**
- ✅ "🔔 New order received: {data}"
- ✅ "📱 New order event received - refreshing dashboard"
- ✅ Pusher connection logs

**Should NOT see:**
- ❌ "Pusher connection failed"
- ❌ "Failed to broadcast"
- ❌ Any React errors

---

## Manual Test Commands

### Test 1: Check Pusher Keys in Browser
```javascript
// In browser console on /admin page:
console.log('Pusher Key:', process.env.NEXT_PUBLIC_PUSHER_KEY)
console.log('Cluster:', process.env.NEXT_PUBLIC_PUSHER_CLUSTER)
```

Should show:
- Key: "6ad17cdcfd001730d358"
- Cluster: "eu"

### Test 2: Check if Audio Works
```javascript
// In browser console:
const audio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=')
audio.volume = 0.5
audio.play()
```

Should hear a beep!

### Test 3: Manually Trigger Notification
```javascript
// In browser console on /admin:
window.dispatchEvent(new CustomEvent('new-order-event', { 
  detail: { totalCents: 5000, customer: { name: 'Test' } }
}))
```

Should see:
- Toast notification appears
- Dashboard refreshes

---

## Common Fixes

### Fix 1: Sound Not Playing
**Reason:** Browser blocks autoplay until user interacts with page

**Solution:** Click anywhere on the page first, then place order

### Fix 2: Notifications Not Appearing
**Reason:** Multiple Pusher subscriptions conflicting

**Solution:** Refresh page (Cmd+Shift+R) to clear state

### Fix 3: Real-Time Not Working
**Reason:** Environment variables not loaded

**Solution:** Restart dev server:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Fix 4: Orders Only Show After Refresh
**Reason:** Event listener not properly attached

**Solution:** Hard refresh browser (Cmd+Shift+R)

---

## Step-by-Step Test

1. **Open Admin Dashboard:**
   - Go to http://localhost:3000/admin
   - Open browser console (F12)
   - Click anywhere on page (enables audio)

2. **Check Console for Pusher:**
   - Look for "Pusher : State changed : connecting -> connected"
   - Should see "Subscribed to admin-orders"

3. **Place Order:**
   - Open storefront in another tab
   - Add product, go to checkout
   - Fill form and submit

4. **Watch Admin Dashboard:**
   - Should see in console: "🔔 New order received"
   - Should hear beep/sound
   - Should see green toast
   - Should see red badge on bell
   - Orders should appear WITHOUT refresh

---

## If Still Not Working

Try these in order:

### Step 1: Restart Dev Server
```bash
# Stop: Ctrl+C
# Start:
npm run dev
```

### Step 2: Hard Refresh Browser
```
Cmd+Shift+R (Mac)
Ctrl+Shift+R (Windows)
```

### Step 3: Clear Browser Storage
```
F12 → Application → Storage → Clear site data
```

### Step 4: Check .env File
```bash
cat .env | grep PUSHER
```

Should show all 6 Pusher variables.

---

## Success Indicators

✅ **Sound plays** when order arrives  
✅ **Green toast** appears top-right  
✅ **Red badge** on bell icon  
✅ **Orders appear** without refresh  
✅ **Bell dropdown** shows notification  

---

## Still Having Issues?

Share this info:
1. What you see in browser console
2. Any error messages
3. Does toast notification appear?
4. Does page refresh show the order?


