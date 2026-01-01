import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { AnimatePresence, motion } from "framer-motion";

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state } = useCart();
  const cartItemCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pointer-events-none">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="container mx-auto max-w-7xl pointer-events-auto rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-lg shadow-black/5 px-6 py-3"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="relative"
            >
              <img
                src="src/assets/Colorful Fun Illustrative Fresh Store Logo.png"
                alt="Veggi"
                className="h-10 w-10 object-contain"
              />
            </motion.div>
            <span className="font-black text-xl tracking-tighter bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              VEGGI
            </span>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden lg:flex relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search freshness..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Main Links */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6 text-sm font-semibold text-gray-600">
              <Link
                to="/products"
                className="hover:text-green-600 transition-colors"
              >
                Products
              </Link>
              <Link
                to="/orders"
                className="hover:text-green-600 transition-colors"
              >
                Orders
              </Link>
              {isAdmin && (
                <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
                  <Link
                    to="/admin/products"
                    className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100"
                  >
                    <Settings size={14} /> Admin Products Manage
                  </Link>
                  <Link
                    to="/admin/orders"
                    className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 relative group flex items-center gap-1"
                  >
                    <Settings size={14} /> Admin Manage Orders
                    <motion.span
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
                    />
                  </Link>
                </div>
              )}
            </nav>

            <div className="h-6 w-px bg-gray-200/50" />

            {/* Actions */}
            <div className="flex items-center gap-5">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative group p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <ShoppingCart
                  size={20}
                  className="text-gray-700 group-hover:text-green-600"
                />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* User / Auth */}
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/auth/me"
                    className="flex items-center gap-2 p-1 pr-3 bg-white/40 rounded-full border border-white/60 hover:bg-white/80 transition-all"
                    aria-label="Go to profile"
                  >
                    <User
                      size={24}
                      className="text-gray-700 hover:text-green-600 transition-colors rounded-full p-1"
                    />

                    {/* Edited: Exact avatar image - use uploaded URL, fallback to initial */}
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      {user.avatar?.url ? (
                        <img
                          src={user.avatar.url} // Exact uploaded avatar URL from DB (e.g., /uploads/avatars/filename.jpg)
                          alt={`${user.name}'s avatar`}
                          className="h-8 w-8 object-cover" // Fit to circle
                          onError={(e) => {
                            // Fallback to initial on load error
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.nextElementSibling?.classList.remove(
                              "hidden"
                            ); // Show fallback
                          }}
                        />
                      ) : null}
                      {/* Fallback initial - hidden if image loads */}
                      <div
                        className={`h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold ${
                          user.avatar?.url ? "hidden" : "" // Hide if avatar exists
                        }`}
                      >
                        {user.name[0].toUpperCase()}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-700 hidden lg:block">
                      Hi, {user.name.split(" ")[0]}
                    </span>
                  </Link>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                    aria-label="Logout"
                  >
                    <LogOut size={18} />
                  </motion.button>
                </div>
              ) : (
                // No change: Guest sign-in link
                <Link
                  to="/login"
                  className="px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-200"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-600"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-4 pt-6 pb-4 border-t border-gray-100/50 mt-4">
                <Link
                  to="/products"
                  className="text-lg font-semibold text-gray-700"
                >
                  Products
                </Link>
                <Link
                  to="/orders"
                  className="text-lg font-semibold text-gray-700"
                >
                  My Orders
                </Link>
                <div className="h-px bg-gray-100" />
                {user ? (
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-red-500 font-bold"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                ) : (
                  <Link to="/login" className="text-green-600 font-bold">
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};
