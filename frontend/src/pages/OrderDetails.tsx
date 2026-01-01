import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSingleOrder } from "../services/OrderService";
import { Loader2, ArrowLeft, Package, Clock } from "lucide-react";
import { motion } from "framer-motion";

// Local types (from service)
interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: string;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  orderStatus: string;
  totalPrice: number;
  createdAt?: Date;
  // Add shippingInfo, paymentInfo if needed
}

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
        setOrder(response.order); // Fixed: Direct access (service returns { success, order })
      } catch (err: any) {
        console.error("Failed to fetch order:", err);
        setError(
          err?.response?.data?.message || "Failed to load order details"
        );
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

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
            onClick={() => navigate("/orders")}
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
        {/* Back Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-green-600 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Orders
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Order #{order._id}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Placed:{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "—"}
              </p>
            </div>
            <motion.div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.orderStatus === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : order.orderStatus === "Processing"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <Clock className="w-4 h-4 inline mr-1" />
              {order.orderStatus}
            </motion.div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">
              Total: Rs. {order.totalPrice}
            </h3>
            {/* Add shipping/payment if needed: e.g., <p>Shipping: {order.shippingInfo.address}</p> */}
          </div>

          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Items ({order.orderItems.length})
          </h3>
          <div className="space-y-3">
            {order.orderItems.map((item: OrderItem) => (
              <motion.div
                key={item.product}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-50 p-4 rounded-xl flex items-center gap-4"
              >
                <img
                  src={item.image || "/assets/placeholder.png"}
                  alt={item.name}
                  className="h-16 w-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </div>
                </div>
                <div className="font-bold text-green-600">
                  Rs. {item.price * item.quantity}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
