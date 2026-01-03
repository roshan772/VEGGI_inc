import React, { useState, useEffect } from "react";
import { createOrder } from "../services/OrderService";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  MapPin,
  Phone,
  Hash,
  Globe,
  CreditCard,
  Truck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Edited: Load PayHere SDK dynamically if not present (fallback to script in index.html)
const loadPayHereSDK = () => {
  if (typeof window !== "undefined" && !window.payhere) {
    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.async = true;
    document.head.appendChild(script);
    return new Promise<void>((resolve) => {
      script.onload = () => resolve();
    });
  }
  return Promise.resolve();
};

declare global {
  interface Window {
    payhere: {
      startPayment: (config: any) => void;
      onCompleted: (callback: (response: any) => void) => void;
      onDismissed: (callback: () => void) => void;
      onError: (callback: (error: any) => void) => void;
    };
  }
}

interface ShippingForm {
  address: string;
  city: string;
  phoneNo: string;
  postalCode: string;
  country: string;
}

// Edited: API_BASE = root URL (no /api/v1) – append /api/v1 in all calls for consistency
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Checkout() {
  const [form, setForm] = useState<ShippingForm>({
    address: "",
    city: "",
    phoneNo: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // No changes: Fetch real cart from context (no prop needed)
  const {
    state: { items: cartItems },
    clearCart,
  } = useCart();

  // Fetch user from auth context
  const { user } = useAuth();

  // Edited: Load PayHere SDK on mount (if not loaded)
  useEffect(() => {
    loadPayHereSDK();
  }, []);

  // Edited: New state for payment method selection (default COD)
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");

  const handleInputChange = (field: keyof ShippingForm, value: string) => {
    setForm({ ...form, [field]: value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError("Your cart is empty. Add items before checking out.");
      return;
    }
    if (
      !form.address ||
      !form.city ||
      !form.phoneNo ||
      !form.postalCode ||
      !form.country
    ) {
      setError("Please fill in all fields");
      return;
    }
    // Optional: Validate phone/postal
    if (!/^\d{10,}$/.test(form.phoneNo)) {
      setError("Please enter a valid phone number");
      return;
    }
    if (!/^\d{4,6}$/.test(form.postalCode)) {
      setError("Please enter a valid postal code");
      return;
    }

    // Edited: Check if user is logged in (required for order/userId)
    if (!user) {
      setError("Please log in to checkout");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    // Map cart to ensure 'product' field (copy from 'id')
    const orderItems = cartItems.map((item) => ({
      ...item,
      product: item.id || item.product,
    }));
    const itemsPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingPrice = 50;
    const taxPrice = 0; // Calculate as needed
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Edited: Branch logic based on payment method
    try {
      if (paymentMethod === "cod") {
        // Option 1: Normal COD flow
        const orderPayload = {
          orderItems,
          shippingInfo: form,
          paymentInfo: { id: "COD", status: "Pending" },
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        };

        // Edited: Use API_BASE + /api/v1 for consistency
        const res = await createOrder(orderPayload); // Assume createOrder uses api.post("/api/v1/orders")
        clearCart(); // Clear cart after successful order
        navigate(`/order/${res.order._id}`);
      } else {
        // Option 2: PayHere card payment flow
        const orderPayload = {
          orderItems,
          shippingInfo: form,
          paymentInfo: { id: "PENDING", status: "Pending" },
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        };

        // Step 1 - Create pending order on backend
        const orderRes = await createOrder(orderPayload);
        const orderId = orderRes.order._id;

        // Step 2 - Generate PayHere hash (new API call)
        const hashResponse = await fetch(`${API_BASE}/api/v1/payments/hash`, { // Edited: Full path: root + /api/v1/payments/hash
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            amount: totalPrice,
            userId: user.id, // Safe after login check
            orderItems, // Pass for backend reference
          }),
        });
        if (!hashResponse.ok) {
          const errText = await hashResponse.text();
          console.error("Hash error:", hashResponse.status, errText);
          throw new Error(`Payment hash failed: ${hashResponse.status}`);
        }
        const hashData = await hashResponse.json();

        // Step 3 - Initialize PayHere payment (use window.payhere)
        if (typeof window !== "undefined" && window.payhere) {
          const paymentConfig = {
            sandbox: true, // Set to false for production
            merchant_id: hashData.merchantId,
            return_url: `${window.location.origin}/order/${orderId}?status=success`,
            cancel_url: `${window.location.origin}/order/${orderId}?status=cancel`,
            notify_url: `${API_BASE}/api/v1/payments/notify`, // Edited: Full path for webhook

            order_id: hashData.orderId || orderId,
            items: cartItems
              .map((item) => `${item.name} x ${item.quantity}`)
              .join(", "),
            currency: "LKR",
            amount: totalPrice.toFixed(2),
            hash: hashData.hash,
            first_name: user.name.split(" ")[0] || "Customer",
            last_name: user.name.split(" ").slice(1).join(" ") || "",
            email: user.email || "",
            phone: form.phoneNo,
            address: form.address,
            city: form.city,
            country: form.country,
          };

          // Set callbacks for PayHere
          window.payhere.onCompleted = async (response: any) => {
            console.log("Payment completed:", response);
            // Update order status on backend
            await fetch(`${API_BASE}/api/v1/order/${orderId}/pay`, { // Edited: Full path
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                status: "paid",
                paymentId: response.payment_id,
              }),
            });
            clearCart();
            navigate(`/order/${orderId}`);
          };

          window.payhere.onDismissed = () => {
            console.log("Payment dismissed");
            navigate("/cart");
          };

          window.payhere.onError = (error: any) => {
            console.error("Payment error:", error);
            setError("Payment failed. Please try again.");
          };

          // Start PayHere popup
          window.payhere.startPayment(paymentConfig);
        } else {
          throw new Error("PayHere SDK not loaded. Please refresh the page.");
        }
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err.message || "Failed to create order";
      if (msg.includes("hash")) {
        setError("Payment setup failed. Please contact support.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Use real cart for summary
  const itemsPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalPrice = itemsPrice + 200; // + shipping

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-green-100 p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Complete Your Order
            </h2>
            <p className="text-gray-600">Enter your shipping details below</p>
          </div>

          {/* Cart Summary - Now Uses Real Cart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 rounded-xl p-4 mb-6"
          >
            <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>Rs. {item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between font-medium">
                <span>Shipping</span>
                <span>Rs. 200</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold text-green-600">
                <span>Total</span>
                <span>Rs. {totalPrice}</span>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Address */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                Address
              </label>
              <input
                type="text"
                placeholder="Enter your full address"
                value={form.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50/50"
                required
                aria-describedby={error ? "error-msg" : undefined}
              />
            </div>

            {/* City */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                City
              </label>
              <input
                type="text"
                placeholder="Enter your city"
                value={form.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50/50"
                required
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={form.phoneNo}
                onChange={(e) => handleInputChange("phoneNo", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50/50"
                required
              />
            </div>

            {/* Postal Code */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-400" />
                Postal Code
              </label>
              <input
                type="text"
                placeholder="Enter postal code"
                value={form.postalCode}
                onChange={(e) =>
                  handleInputChange("postalCode", e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50/50"
                required
              />
            </div>

            {/* Country */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                Country
              </label>
              <input
                type="text"
                placeholder="Enter your country"
                value={form.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50/50"
                required
              />
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  id="error-msg"
                  className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3"
                  role="alert"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edited: New Payment Method Selection Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {" "}
                {/* Edited: Responsive grid for options */}
                {/* COD Option */}
                <motion.button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "cod"
                      ? "border-green-500 bg-green-50 text-green-700" // Selected style
                      : "border-gray-300 hover:border-green-300"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5" />
                    <div>
                      <h4 className="font-semibold">Cash on Delivery</h4>
                      <p className="text-sm text-gray-600">
                        Pay when delivered
                      </p>
                    </div>
                  </div>
                </motion.button>
                {/* Card Option */}
                <motion.button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "card"
                      ? "border-blue-500 bg-blue-50 text-blue-700" // Selected style (blue for card)
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5" />
                    <div>
                      <h4 className="font-semibold">Card Payment (PayHere)</h4>
                      <p className="text-sm text-gray-600">
                        Secure online payment
                      </p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Payment Note - Edited: Conditional based on selection */}
            <div className="text-center text-sm mb-6">
              {paymentMethod === "cod" ? (
                <>
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  Payment: Cash on Delivery (COD)
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  Payment: Secure Card via PayHere
                </>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}