import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSingleOrder, // Fixed: Use correct function
  updateOrder,
  deleteOrder,
} from "../services/OrderService";
import { Loader2} from "lucide-react"; 
import { motion } from "framer-motion"; 

// Use service interface
import type { Order } from "../services/OrderService";

export default function AdminOrderManage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [order, setOrder] = useState<Order | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Processing");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError("Invalid order ID");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await getSingleOrder(id);
        const fetchedOrder = response.order;
        if (!fetchedOrder) throw new Error("Order not found");
        setOrder(fetchedOrder);
        setStatus(fetchedOrder.orderStatus || "Processing"); // Fixed: Safe access
      } catch (err: any) {
        console.error("Failed to fetch order:", err);
        setError(err?.response?.data?.message || "Failed to load order");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const update = async () => {
    if (!id || !order) return;
    setUpdating(true);
    try {
      const response = await updateOrder(id, status);
      setOrder(response.order); // Update state with new data
      // Optional: Use toast instead of alert
      alert("Status updated successfully"); // Or integrate react-hot-toast
    } catch (err: any) {
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const remove = async () => {
    if (!id || !order) return;
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(id);
      alert("Order deleted successfully");
      nav("/admin/orders"); // Fixed: Navigate back
    } catch (err: any) {
      alert(err?.response?.data?.message || "Delete failed");
    }
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
          <span>Loading order...</span>
        </motion.div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Order not found"}</p>
          <button
            onClick={() => window.location.reload()} // Simple retry
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mr-2"
          >
            Retry
          </button>
          <button
            onClick={() => nav("/admin/orders")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Manage Order #{order._id}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Placed:{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "—"}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
              {order.orderStatus}
            </span>
          </div>

          <p className="mb-4">
            <strong>Total:</strong> Rs. {order.totalPrice}
          </p>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Items</h3>
            <div className="space-y-2">
              {order.orderItems.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      Qty: {item.quantity} • Rs. {item.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={updating}
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={update}
              disabled={updating}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {updating ? "Updating..." : "Update Status"}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={remove}
              className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
            >
              Delete Order
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
