# 🚀 Quick Start Guide - The Hungry Hub

## Start All Services

### Option 1: Manual Start (Recommended for Development)

Open **3 separate terminals**:

#### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```
✅ Backend running on: **http://localhost:5000**

#### Terminal 2 - Customer App
```bash
cd client
npm run dev
```
✅ Customer app running on: **http://localhost:5173**

#### Terminal 3 - Admin Panel
```bash
cd admin
npm run dev
```
✅ Admin panel running on: **http://localhost:5174**

---

## 🌐 Access URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Customer App** | http://localhost:5173 | Customers order food here |
| **Admin Panel** | http://localhost:5174 | Manage orders, menu, users |
| **Backend API** | http://localhost:5000 | API for both apps |

---

## 🔐 Login Credentials

### Admin Panel Login
- **URL:** http://localhost:5174/login
- **Email:** admin@hungry.com
- **Password:** admin123

### Customer App
- Register new account or use existing credentials

---

## 📊 What Each Service Does

### 🛒 Customer App (Port 5173)
- Browse menu
- Add items to cart
- Add items to wishlist
- Place orders
- View order history
- Manage profile

### 👨‍💼 Admin Panel (Port 5174)
- View dashboard with stats
- Manage orders (accept, complete)
- Add/Edit/Delete menu items
- View customers
- Track revenue

### 🔧 Backend Server (Port 5000)
- Handles all API requests
- Database operations
- Authentication
- File uploads (Cloudinary)

---

## ✅ Verification Checklist

After starting all services, verify:

- [ ] Backend shows "Server running on port 5000"
- [ ] Customer app opens in browser automatically
- [ ] Admin panel opens in browser automatically
- [ ] No errors in any terminal
- [ ] Can access all URLs

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173

# Kill process on port 5174
npx kill-port 5174

# Kill process on port 5000
npx kill-port 5000
```

### Dependencies Not Installed
```bash
# Install backend dependencies
cd server && npm install

# Install client dependencies
cd client && npm install

# Install admin dependencies
cd admin && npm install
```

### Database Connection Error
- Check MongoDB connection string in `server/.env`
- Make sure MongoDB is running

---

## 🎯 Development Workflow

1. **Start backend first** (always needed)
2. **Start customer app** (for testing customer features)
3. **Start admin panel** (for testing admin features)
4. Make changes in code
5. Hot reload will update automatically

---

## 📝 Notes

- All three services can run simultaneously
- Customer and Admin are completely separate
- Both use the same backend API
- Changes in one don't affect the other

---

Happy Coding! 🎉
