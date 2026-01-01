import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetails, updateProduct } from "../services/ProductService";
import { Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    unitType: "",
    stock: 0,
    freshness: "",
    origin: "",
    seller: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const response = await getProductDetails(id);
        const product = response.product;
        setForm({
          name: product.name,
          price: product.price,
          description: product.description,
          category: product.category,
          unitType: product.unitType,
          stock: product.stock,
          freshness: product.freshness,
          origin: product.origin,
          seller: product.seller,
        });
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

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
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !form.name || !form.seller) {
      setError("Please fill required fields");
      return;
    }

    setUpdating(true);
    setError(null);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      data.append(key, value.toString())
    );
    images.forEach((image) => data.append("images", image));

    try {
      await updateProduct(id, data);
       //toast.success("Product updated!");
      navigate("/admin/products");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update product");
    } finally {
      setUpdating(false);
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
          <span>Loading product...</span>
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
            Edit Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Same form fields as CreateProduct, pre-filled with form state */}
            <input
              type="text"
              name="name"
              placeholder="Product Name"
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
              {/* Same options as CreateProduct */}
              <option value="Leafy Vegetables">Leafy Vegetables</option>
              {/* ... other options */}
            </select>
            {/* ... other fields like unitType, stock, seller */}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={updating}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
            >
              {updating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                  Updating...
                </>
              ) : (
                "Update Product"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
