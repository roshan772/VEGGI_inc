import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Cart: React.FC = () => {
  const { state, updateQuantity, removeFromCart, clearCart, getTotal } =
    useCart();

  const handleQuantityChange = (id: string, delta: number) => {
    const item = state.items.find((i) => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity + delta);
    }
  };

  if (state.items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-8"
      >
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some fresh veggies to get started!
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 max-w-4xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Items List */}
          <div className="space-y-4 mb-8">
            <AnimatePresence>
              {state.items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <img
                    src={Array.isArray(item.image) ? `http://localhost:8000${item.image[0]?.image}` : item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Rs. {item.price} each
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="font-bold text-green-600">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Totals & Actions */}
          <div className="bg-gray-100 p-4 rounded-xl">
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>
                Total ({state.items.reduce((sum, i) => sum + i.quantity, 0)}{" "}
                items)
              </span>
              <span>Rs. {getTotal().toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl text-center font-semibold hover:shadow-lg transition-all text-lg"
            >
              Proceed to Checkout
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
