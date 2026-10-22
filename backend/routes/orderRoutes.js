const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);   // ✅ specific route PEHLE
router.get("/:id", protect, getOrderById);           // ✅ dynamic route BAAD MEIN
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;

