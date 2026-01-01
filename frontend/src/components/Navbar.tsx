import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, ShoppingCart, Search, User, Settings } from "lucide-react"; // Added Settings for admin
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { AnimatePresence, motion } from "framer-motion";

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth(); // Get isAdmin from context
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state } = useCart();
  const cartItemCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/90 backdrop-blur-xl shadow-xl border-b border-green-100/50 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Brand - Enhanced with glow */}
          <Link
            to="/"
            className="flex items-center gap-3 group relative overflow-hidden"
          >
            <motion.div whileHover={{ scale: 1.1 }} className="relative">
              <img
                src="src/assets/Colorful Fun Illustrative Fresh Store Logo.png"
                alt="Veggi"
                className="h-12 w-12 object-contain transition-transform group-hover:scale-110"
              />
              {/* Subtle glow on hover */}
              <motion.div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 blur-md opacity-0 group-hover:opacity-20 transition-opacity" />
            </motion.div>
            <motion.span
              whileHover={{ color: "#059669" }}
              className="font-bold text-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent"
            >
              VEGGI
            </motion.span>
          </Link>

          {/* Desktop Nav Links - Conditional for Admin */}
          <div className="hidden md:flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search fresh veggies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 text-sm w-48"
              />
            </div>

            {/* User Links */}
            <Link
              to="/products"
              className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 relative group"
            >
              Products
              <motion.span
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
              />
            </Link>
            <Link
              to="/orders"
              className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 relative group"
            >
              My Orders
              <motion.span
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
              />
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="relative group">
              <motion.div
                animate={cartItemCount > 0 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ShoppingCart
                  size={24}
                  className="text-gray-700 group-hover:text-green-600 transition-colors"
                />
              </motion.div>
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
                >
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </motion.span>
              )}
            </Link>

            {/* Admin Links - Conditional */}
            {isAdmin && (
              <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
                <Link
                  to="/admin/products"
                  className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 relative group flex items-center gap-1"
                >
                  <Settings size={20} />
                  Manage Products
                  <motion.span
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
                  />
                </Link>
                <Link
                  to="/admin/orders"
                  className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 relative group flex items-center gap-1"
                >
                  Manage Orders
                  <motion.span
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
                  />
                </Link>
              </div>
            )}

            {/* Auth Section */}
            <div className="flex items-center gap-4 ml-4">
              {user ? (
                <>
                  <Link to="/profile" className="relative">
                    <User
                      size={24}
                      className="text-gray-700 hover:text-green-600 transition-colors rounded-full p-1"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>{" "}
                    {/* Online indicator */}
                  </Link>
                  <span className="text-sm text-gray-600 hidden sm:block">
                    Hi, {user.name}!
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white border border-red-200 rounded-full text-sm font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-700 hover:text-green-600 p-2 transition-colors rounded-full hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Nav Menu - Slide-in animation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-gray-100 overflow-hidden"
            >
              <div className="flex flex-col gap-4 pt-4">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search veggies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <Link
                  to="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-green-600 font-medium py-2 transition-colors"
                >
                  Products
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-green-600 font-medium py-2 transition-colors"
                >
                  My Orders
                </Link>

                {/* Mobile Cart */}
                <Link
                  to="/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 py-2 transition-colors"
                >
                  <ShoppingCart size={20} />
                  Cart {cartItemCount > 0 && `(${cartItemCount})`}
                </Link>

                {/* Mobile Admin Links - Conditional */}
                {isAdmin && (
                  <div className="border-t border-gray-200 pt-2">
                    <Link
                      to="/admin/products"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-gray-700 hover:text-green-600 py-2 transition-colors"
                    >
                      <Settings size={20} />
                      Manage Products
                    </Link>
                    <Link
                      to="/admin/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-gray-700 hover:text-green-600 py-2 transition-colors"
                    >
                      Manage Orders
                    </Link>
                  </div>
                )}

                {user ? (
                  <>
                    <div className="flex items-center gap-2 px-2 py-2 bg-gray-100 rounded-lg">
                      <User size={20} className="text-green-600" />
                      <span className="text-sm text-gray-600">
                        Hi, {user.name}!
                      </span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-pink-600 transition-all"
                    >
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all text-center"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
