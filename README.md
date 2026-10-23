# 🛍️ ShopMERN — Full-Stack E-Commerce Platform

A production-ready, feature-rich Full-Stack E-Commerce web application built with the **MERN Stack** (MongoDB, Express.js, React 19, Node.js), featuring **JWT Authentication**, **Role-Based Access Control (RBAC)**, **Real-Time Order Tracking via Socket.io**, and state management with **Redux Toolkit**.

---

## ✨ Features

- 🔐 **JWT Authentication & RBAC:** Secure token-based auth with HttpOnly cookies + bearer tokens, password hashing with Bcrypt, and strict Admin vs Customer permissions.
- 📦 **Product Catalog & Search:** Live search, category filters, and pagination with responsive product cards.
- 🛒 **Persistent Shopping Cart:** Centralized Redux Toolkit cart with server sync and optimistic updates.
- ⚡ **Real-Time WebSockets (Socket.io):**
  - **Live Order Tracking:** Customers receive instant order status changes (`pending` → `shipped` → `delivered`) without refreshing.
  - **Admin Alerts:** Admin dashboard receives instant live notifications when a new order is placed.
- 👑 **Admin Dashboard:**
  - View real-time sales metrics (Total Revenue, Total Orders, Pending vs Delivered).
  - Update order statuses live.
  - Full Product CRUD (Add, Edit, Delete products with live stock controls).
- 📜 **Historical Snapshot Pattern:** Orders store immutable snapshots of product details and price at time of purchase to ensure audit accuracy.
- 🎨 **Modern Responsive UI:** Built with **React 19**, **Tailwind CSS**, and **Lucide Icons**.

---

## 🏗️ Architecture Overview

```
mern-ecommerce/
├── backend/
│   ├── config/db.js             # MongoDB connection logic
│   ├── controllers/             # Auth, Product, Cart, and Order controllers
│   ├── middleware/              # JWT protect & adminOnly RBAC middleware
│   ├── models/                  # Mongoose Schemas (User, Product, Cart, Order)
│   ├── routes/                  # Modular REST API endpoints
│   ├── socket/                  # Socket.io Rooms & Event Handlers
│   ├── seed.js                  # Sample data & admin seeder
│   └── server.js                # Express & HTTP server entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/axios.js         # Axios client with auto-JWT & 401 handling
│   │   ├── components/          # Navbar, ProductCard, ProtectedRoute
│   │   ├── pages/               # Home, ProductDetail, Cart, Checkout, Orders, Admin
│   │   ├── store/               # Redux Toolkit Slices (auth, cart, products)
│   │   └── hooks/               # useSocket hook
│   └── vite.config.js
│
└── docs/
    └── MERN-Ecommerce-Interview-Architecture-Guide.pdf
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or MongoDB Atlas)
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/sujalkumar916/E-commerce.git
cd E-commerce
```

### 3. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern-ecommerce
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
```

Seed initial sample products and default admin:
```bash
npm run seed
```

Start backend development server:
```bash
npm run dev
```

### 4. Frontend Setup (in a separate terminal)
```bash
cd frontend
npm install
npm run dev
```

Open your browser at **`http://localhost:5173`**.

### 5. Production Deployment

In Vercel, set the frontend environment variable `VITE_API_URL` to the backend origin, for example:

```env
VITE_API_URL=https://your-backend.onrender.com
```

The frontend appends `/api` automatically (and avoids adding it twice if the value already ends in `/api`). If unset, production builds use this project's Render API URL; local development uses Vite's `/api` proxy. Vite embeds this value at build time, so redeploy the frontend after changing it.

---

## 🔑 Default Credentials (After Seeding)

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@example.com` | `adminpassword123` |

---

## 📡 REST API Reference

### Auth
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Login user & issue JWT
- `GET /api/auth/me` — Fetch authenticated user profile
- `POST /api/auth/logout` — Clear session & cookie

### Products
- `GET /api/products` — Search and filter products (Public)
- `GET /api/products/:id` — Get single product details (Public)
- `POST /api/products` — Create new product (Admin Only)
- `PUT /api/products/:id` — Update product details (Admin Only)
- `DELETE /api/products/:id` — Remove product (Admin Only)

### Cart & Orders
- `GET /api/cart` — Get user's cart (Protected)
- `POST /api/cart/add` — Add product to cart (Protected)
- `PUT /api/cart/update` — Update item quantity (Protected)
- `DELETE /api/cart/remove/:productId` — Remove item (Protected)
- `POST /api/orders` — Place new order (Protected)
- `GET /api/orders/my-orders` — User order history (Protected)
- `GET /api/orders` — All orders list (Admin Only)
- `PUT /api/orders/:id/status` — Live status update (Admin Only)

---

## 📄 Architecture Documentation
Detailed architectural deep-dive, system diagrams, and technical interview preparation guide can be found in:
👉 [`docs/MERN-Ecommerce-Interview-Architecture-Guide.pdf`](./docs/MERN-Ecommerce-Interview-Architecture-Guide.pdf)

---

## 👨‍💻 Author
**Sujal Kumar**
- GitHub: [@sujalkumar916](https://github.com/sujalkumar916)
