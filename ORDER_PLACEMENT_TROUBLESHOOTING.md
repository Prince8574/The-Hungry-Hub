# Order Placement Logout Issue - Troubleshooting

## Problem:
User logout ho raha hai jab "Place Order" button click karte hain.

## Possible Causes:

### 1. Token Expired or Invalid
**Symptoms**: 401 error, automatic logout
**Solution**: 
- Check browser console for error messages
- Look for "Session expired" message
- Re-login and try again

### 2. Cart Items Missing IDs
**Symptoms**: 400 error, "Invalid order data"
**Solution**:
- Clear cart completely
- Add fresh items from menu
- Ensure items have `_id` field

### 3. Backend Server Not Running
**Symptoms**: Network error, "Failed to place order"
**Solution**:
- Check if server is running on port 5000
- Restart server: `cd server && npm start`

## Debugging Steps:

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try placing order
4. Look for these logs:
   - "Placing order with data:" - Shows order data being sent
   - "Using token:" - Shows if token exists
   - "Error placing order:" - Shows error details

### Step 2: Check Network Tab
1. Open DevTools → Network tab
2. Try placing order
3. Look for POST request to `/api/orders`
4. Check:
   - Status code (should be 201 for success)
   - Response body (shows error message if failed)
   - Request headers (should have Authorization: Bearer token)

### Step 3: Check LocalStorage
1. Open DevTools → Application tab
2. Go to Local Storage → http://localhost:5173
3. Check if `token` exists
4. If missing or looks wrong, re-login

### Step 4: Verify Cart Items
1. Open DevTools → Console
2. Type: `JSON.parse(localStorage.getItem('cart'))`
3. Check if items have `_id` or `id` field
4. If missing, clear cart and add fresh items

## Common Error Messages:

### "Session expired. Please login again"
**Cause**: Token expired or invalid
**Fix**: Login again

### "Some items in cart are invalid"
**Cause**: Cart items missing IDs
**Fix**: Clear cart, add fresh items from menu

### "One or more menu items not found"
**Cause**: Menu item IDs don't exist in database
**Fix**: Clear cart, add fresh items

### "Delivery address line is required"
**Cause**: Address not properly filled
**Fix**: Fill complete address in checkout

## Testing Checklist:

✅ Server running on port 5000
✅ User logged in (token in localStorage)
✅ Cart has items with valid IDs
✅ Items added from current menu (not old cached items)
✅ Delivery address filled completely
✅ Payment method selected

## Quick Fix:

If still having issues, try this complete reset:

```javascript
// In browser console:
localStorage.clear();
location.reload();
```

Then:
1. Login again
2. Add items to cart from menu
3. Try placing order

## Enhanced Error Handling:

The code now includes:
- ✅ Better error messages
- ✅ Console logging for debugging
- ✅ Cart item validation
- ✅ Token validation
- ✅ Specific error handling for 401, 400 errors

## What to Check in Console:

When you click "Place Order", you should see:
```
Placing order with data: {items: [...], deliveryAddress: {...}, ...}
Using token: Token exists
Order placed successfully: {order: {...}}
```

If you see error, it will show:
```
Error placing order: Error: Request failed with status code 401
Error response: {message: "..."}
```

This will help identify the exact issue!
