import { useEffect, useState } from "react";
import { getMyOrders } from "../services/OrderService";
import { OrderCard } from "../components/OrderCard";
import { Loader2, Package, Plus } from "lucide-react";
import { motion } from "framer-motion";

// Local types (from service)
interface Order {
  _id: string;
  orderStatus: string;
  totalPrice: number;
  createdAt?: Date;
  orderItems: any[]; // Simplified
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getMyOrders();
        setOrders(response.orders || []); // Fixed: Direct access (service returns { success, orders })
      } catch (err: any) {
        console.error("Failed to fetch orders:", err);
        setError(err?.response?.data?.message || "Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-2 text-green-600"
        >
          <Loader2 className="w-6 h-6" />
          <span>Loading orders...</span>
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
          className="flex justify-between items-center mb-6"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            My Orders
          </h2>
          {/* Optional: Link to checkout */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/checkout")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Order
          </motion.button>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No orders yet</p>
            <p className="text-gray-400 mt-2">
              Start shopping to place your first order!
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {orders.map((o) => (
              <OrderCard key={o._id} order={o} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
