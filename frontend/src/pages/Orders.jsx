import { useEffect, useState } from "react";
import API from "../api/axios";
import { createSocketConnection } from "../socket";
import { Package, CheckCircle, Truck, Clock, XCircle } from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "text-yellow-600 bg-yellow-50", Icon: Clock },
  processing: { label: "Processing", color: "text-blue-600 bg-blue-50", Icon: Package },
  shipped: { label: "Shipped", color: "text-purple-600 bg-purple-50", Icon: Truck },
  delivered: { label: "Delivered", color: "text-green-600 bg-green-50", Icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-red-600 bg-red-50", Icon: XCircle },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Ek hi socket connection — pehle banao, phir use karo
    const socket = createSocketConnection();

    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders/my-orders");
        setOrders(data.orders);

        // Har order ke room mein join karo (real-time updates ke liye)
        data.orders.forEach((order) => {
          socket.emit("join-order-room", order._id);
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Real-time status update listen karo
    socket.on("order-status-update", ({ orderId, status }) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    });

    // ✅ Cleanup — component unmount par socket disconnect karo
    return () => socket.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Package size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No orders yet</h2>
        <p className="text-gray-500">Your order history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
          const StatusIcon = statusCfg.Icon;

          return (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-mono text-sm text-gray-700">{order._id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Placed on</p>
                  <p className="text-sm text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric", month: "long", day: "numeric"
                    })}
                  </p>
                </div>
                {/* Real-time Status Badge */}
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusCfg.color}`}>
                  <StatusIcon size={15} />
                  {statusCfg.label}
                </span>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-gray-500 text-sm">Total Amount</span>
                <span className="font-bold text-gray-800 text-lg">
                  ₹{order.totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;

