// Socket.io ke saare events yahan handle honge
const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 New socket connected: ${socket.id}`);

    // User apne order room mein join kare (real-time tracking ke liye)
    socket.on("join-order-room", (orderId) => {
      socket.join(`order-${orderId}`);
      console.log(`📦 User joined order room: order-${orderId}`);
    });

    // Admin dashboard room join kare
    socket.on("admin-join", () => {
      socket.join("admin-room");
      console.log(`👑 Admin joined admin-room`);
    });

    // Admin kisi order room mein join kare manually
    socket.on("join-room", (room) => {
      socket.join(room);
      console.log(`🏠 Socket ${socket.id} joined room: ${room}`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;

