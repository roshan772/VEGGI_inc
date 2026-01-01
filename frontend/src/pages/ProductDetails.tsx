import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetails } from "../services/ProductService";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Loader2,
  Star,
  Package,
  Leaf,
  MapPin,
  User,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext"; // Import useCart

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  ratings: number;
  images: { image: string }[]; // Fixed: Array of objects per model
  category?: string;
  unitType: "kg" | "g" | "piece" | "bunch";
  stock: number;
  freshness: string;
  origin: string;
  seller: string;
  numOfReviews: number;
  reviews: {
    user?: string;
    rating: number;
    comment: string;
  }[];
  createdAt?: Date;
}

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();
  const { addToCart } = useCart(); // Get addToCart from context

  const fetchProduct = async () => {
    if (!id) {
      setError("Invalid product ID");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getProductDetails(id);
      setProduct(response?.product ?? null);
      console.log("Product Details Response:", response); // Debug: Remove after verifying
    } catch (err: any) {
      console.error("Failed to fetch product:", err);
      setError(
        err?.response?.data?.message || "Failed to load product details"
      );
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product._id,
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.image || "/assets/placeholder.png", // Fixed: Access .image
      quantity: 1,
      stock: 0
    });
    // Optional: Add toast: "Added to cart!"
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-2 text-green-600"
        >
          <Loader2 className="w-6 h-6" />
          <span>Loading details...</span>
        </motion.div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Product not found"}</p>
          <button
            onClick={fetchProduct}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
          <button
            onClick={() => nav("/products")}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => nav("/products")}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-green-600 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Products
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-8 items-start"
        >
          {/* Image Gallery */}
          <div className="space-y-4">
            <img
              src={
                product.images?.[0]?.image
                  ? `http://localhost:8000${product.images[0].image}`
                  : "/assets/placeholder.png"
              }
              alt={product.name}
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.slice(1).map((imgObj, idx) => (
                  <img
                    key={idx}
                    src={imgObj.image} // Fixed: .image
                    alt={`${product.name} ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                    onClick={() => {
                      /* TODO: Set as main image */
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header: Name, Ratings, Category */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.ratings)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.ratings} / 5) - {product.numOfReviews} reviews
                </span>
              </div>
              {product.category && (
                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              )}
              <p className="text-3xl font-bold text-green-600 mt-4">
                Rs. {product.price} / {product.unitType}
              </p>
            </div>

            {/* Description */}
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              <p>{product.description || "No description available."}</p>
            </div>

            {/* Quick Info Grid: Stock, Freshness, Origin, Seller */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <Package className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Stock</p>
                  <p className="font-semibold">
                    {product.stock} {product.unitType} available
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <Leaf className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Freshness</p>
                  <p className="font-semibold">{product.freshness}</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <MapPin className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Origin</p>
                  <p className="font-semibold">{product.origin}</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <User className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Seller</p>
                  <p className="font-semibold">{product.seller}</p>
                </div>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => nav("/checkout")}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <ShoppingCart className="w-5 h-5 inline mr-2" />
                Buy Now
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart} // Fixed: Add to cart logic
                className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors" // Blue for cart
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                onClick={() => {
                  /* TODO: Add to wishlist */
                }}
              >
                <Heart className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Reviews ({product.numOfReviews})
            </h2>
            <div className="space-y-4">
              {product.reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl shadow-sm border"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      by {review.user ? "User" : "Anonymous"}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Hidden: Full _id for debugging */}
        <div className="hidden">Product ID: {product._id}</div>
      </div>
    </div>
  );
};
