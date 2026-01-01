import { useEffect, useState } from "react";
import { getAllOrders } from "../services/OrderService";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Use service interface
import type { Order } from "../services/OrderService";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllOrders();
        setOrders(response.orders || []); // Fixed: Direct access
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
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            All Orders ({orders.length})
          </h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet.</p>
          ) : (
            <div className="grid gap-4">
              {orders.map((o) => (
                <motion.div
                  key={o._id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 p-4 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-gray-800">{o._id}</div>
                    <div className="text-sm text-gray-600">
                      Status:{" "}
                      <span className="capitalize">{o.orderStatus}</span> •
                      Total: Rs. {o.totalPrice} • Items: {o.orderItems.length}
                    </div>
                  </div>
                  <Link
                    to={`/admin/orders/${o._id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Manage
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
