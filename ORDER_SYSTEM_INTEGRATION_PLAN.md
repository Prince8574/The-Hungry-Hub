# Order System Integration Plan

## Current Status:
✅ Backend routes complete (`/api/orders`)
✅ Order model complete
✅ Client Orders page exists (using localStorage)
✅ Admin Orders page exists (using MOCK data)

## What Needs to be Done:

### 1. Client Side - Orders Page
- Replace localStorage with API calls
- Fetch orders from `/api/orders`
- Implement cancel order API call
- Handle authentication (redirect to login if not logged in)

### 2. Admin Side - Orders Page  
- Replace MOCK data with API calls
- Fetch all orders from `/api/orders/all`
- Implement status update functionality
- Real-time order management

### 3. Cart to Order Flow
- When user clicks "Place Order" in Cart page
- Send order data to `/api/orders` POST endpoint
- Clear cart after successful order
- Redirect to Orders page

## Files to Modify:
1. `client/src/pages/Orders.jsx` - Connect to backend API
2. `client/src/pages/Cart.jsx` - Add place order functionality
3. `admin/src/pages/Orders.jsx` - Connect to backend API

## API Endpoints Available:
- GET `/api/orders` - Get user's orders (protected)
- GET `/api/orders/all` - Get all orders (admin only)
- GET `/api/orders/:id` - Get single order
- POST `/api/orders` - Place new order
- PUT `/api/orders/:id/cancel` - Cancel order
- PUT `/api/orders/:id/status` - Update status (admin only)
