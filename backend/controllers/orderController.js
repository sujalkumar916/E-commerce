const Order = require("../models/Order");
const Cart = require("../models/Cart");

// @desc    Place new order
// @route   POST /api/orders
// @access  Protected
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // User ka cart fetch karo
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price image stock"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Total price calculate karo
    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // Order items snapshot banao
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      quantity: item.quantity,
    }));

    // Order create karo
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalPrice,
    });

    // Cart clear karo order place hone ke baad
    cart.items = [];
    await cart.save();

    // Socket.io se admin ko notify karo (real-time)
    const io = req.app.get("io");
    if (io) {
      io.to("admin-room").emit("new-order", {
        orderId: order._id,
        user: req.user.name,
        totalPrice,
        createdAt: order.createdAt,
      });
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my orders
// @route   GET /api/orders/my-orders
// @access  Protected
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name image");

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Protected
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // User sirf apna order dekh sakta hai (Admin sab dekh sakta hai)
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.status(200).json({ success: true, orders, totalRevenue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    if (status === "delivered") {
      order.deliveredAt = new Date();
      order.isPaid = true;
      order.paidAt = new Date();
    }
    await order.save();

    // Socket.io se user ko real-time update bhejo
    const io = req.app.get("io");
    if (io) {
      io.to(`order-${order._id}`).emit("order-status-update", {
        orderId: order._id,
        status: order.status,
      });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to "${status}"`,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};

