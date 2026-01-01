import { useEffect, useState } from "react";
import { getAllProducts } from "../services/ProductService";
import { ProductCard } from "../components/ProductCard";
import { Search, Filter, Loader2 } from "lucide-react"; // Lucide React for icons; npm i lucide-react
import { motion, AnimatePresence } from "framer-motion"; // For smooth animations; npm i framer-motion
import { useMemo } from "react";



export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterCategory, setFilterCategory] = useState(""); 

  const fetchProducts = async (page: number, keyword: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllProducts(page, keyword);
      const fetchedProducts = response?.products ?? [];
      setProducts(fetchedProducts);
      setTotalPages(response?.totalPages || 1);
      // Debug: Inspect once, then remove
      console.log("Full API Response:", response);
      console.log("Fetched products:", fetchedProducts);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const filteredProducts = useMemo(() => {
    // Basic client-side filter if needed; backend handles search/category
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100"
      >
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchProducts(1, "")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent text-center mb-2">
          Fresh Picks
        </h1>
        <p className="text-gray-600 text-center">
          Discover our organic veggies and more
        </p>
      </motion.div>

      {/* Controls: Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="container mx-auto px-4 mb-8 flex flex-col md:flex-row gap-4 items-center"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/80"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/80"
          >
            <option value="">All Categories</option>
            <option value="leafy">Leafy Greens</option>
            <option value="root">Root Veggies</option>
            {/* Add more from API */}
          </select>
        </div>
      </motion.div>

      <div className="container mx-auto px-4">
        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-20"
          >
            <div className="flex items-center gap-2 text-green-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading fresh picks...</span>
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        {!loading && (
          <AnimatePresence>
            <motion.div
              layout
              initial={false}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full text-center py-20"
                >
                  <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">No products found</p>
                  <p className="text-gray-400 mt-2">
                    Try adjusting your search or filters
                  </p>
                </motion.div>
              ) : (
                filteredProducts.map((p, index) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex justify-center items-center gap-2"
          >
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-green-600 text-white"
                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
