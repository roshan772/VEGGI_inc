import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Local type
interface Order {
  _id: string;
  orderStatus: string;
  totalPrice: number;
  createdAt?: Date;
  orderItems: any[];
}

type OrderCardProps = {
  order: Order;
};

export const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-800">Order ID: {order._id}</h3>
        <Link
          to={`/order/${order._id}`}
          className="text-sm text-green-600 hover:underline"
        >
          View Details
        </Link>
      </div>
      <p className="text-sm text-gray-600">
        Placed:{" "}
        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
      </p>
      <p className="text-sm">
        Status:{" "}
        <span className="font-medium capitalize">
          {order.orderStatus || "—"}
        </span>
      </p>
      <p className="text-lg font-bold text-green-600 mt-2">
        Rs. {order.totalPrice || "—"}
      </p>
      <p className="text-sm text-gray-500">
        Items: {order.orderItems?.length || 0}
      </p>
    </motion.div>
  );
};
