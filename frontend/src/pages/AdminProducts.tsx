import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProduct, getAllProducts } from "../services/ProductService"; // Your service
import { Loader2, Edit3, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface IProduct {
  _id: string;
  name: string;
  price: number;
  description: string;
  ratings: number;
  images: { image: string }[];
  category: string;
  unitType: "kg" | "g" | "piece" | "bunch";
  stock: number;
  freshness: string;
  origin: string;
  seller: string;
  numOfReviews: number;
  reviews: {
    user: string; // Simplified to string for frontend
    rating: number;
    comment: string;
  }[];
  user: string; // Simplified to string
  createdAt: Date;
}
export const AdminProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllProducts(1, ""); // Fetch all (page 1, no search)
        setProducts(response.products || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
      // Optional: toast.success("Product deleted");
    } catch (err: any) {
      // toast.error(err.message);
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="flex items-center gap-2 text-green-600"
        >
          <Loader2 className="w-6 h-6" />
          <span>Loading products...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Manage Products ({products.length})
            </h1>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/products/new")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              + Add New Product
            </motion.button>
          </div>

          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No products yet. Add one to get started!
            </p>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 p-4 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        product.images?.[0]?.image || "/assets/placeholder.png"
                      }
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Rs. {product.price} / {product.unitType} •{" "}
                        {product.category}
                      </p>
                      <p className="text-xs text-green-600">
                        Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        navigate(`/admin/products/${product._id}/edit`)
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 size={16} className="inline mr-1" />
                      Edit
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} className="inline mr-1" />
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
