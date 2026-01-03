import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react"; // Lucide React for icons; npm i lucide-react
import { motion } from "framer-motion"; // For subtle animations; npm i framer-motion
import { useState } from "react";

export const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
 
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={product.images?.[0]?.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Quick Wishlist Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // TODO: Add to wishlist logic
          }}
        >
          <Heart
            className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors"
            fill="currentColor"
          />
        </motion.button>
        {/* Category Badge */}
        {product.category && (
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="absolute top-3 left-3 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium"
          >
            {product.category}
          </motion.span>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-1">
          {product.description || "Fresh and organic"}
        </p>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-green-600">
            Rs. {product.price}
          </span>
          <Link
            to={`/product/${product._id}`}
            className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 transition-colors duration-200"
          >
            View Details
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Hover Overlay for Subtle Glow */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-t from-green-50/50 to-transparent rounded-2xl pointer-events-none"
        />
      )}
    </motion.div>
  );
};
type OrderCardProps = {
  order: any; // you can replace `any` with a more specific Order type later
};

export const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="font-bold">Order ID: {order?._id ?? "N/A"}</h3>
      <p>
        Placed:{" "}
        {order?.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}
      </p>
      <p>Status: {order?.orderStatus ?? order?.status ?? "—"}</p>
      <p>Total: ₹{order?.totalPrice ?? order?.total ?? "—"}</p>
      <p>Items: {order?.orderItems?.length ?? order?.items?.length ?? 0}</p>
    </div>
  );
};
