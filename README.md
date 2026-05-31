# 🍔 The Hungry Hub - Complete Food Ordering Platform

<div align="center">

![The Hungry Hub](https://img.shields.io/badge/The%20Hungry%20Hub-Food%20Ordering-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![Express](https://img.shields.io/badge/Express-Backend-000000?style=for-the-badge&logo=express)

**A modern, full-stack food ordering platform with real-time order management**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Screenshots](#-screenshots) • [API Documentation](#-api-documentation)

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
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**The Hungry Hub** is a comprehensive food ordering platform that connects customers with restaurants. It features a beautiful client-facing application for browsing and ordering food, and a powerful admin panel for managing menu items, orders, and restaurant operations.

### Key Highlights

- 🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations
- 🛒 **Complete Order Flow** - From cart to delivery tracking
- 👨‍💼 **Admin Dashboard** - Comprehensive restaurant management
- 🔐 **Secure Authentication** - JWT-based auth with OTP verification
- 💳 **Multiple Payment Options** - COD, UPI, Cards, Wallets, Net Banking
- 📱 **Fully Responsive** - Works seamlessly on all devices
- ⚡ **Real-time Updates** - Live order status tracking

---

## ✨ Features

### 🛍️ Customer Features

#### Menu & Ordering
- Browse menu with beautiful card layouts
- Category-wise filtering (Burgers, Pizza, Pasta, Indian, etc.)
- Search functionality
- VEG/NON-VEG indicators
- Discount badges and pricing
- Out of stock indicators
- Add to cart with quantity management
- Wishlist functionality

#### Cart & Checkout
- View cart with item details
- Apply coupon codes (HUNGRY10, FIRST50)
- Automatic delivery fee calculation
- Free delivery on orders above ₹299
- 2-step checkout process:
  1. Delivery address selection/addition
  2. Payment method selection
- Multiple payment options

#### Order Management
- View order history
- Real-time order status tracking
- Order timeline visualization
- Cancel orders (pending/confirmed only)
- Reorder functionality
- Order details modal

#### User Profile
- Update personal information
- Manage delivery addresses
- View order history
- Account settings

### 👨‍💼 Admin Features

#### Dashboard
- Overview statistics
- Revenue tracking
- Order analytics
- Quick actions

#### Menu Management
- **CRUD Operations** - Create, Read, Update, Delete menu items
- **Rich Form** - Comprehensive item details:
  - Name, Description, Price
  - Discount percentage
  - Category selection
  - Image URL
  - VEG/NON-VEG toggle
  - Spicy level (0-3)
  - Preparation time
  - Stock quantity
- **Visual Cards** - Beautiful menu item cards with:
  - VEG/NON-VEG icon
  - Out of stock ribbon
  - Discount display
  - Quick actions (Edit, Delete, Toggle Stock, Toggle Availability)
- **Filters** - Category and stock filters
- **Search** - Search by item name
- **Export** - Export menu as JSON/CSV

#### Order Management
- **Kanban Board** - Visual order workflow:
  - New Orders → Preparing → Ready → Delivered
- **Real-time Updates** - Auto-refresh every 30 seconds
- **Order Details** - Complete order information:
  - Customer details
  - Items ordered
  - Delivery address
  - Payment method
  - Total amount
- **Status Updates** - One-click status changes
- **Search** - Search by order ID or customer name

#### Settings
- Restaurant information
- Operating hours
- Delivery settings
- Payment configuration

### 🔐 Super Admin Features

#### Role-Based Access Control
- **Two Admin Levels**:
  - **Admin** - Menu and order management only
  - **Super Admin** - Full system access
- **Same Login Page** - Role detected automatically
- **Dynamic Menu** - Features shown based on role

#### Admin Management (Super Admin Only)
- **View All Admins** - List of all admin users
- **Create Admins** - Add new admin or super admin users
- **Edit Admins** - Update admin details and roles
- **Delete Admins** - Remove admin users (cannot delete super admins)
- **Statistics** - Total admins, super admins, and users
- **Role Indicator** - Shows user role in sidebar

#### Demo Credentials
- **Super Admin**:
  - Email: `superadmin@hungry.com`
  - Password: `super123`
- **Admin**:
  - Email: `admin@hungry.com`
  - Password: `admin123`

---

## 🛠️ Tech Stack

### Frontend

#### Client Application
- **React 18.3.1** - UI library
- **React Router DOM** - Routing
- **Vite** - Build tool
- **GSAP** - Animations
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

#### Admin Panel
- **React 18.3.1** - UI library
- **React Router DOM** - Routing
- **Vite** - Build tool
- **GSAP** - Animations
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File uploads
- **Cloudinary** - Image hosting
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

---

## 📁 Project Structure

```
The-Hungry-Hub/
├── client/                 # Customer-facing application
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── home/
│   │   │   └── menu/
│   │   ├── context/
│   │   │   ├── CartContext.jsx
│   │   │   └── WishlistContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── admin/                  # Admin panel
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── AuthLeft.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MenuManagement.jsx
│   │   │   ├── MenuItemForm.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Login.jsx
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend API
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   ├── Wishlist.js
│   │   └── Address.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── menu.js
│   │   ├── orders.js
│   │   ├── cart.js
│   │   ├── wishlist.js
│   │   └── user.js
│   ├── utils/
│   │   ├── cloudinary.js
│   │   └── sendOtp.js
│   ├── index.js
│   ├── createAdmin.js
│   └── package.json
│
├── .gitignore
├── README.md
└── Documentation files (.md)
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Clone Repository

```bash
git clone https://github.com/manasvitiwari-08/The-Hungry-Hub.git
cd The-Hungry-Hub
```

### Backend Setup

```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# Start server
npm start
```

Server will run on `http://localhost:5000`

### Client Setup

```bash
cd client
npm install

# Create .env file
cp .env.example .env

# Edit .env with API URL
# Start client
npm run dev
```

Client will run on `http://localhost:5173`

### Admin Panel Setup

```bash
cd admin
npm install

# Start admin panel
npm run dev
```

Admin panel will run on `http://localhost:5175`

### Create Admin User

```bash
cd server
node createAdmin.js
```

Default admin credentials:
- Email: `admin@hungry.com`
- Password: `admin123`

---

## 🔐 Environment Variables

### Server (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/hungry-hub
# or MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hungry-hub

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Email (for OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5175
```

### Client (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

### Admin (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Usage

### Starting All Services

#### Option 1: Manual Start

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Client
cd client
npm run dev

# Terminal 3 - Admin
cd admin
npm run dev
```

#### Option 2: Using Concurrently (if configured)

```bash
npm run dev:all
```

### Access Applications

- **Client**: http://localhost:5173
- **Admin**: http://localhost:5175
- **API**: http://localhost:5000

### Default Credentials

#### Admin
- Email: `admin@hungry.com`
- Password: `admin123`

#### Test User (Register new user or use existing)
- Register at: http://localhost:5173/register

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "otp": "123456"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Send OTP
```http
POST /auth/send-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "name": "John Doe"
}
```

### Menu Endpoints

#### Get All Menu Items (Public)
```http
GET /menu
```

#### Get All Menu Items (Admin)
```http
GET /menu/all
Authorization: Bearer <admin-token>
```

#### Create Menu Item
```http
POST /menu
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Margherita Pizza",
  "description": "Classic pizza with tomato and mozzarella",
  "price": 299,
  "discount": 10,
  "category": "Pizza",
  "image": "https://example.com/image.jpg",
  "isVeg": true,
  "spicyLevel": 0,
  "preparationTime": 20,
  "stock": 50
}
```

#### Update Menu Item
```http
PUT /menu/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "price": 349,
  "discount": 15
}
```

#### Delete Menu Item
```http
DELETE /menu/:id
Authorization: Bearer <admin-token>
```

### Order Endpoints

#### Place Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "menuItemId": "item-id",
      "qty": 2
    }
  ],
  "deliveryAddress": {
    "line": "123 Main St",
    "city": "Mumbai",
    "pincode": "400001"
  },
  "paymentMethod": "cod",
  "couponCode": "HUNGRY10"
}
```

#### Get User Orders
```http
GET /orders
Authorization: Bearer <token>
```

#### Get All Orders (Admin)
```http
GET /orders/all
Authorization: Bearer <admin-token>
```

#### Update Order Status (Admin)
```http
PUT /orders/:id/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "preparing"
}
```

#### Cancel Order
```http
PUT /orders/:id/cancel
Authorization: Bearer <token>
```

### Cart Endpoints

#### Get Cart
```http
GET /cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "menuItemId": "item-id",
  "qty": 1
}
```

#### Update Cart Item
```http
PUT /cart/:itemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "qty": 3
}
```

#### Remove from Cart
```http
DELETE /cart/:itemId
Authorization: Bearer <token>
```

#### Clear Cart
```http
DELETE /cart
Authorization: Bearer <token>
```

### Wishlist Endpoints

#### Get Wishlist
```http
GET /wishlist
Authorization: Bearer <token>
```

#### Add to Wishlist
```http
POST /wishlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "menuItemId": "item-id"
}
```

#### Remove from Wishlist
```http
DELETE /wishlist/:itemId
Authorization: Bearer <token>
```

---

## 📸 Screenshots

### Client Application

#### Home Page
Beautiful landing page with hero section, categories, popular dishes, and testimonials.

#### Menu Page
Browse menu items with filters, search, and category selection.

#### Cart Page
View cart items, apply coupons, and proceed to checkout.

#### Checkout
2-step checkout process with address selection and payment method.

#### Orders Page
View order history with status tracking and timeline.

### Admin Panel

#### Dashboard
Overview of orders, revenue, and quick stats.

#### Menu Management
Manage menu items with CRUD operations and visual cards.

#### Order Management
Kanban board for managing orders from new to delivered.

---

## 🎯 Features in Detail

### Discount System
- Admin can set discount percentage (0-100%)
- Automatic price calculation
- Display original price (strikethrough) + discounted price
- Discount badge on cards

### Order Status Flow
```
Pending → Confirmed → Preparing → Out for Delivery → Delivered
```

### Coupon System
- **HUNGRY10** - 10% discount
- **FIRST50** - ₹50 flat discount

### Delivery Fee
- Free delivery on orders above ₹299
- ₹49 delivery fee for orders below ₹299

### Authentication
- JWT-based authentication
- OTP verification for registration
- Password hashing with bcrypt
- Token expiry: 7 days

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Manasvi Tiwari** - [@manasvitiwari-08](https://github.com/manasvitiwari-08)

---

## 🙏 Acknowledgments

- React team for the amazing library
- MongoDB team for the database
- All open-source contributors

---

## 📞 Support

For support, email manasvi@example.com or open an issue on GitHub.

---

<div align="center">

**Made with ❤️ by Manasvi Tiwari**

⭐ Star this repo if you like it!

</div>
