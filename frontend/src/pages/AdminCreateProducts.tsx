import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/ProductService";
import { Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export const CreateProduct = () => {
  const [form, setForm] = useState({
    name: "",
    price: 0,
    description: "",
    category: "Leafy Vegetables",
    unitType: "kg",
    stock: 0,
    freshness: "Fresh",
    origin: "Local Farm",
    seller: "",
  });
  const [images, setImages] = useState<File[]>([]); // Ensure File[]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files) as File[]); // Explicit cast
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.seller || images.length === 0) {
      setError("Please fill required fields and select images");
      return;
    }

    setLoading(true);
    setError(null);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      data.append(key, String(value))
    );
    images.forEach((image) => data.append("images", image)); // Safe: images is File[]

    try {
      await createProduct(data);
      navigate("/admin/products");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/admin/products")}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-green-600 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Products
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6 text-center">
            Add New Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name (e.g., Organic Carrots)"
              value={form.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price (Rs.)"
              value={form.price}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 h-24"
              required
            />
            <select
              name="category"
              value={form.category}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="Leafy Vegetables">Leafy Vegetables</option>
              <option value="Root Vegetables">Root Vegetables</option>
              <option value="Gourds">Gourds</option>
              <option value="Fruits Vegetables">Fruits Vegetables</option>
              <option value="Beans & Peas">Beans & Peas</option>
              <option value="Herbs">Herbs</option>
              <option value="Tubers">Tubers</option>
              <option value="Organic Vegetables">Organic Vegetables</option>
            </select>
            <select
              name="unitType"
              value={form.unitType}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="piece">piece</option>
              <option value="bunch">bunch</option>
            </select>
            <input
              type="number"
              name="stock"
              placeholder="Stock Quantity"
              value={form.stock}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="text"
              name="seller"
              placeholder="Seller Name"
              value={form.seller}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                  Creating...
                </>
              ) : (
                "Create Product"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
