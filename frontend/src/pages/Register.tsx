import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/AuthService"; 
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Upload,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar?: File | null;
}

export const Register = () => {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (field: keyof RegisterForm, value: string) => {
    setForm({ ...form, [field]: value });
    if (error) setError(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    setError(null);

    // Prepare FormData for avatar upload
    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("password", form.password);
    if (form.avatar) {
      data.append("avatar", form.avatar);
    }

    try {
      const response = await register(data); // Call backend register
      const data_response = response as any;
      if (data_response.success) {
        // Optional: toast.success("Registration successful! Please login.");
        navigate("/login"); // Redirect to login
      } else {
        setError(data_response.message || "Registration failed");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-green-100 p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Join VEGGI
            </h2>
            <p className="text-gray-600">
              Create your account to start shopping fresh veggies
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50/50"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50/50"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password (min 6 chars)"
                  value={form.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Avatar Upload (Optional) */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Upload className="w-4 h-4 text-gray-400" />
                Profile Picture (Optional)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                )}
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3"
                  role="alert"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

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
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </motion.button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-green-600 font-medium hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
