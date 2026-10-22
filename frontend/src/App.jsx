import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import store from "./store";
import { fetchCurrentUser } from "./store/authSlice";
import { fetchCart } from "./store/cartSlice";

// Components
import Navbar from "./components/Navbar";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import ProductDetail from "./pages/ProductDetail";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageProducts from "./pages/admin/ManageProducts";

// App initializer — localStorage mein token hai toh user fetch karo
const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      // ✅ Pehle user fetch karo, phir cart (chained)
      dispatch(fetchCurrentUser()).then((result) => {
        if (fetchCurrentUser.fulfilled.match(result)) {
          dispatch(fetchCart());
        }
      });
    }
  }, []); // ✅ Empty deps — sirf mount par ek baar run karo

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />

        {/* Protected Routes */}
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><ManageProducts /></AdminRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-6xl font-bold text-gray-300">404</h1>
            <p className="text-gray-500 mt-2">Page not found</p>
          </div>
        } />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppInitializer>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: "12px", fontSize: "14px" },
            }}
          />
        </AppInitializer>
      </Router>
    </Provider>
  );
}

export default App;
