import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"; // Edited: Added AlertCircle for error icon
import { motion, AnimatePresence } from "framer-motion"; // No change: For smooth animations; npm i framer-motion

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(form.email, form.password);
      nav("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: "email" | "password", value: string) => {
    setForm({ ...form, [field]: value });
    if (error) setError(null); // Clear error on input
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-green-100"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-2">Sign in to your VEGGI account</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Edited: Forgot Password Link - Placed below password for easy access */}
          <div className="text-right">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => nav("/forgot-password")}
              className="text-sm text-green-600 font-medium hover:underline transition-colors"
            >
              Forgot Password?
            </motion.button>
          </div>

          {/* Error Message - Edited: Added icon for visual feedback */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => nav("/register")}
              className="text-green-600 font-medium hover:underline transition-colors"
            >
              Sign up here
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
