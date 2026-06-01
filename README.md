# 🍔 The Hungry Hub — Complete Food Ordering Platform

<div align="center">

![The Hungry Hub](https://img.shields.io/badge/The%20Hungry%20Hub-Food%20Ordering-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![Express](https://img.shields.io/badge/Express-Backend-000000?style=for-the-badge&logo=express)

**A modern, full-stack food ordering platform with real-time order management, delivery tracking & email notifications**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Docs](#-api-documentation) • [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)

---

## 🌟 Overview

**The Hungry Hub** is a comprehensive food ordering platform with **4 applications**:

| App | Port | Description |
|-----|------|-------------|
| 🛍️ **Client** | 5173 | Customer-facing food ordering app |
| 👨‍💼 **Admin Panel** | 5175 | Restaurant management dashboard |
| 🚚 **Delivery Panel** | 5176 | Delivery partner portal |
| ⚙️ **Server** | 5000 | REST API backend |

---

## ✨ Features

### 🛍️ Customer App
- Browse menu with category filters & search
- Add to cart with quantity management
- Wishlist functionality (synced with backend)
- 2-step checkout — address + payment
- Multiple payment options (COD, UPI, Cards, Wallets)
- Coupon codes (`HUNGRY10`, `FIRST50`)
- Real-time order tracking with timeline
- Order history & reorder
- OTP-based email verification for registration
- Profile management & address book

### 👨‍💼 Admin Panel
- **Dashboard** — revenue, order stats, analytics
- **Menu Management** — CRUD with image upload, category filter dropdown, discount badges, veg/non-veg indicators
- **Orders** — table view with status dropdown, print package label (PDF)
- **Admin Management** — create/edit/delete admins with role-based access (Admin / Super Admin / Delivery)
- **Email credentials** — auto-send login credentials to new admin's email
- **Settings** — restaurant configuration

### 🚚 Delivery Panel
- Dedicated login for delivery partners
- Dashboard with stats (pending, delivering, today, total)
- Active orders with pick up & deliver actions
- **OTP-based delivery confirmation** — customer gets OTP on email, delivery boy verifies
- Order detail with Google Maps link
- Profile management

### 📧 Email Notifications (All Status Changes)
Customers receive beautiful HTML emails for every order update:
- 🔔 Order Received
- ✅ Order Confirmed
- 👨‍🍳 Being Prepared
- 🚚 Out for Delivery
- 🎉 Order Delivered
- ❌ Order Cancelled

Each email includes:
- Visual progress tracker
- Order items summary
- Delivery address
- Payment info

### 🔐 Authentication & Security
- JWT-based authentication
- OTP email verification for customer registration
- Role-based access control (user / admin / super_admin / delivery)
- Password hashing with bcrypt
- CORS protection

---

## 🛠️ Tech Stack

### Frontend (Client + Admin + Delivery)
- **React 18** — UI library
- **React Router DOM** — routing
- **Vite** — build tool
- **GSAP** — animations
- **Axios** — HTTP client
- **React Hot Toast** — notifications

### Backend
- **Node.js + Express** — server
- **MongoDB + Mongoose** — database
- **JWT** — authentication
- **Bcrypt** — password hashing
- **Nodemailer** — email service (Gmail)
- **Multer + Cloudinary** — image uploads
- **Express Validator** — input validation

---

## 📁 Project Structure

```
The-Hungry-Hub/
├── client/                 # Customer app (port 5173)
│   └── src/
│       ├── components/     # Navbar, auth, home, menu components
│       ├── context/        # CartContext, WishlistContext
│       ├── pages/          # Home, Menu, Cart, Orders, Profile, Wishlist
│       └── styles/
│
├── admin/                  # Admin panel (port 5175)
│   └── src/
│       ├── components/     # Navbar, Sidebar
│       ├── pages/          # Dashboard, Orders, MenuManagement, Admins, AddAdmin, Settings
│       └── styles/
│
├── delivery/               # Delivery panel (port 5176)
│   └── src/
│       ├── components/     # Layout (sidebar)
│       └── pages/          # Login, Dashboard, Orders, OrderDetail, Profile
│
├── server/                 # Backend API (port 5000)
│   ├── middleware/         # auth.js
│   ├── models/             # User, MenuItem, Order, Cart, Wishlist, Address
│   ├── routes/             # auth, menu, orders, cart, wishlist, user, admin, delivery
│   └── utils/              # sendOtp.js, cloudinary.js, orderNotifications.js
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** v16+
- **MongoDB** (Atlas or local)
- **Gmail account** with App Password

### 1. Clone Repository
```bash
git clone https://github.com/Prince8574/The-Hungry-Hub.git
cd The-Hungry-Hub
```

### 2. Server Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

### 3. Client Setup
```bash
cd client
npm install
# Create .env with VITE_API_URL=http://localhost:5000/api
npm run dev
```

### 4. Admin Panel Setup
```bash
cd admin
npm install
npm run dev
```

### 5. Delivery Panel Setup
```bash
cd delivery
npm install
npm run dev
```

### 6. Seed Menu Items
```bash
cd server
node seedMenu.js
```

### 7. Create Super Admin
```bash
node createSuperAdmin.js
```

### 8. Create Delivery Boy
```bash
node createDeliveryBoy.js
```

---

## 🔐 Environment Variables

### Server `.env`
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/TheHungryHub
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5175
```

### Client `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Usage

### Start All Services
```bash
# Terminal 1 — Backend
cd server && npm start

# Terminal 2 — Client
cd client && npm run dev

# Terminal 3 — Admin
cd admin && npm run dev

# Terminal 4 — Delivery
cd delivery && npm run dev
```

### Access URLs
| Service | URL |
|---------|-----|
| Customer App | http://localhost:5173 |
| Admin Panel | http://localhost:5175 |
| Delivery Panel | http://localhost:5176 |
| API | http://localhost:5000 |

### Default Credentials

#### Super Admin
```
Email:    superadmin@hungry.com
Password: super123
```

#### Admin
```
Email:    admin@hungry.com
Password: admin123
```

#### Delivery Boy
```
Email:    delivery@hungry.com
Password: delivery123
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Auth Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/send-otp` | Send OTP to email |
| POST | `/auth/register` | Register with OTP |
| POST | `/auth/login` | Login |
| POST | `/auth/logout` | Logout |

### Menu Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/menu` | Get available items (public) |
| GET | `/menu/all` | Get all items (admin) |
| POST | `/menu` | Create item (admin) |
| PUT | `/menu/:id` | Update item (admin) |
| DELETE | `/menu/:id` | Delete item (admin) |

### Order Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Place order |
| GET | `/orders` | Get user orders |
| GET | `/orders/all` | Get all orders (admin) |
| PUT | `/orders/:id/status` | Update status (admin) |
| PUT | `/orders/:id/cancel` | Cancel order |

### Delivery Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/delivery/login` | Delivery boy login |
| GET | `/delivery/orders` | Get active orders |
| PUT | `/delivery/orders/:id/status` | Update to out_for_delivery |
| POST | `/delivery/orders/:id/send-otp` | Send delivery OTP to customer |
| POST | `/delivery/orders/:id/verify-otp` | Verify OTP & mark delivered |
| GET | `/delivery/stats` | Get delivery stats |

### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/admins` | Get all admins |
| POST | `/admin/admins` | Create admin (sends email) |
| PUT | `/admin/admins/:id` | Update admin |
| DELETE | `/admin/admins/:id` | Delete admin |

---

## 🎯 Key Features Detail

### Delivery OTP Flow
1. Delivery boy picks up order → status: `out_for_delivery`
2. At customer door → clicks "Mark Delivered"
3. OTP sent to customer's email (6-digit, 10 min expiry)
4. Customer shares OTP with delivery boy
5. Delivery boy enters OTP → order marked `delivered`
6. Customer receives delivery confirmation email

### Order Status Flow
```
Pending → Confirmed → Preparing → Out for Delivery → Delivered
                                                    ↘ Cancelled
```

### Coupon System
| Code | Discount |
|------|----------|
| `HUNGRY10` | 10% off |
| `FIRST50` | ₹50 flat off |

### Delivery Fee
- Free delivery on orders above ₹299
- ₹49 delivery fee otherwise

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👥 Author

- **Prince Kumar Singh** — [@Prince8574](https://github.com/Prince8574)

---

## 📞 Support

For support: mrprincekumarsingh143@gmail.com

---

<div align="center">

**Made with ❤️ by Prince Kumar Singh**

⭐ Star this repo if you like it!

</div>
