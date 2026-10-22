import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart!");
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group">
      {/* Product Image */}
      <Link to={`/product/${product._id}`}>
        <div className="h-52 overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300?text=No+Image";
            }}
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Category Badge */}
        <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
          {product.category}
        </span>

        {/* Product Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="mt-2 font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm text-gray-500">{product.ratings} ({product.numReviews} reviews)</span>
        </div>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              product.stock === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <ShoppingCart size={16} />
            {product.stock === 0 ? "Out of Stock" : "Add"}
          </button>
        </div>

        {/* Stock indicator */}
        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs text-orange-500 mt-1">Only {product.stock} left!</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

