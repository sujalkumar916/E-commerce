import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";
import { ShoppingCart, Package, LayoutDashboard, LogOut, LogIn, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Package className="text-blue-600" size={28} />
            <span className="text-xl font-bold text-blue-600">ShopMERN</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Cart Icon with badge */}
                <Link
                  to="/cart"
                  className="relative flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ShoppingCart size={22} />
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </Link>

                {/* My Orders */}
                <Link
                  to="/orders"
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  <Package size={18} />
                  <span className="hidden sm:block">Orders</span>
                </Link>

                {/* Admin Dashboard (sirf admin ke liye) */}
                {user?.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors text-sm font-medium"
                  >
                    <LayoutDashboard size={18} />
                    <span className="hidden sm:block">Admin</span>
                  </Link>
                )}

                {/* User name + Logout */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 font-medium hidden sm:block">
                    Hi, {user?.name?.split(" ")[0]}!
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:block">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  <LogIn size={18} />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <UserPlus size={16} />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

