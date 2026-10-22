import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartItem, removeFromCart } from "../store/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (productId, newQty) => {
    if (newQty < 1) return;
    dispatch(updateCartItem({ productId, quantity: newQty }));
  };

  const handleRemove = (productId, name) => {
    dispatch(removeFromCart(productId));
    toast.success(`${name} removed from cart`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to get started!</p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart ({items.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = item.product || {};
            const productId = product._id || item._id;
            const productName = product.name || "Item";
            const productPrice = product.price || 0;

            return (
              <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4">
                {/* Product Image */}
                <img
                  src={product.image}
                  alt={productName}
                  className="w-20 h-20 object-cover rounded-xl bg-gray-50"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/80"; }}
                />

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{productName}</h3>
                  <p className="text-blue-600 font-bold mt-1">
                    ₹{productPrice.toLocaleString("en-IN")}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => handleQuantityChange(productId, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(productId, item.quantity + 1)}
                      disabled={product.stock && item.quantity >= product.stock}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Item Total + Remove */}
                <div className="flex flex-col items-end justify-between">
                  <span className="font-bold text-gray-800">
                    ₹{(productPrice * item.quantity).toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => handleRemove(productId, productName)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-20">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span className="text-xl">₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/"
              className="block text-center text-sm text-gray-500 hover:text-blue-600 mt-3 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

