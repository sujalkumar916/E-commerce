import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import { createSocketConnection } from "../../socket";
import { Package, ShoppingBag, Users, DollarSign, Bell, Boxes } from "lucide-react";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchOrders();

    // Admin socket room join karo — connection confirm hone ke baad
    const socket = createSocketConnection();

    socket.on("connect", () => {
      socket.emit("admin-join");
    });

    // New order real-time notification
    socket.on("new-order", (data) => {
      setNotifications((prev) => [data, ...prev].slice(0, 5)); // Sirf 5 recent
      fetchOrders(); // Orders list refresh karo
    });

    // Order status update listen karo
    socket.on("order-status-update", ({ orderId, status }) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    });

    return () => socket.disconnect();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");
      setOrders(data.orders);
      setStats({ total: data.orders.length, revenue: data.totalRevenue });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      // ✅ Optimistic UI update — socket se bhi aayega, but local update instant ho
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <Link
          to="/admin/products"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Boxes size={18} />
          Manage Products
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: stats.total, Icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
          { label: "Total Revenue", value: `₹${stats.revenue?.toLocaleString("en-IN")}`, Icon: DollarSign, color: "bg-green-50 text-green-600" },
          { label: "Pending Orders", value: orders.filter(o => o.status === "pending").length, Icon: Package, color: "bg-yellow-50 text-yellow-600" },
          { label: "Delivered", value: orders.filter(o => o.status === "delivered").length, Icon: Users, color: "bg-purple-50 text-purple-600" },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-800">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Notifications */}
      {notifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Bell size={18} className="text-blue-600" />
            <h3 className="font-semibold text-blue-800">Live Notifications</h3>
          </div>
          {notifications.map((notif, i) => (
            <div key={i} className="text-sm text-blue-700 py-1 border-b border-blue-100 last:border-0">
              🛍️ New order from <strong>{notif.user}</strong> — ₹{notif.totalPrice?.toLocaleString("en-IN")}
            </div>
          ))}
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="font-bold text-gray-800">All Orders</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-4 py-3">Order ID</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Items</th>
                  <th className="text-left px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {order._id.slice(-8)}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">{order.user?.name}</p>
                        <p className="text-gray-400 text-xs">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.items.length} items</td>
                    <td className="px-4 py-3 font-bold text-gray-800">
                      ₹{order.totalPrice?.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

