# 🚀 CRM System - Quick Test Guide

## 5-Minute Test Plan

### ✅ Step 1: View the New Customers Page (1 min)

1. Open your admin dashboard: `http://localhost:3000/admin`
2. Click **"Customers"** in the sidebar (new menu item!)
3. You should see:
   - 8 existing customers (migrated from old orders)
   - Stats cards showing: Total, New, VIP, Premium counts
   - Customer table with names, phones, loyalty badges

**Expected:** Customer list showing all your migrated customers

---

### ✅ Step 2: View Customer Profile (1 min)

1. Click on any customer name
2. You should see:
   - Customer info card (name, phone, city)
   - Loyalty badge (New/Regular/VIP/Premium)
   - Stats: Total orders, total spent, average order
   - Complete order history table
   - Admin notes section

**Expected:** Full customer profile with order history

---

### ✅ Step 3: Place a NEW Order (2 min)

1. Open storefront in new tab: `http://localhost:3000`
2. Add any product to cart
3. Go to checkout
4. Enter:
   - **Name:** Test Customer
   - **Phone:** +1234567890 (use your real number for mobile testing!)
   - **City:** New York
5. Click "Place Order (Cash on Delivery)"

**Expected:**
- ✅ Order confirmation page
- ✅ Green notification in admin dashboard
- ✅ Sound plays
- ✅ New order shows customer name & phone (not just ID!)

---

### ✅ Step 4: Check Customer Info in Orders (30 sec)

1. Go to **Orders** page
2. Find your newest order
3. You should see:
   - **Customer Name** (bold) - "Test Customer"
   - Phone number below name
   - City with 📍 icon
   - Order ID in small gray text
   - **🆕 New** loyalty badge
   - Refund button available

**Expected:** Customer info prominently displayed, not just order ID

---

### ✅ Step 5: Test Customer Loyalty Upgrade (30 sec)

1. Place **2nd order** with **same phone number** (+1234567890)
2. Check Orders page
3. Badge should change from 🆕 **New** → ⭐ **Regular**

**Expected:** Automatic loyalty upgrade on 2nd order!

---

## 🎯 Key Things to Test

### Real-Time Notifications:
- ✅ Notification shows customer name (not just "New order")
- ✅ Shows phone number
- ✅ Shows loyalty badge
- ✅ Sound plays
- ✅ Bell icon has red badge

### Orders Page:
- ✅ Customer name replaces order ID as primary info
- ✅ Phone number visible
- ✅ City shown with 📍 icon
- ✅ Loyalty badge displayed
- ✅ Click customer name → goes to profile
- ✅ Refund button works

### Customers Page:
- ✅ All customers listed
- ✅ Filter by loyalty status works
- ✅ Search by name/phone/city works
- ✅ Stats cards update
- ✅ Click customer → goes to profile

### Customer Profile:
- ✅ Shows complete info
- ✅ Displays loyalty badge
- ✅ Shows all orders in history
- ✅ Can add/edit admin notes
- ✅ Can block/unblock customer

---

## 🔥 Pro Tips for Testing

### Test Loyalty Progression:
1. Create customer with phone: +1111111111
2. Place 1st order → 🆕 New
3. Place 2nd order (same phone) → ⭐ Regular  
4. Place 5th order (same phone) → 💎 VIP
5. Place 10th order (same phone) → 👑 Premium

### Test Customer Search:
1. Go to Customers page
2. Type customer name in search
3. Results filter instantly
4. Try phone number search
5. Try city search

### Test Filters:
1. Click filter dropdown
2. Select "VIP" → shows only VIP customers
3. Select "New" → shows only new customers
4. Select "All" → shows everyone

### Test Admin Notes:
1. Open any customer profile
2. Click "Edit" next to Admin Notes
3. Type notes about customer
4. Click "Save Notes"
5. Notes appear on profile

### Test Refunds:
1. Go to Orders page
2. Find pending or confirmed order
3. Click "💰 Refund" button
4. Status changes to "Refunded"
5. Shows as red badge

---

## ⚠️ Common Issues & Fixes

### Issue: "No customers shown"
**Fix:** Place an order first to create a customer

### Issue: "Customer badge not showing"
**Fix:** Refresh page, badge is based on totalOrders count

### Issue: "Can't see Customers menu"
**Fix:** Restart dev server to load new components

### Issue: "Notification doesn't show customer info"
**Fix:** Pusher credentials must be set in .env (already done!)

### Issue: "Old orders show 'Unknown Customer'"
**Fix:** Normal - they were migrated with generic data. New orders will have real customer info.

---

## 📊 What Success Looks Like

### Orders Page - Before vs After:

**BEFORE:**
```
Order ID: abc12345...
Total: $69.99
Status: Pending
```

**AFTER:**
```
Customer: John Doe
Phone: +1234567890
City: 📍 New York
Order: #abc12345
Badge: 💎 VIP
Total: $69.99  
Status: Pending
Actions: ✓ Confirm | 📦 Ship | 💰 Refund | 👤 Profile
```

---

## ✅ Checklist

Quick checklist to verify everything works:

- [ ] Can access Customers page from sidebar
- [ ] Can see customer stats (Total, New, VIP, Premium)
- [ ] Can click customer to view profile
- [ ] Profile shows order history
- [ ] Can add admin notes to customer
- [ ] Orders page shows customer names (not just IDs)
- [ ] Loyalty badges appear correctly
- [ ] Can refund an order
- [ ] Real-time notification shows customer info
- [ ] Placing 2nd order upgrades loyalty badge
- [ ] Search customers works
- [ ] Filter customers works
- [ ] Can block/unblock customer

---

## 🎉 Next Steps

Once everything works:

1. **Use the CRM daily** to track customers
2. **Add notes** about VIP customers
3. **Monitor loyalty progression**
4. **Identify repeat customers** quickly
5. **Use filters** to find specific customer types
6. **Check customer history** before processing orders

---

## 📱 Mobile Testing (Optional)

If you enabled push notifications:

1. Install PWA on your phone
2. Enable notifications
3. Place order from another device
4. You should receive push notification on phone!
5. Tap notification → opens admin to that order

---

**Your CRM is ready to use! Start tracking customers and building relationships! 🚀**

