# Discount Feature - Setup Instructions

## Changes Made:

### 1. Backend Changes:
- ✅ Added `discount` field to MenuItem model (0-100%)
- ✅ Updated POST /api/menu route to accept discount
- ✅ Updated PUT /api/menu/:id route to update discount
- ✅ Updated duplicate route to copy discount

### 2. Frontend Changes:
- ✅ Added discount field in admin form
- ✅ Added discount display in admin menu cards
- ✅ Added discount display in client menu cards
- ✅ Shows: Original Price (strikethrough) + Discounted Price + Discount Badge

## 🚀 IMPORTANT: Server Restart Required!

Since we modified the database model, you need to restart the server:

### Step 1: Stop the server
Press `Ctrl+C` in the terminal where server is running

### Step 2: Restart the server
```bash
cd server
npm start
```

### Step 3: Test the feature
1. Go to admin panel: http://localhost:5175
2. Add a new menu item or edit existing one
3. Fill the "Discount (%)" field (e.g., 20 for 20% off)
4. Save the item
5. Check admin menu page - discount should show
6. Check client menu page - discount should show with calculated price

## Example:
- Original Price: ₹299
- Discount: 20%
- Display: `₹299` `₹239` `20% OFF`
- Calculation: 299 * (1 - 20/100) = 239

## Troubleshooting:

### If discount still not showing:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart both admin and client dev servers
3. Check browser console for errors
4. Verify server is running on port 5000

### If old items don't have discount:
- Old items will have discount: 0 by default
- Edit them and add discount value
- Or they will show without discount badge (which is correct)

## Files Modified:
- server/models/MenuItem.js
- server/routes/menu.js
- admin/src/pages/MenuItemForm.jsx
- admin/src/pages/MenuManagement.jsx
- admin/src/styles/menu-management.css
- admin/src/styles/menu-item-form.css
- client/src/pages/Menu.jsx
- client/src/styles/menu.css
