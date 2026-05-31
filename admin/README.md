# 🍔 The Hungry Hub - Admin Panel

Admin panel for managing The Hungry Hub food delivery platform.

## 🚀 Features

- **Dashboard** - Overview of orders, revenue, and users
- **Orders Management** - View and manage customer orders
- **Menu Management** - Add, edit, and delete menu items
- **User Management** - Manage customer accounts
- **Real-time Updates** - Live order notifications

## 📦 Installation

```bash
cd admin
npm install
```

## 🏃 Run Development Server

```bash
npm run dev
```

Admin panel will run on: **http://localhost:5174**

## 🔐 Demo Login Credentials

- **Email:** admin@hungry.com
- **Password:** admin123

## 🛠️ Tech Stack

- React 19
- React Router DOM
- Axios
- React Hot Toast
- Vite

## 📁 Project Structure

```
admin/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Orders.jsx
│   │   ├── MenuManagement.jsx
│   │   └── Login.jsx
│   ├── styles/
│   │   ├── sidebar.css
│   │   ├── navbar.css
│   │   ├── dashboard.css
│   │   ├── orders.css
│   │   ├── menu-management.css
│   │   └── login.css
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## 🌐 API Integration

Update API base URL in your axios configuration to connect with backend:

```javascript
const API_URL = "http://localhost:5000/api";
```

## 📝 Notes

- Admin panel runs on port **5174**
- Customer app runs on port **5173**
- Backend API runs on port **5000**
- All three can run simultaneously

## 🔒 Security

- Protected routes with authentication
- Token-based authentication
- Admin-only access

---

Made with ❤️ for The Hungry Hub
