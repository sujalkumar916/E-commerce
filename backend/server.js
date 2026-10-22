const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// ✅ dotenv SABSE PEHLE — baaki sab .env variables use karte hain
dotenv.config();

const connectDB = require("./config/db");
const socketHandler = require("./socket/socketHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

// MongoDB connect karo
connectDB();

const app = express();
const httpServer = http.createServer(app);

// ─── Socket.io Setup ───────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // React Vite ka default port
    credentials: true,
  },
});

// io instance ko app mein set karo taaki controllers mein use ho sake
app.set("io", io);

// Socket events handle karo
socketHandler(io);

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Cookies allow karne ke liye
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "🚀 MERN E-Commerce API is running!" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ─── Server Start ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io listening on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

