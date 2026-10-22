import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, clearSelectedProduct } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";
import { ShoppingCart, Star, ArrowLeft, Package } from "lucide-react";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct: product, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart!");
      navigate("/login");
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Package size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700">Product not found</h2>
        <button onClick={() => navigate("/")} className="mt-4 text-blue-600 hover:underline">
          Go back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 text-sm"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="bg-gray-50 rounded-2xl overflow-hidden h-80 md:h-96">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400?text=No+Image";
            }}
          />
        </div>

        {/* Product Info */}
        <div>
          {/* Category */}
          <span className="text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
            {product.category}
          </span>

          {/* Name */}
          <h1 className="text-2xl font-bold text-gray-800 mt-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(product.ratings)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 fill-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.ratings} ({product.numReviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mt-4">
            <span className="text-3xl font-bold text-gray-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

          {/* Stock Status */}
          <div className="mt-4">
            {product.stock === 0 ? (
              <span className="text-red-500 font-medium text-sm">Out of Stock</span>
            ) : product.stock <= 5 ? (
              <span className="text-orange-500 font-medium text-sm">
                Only {product.stock} left in stock!
              </span>
            ) : (
              <span className="text-green-600 font-medium text-sm">
                ✓ In Stock ({product.stock} available)
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors ${
              product.stock === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <ShoppingCart size={20} />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

