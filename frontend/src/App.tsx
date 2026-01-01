import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
//import { Navbar } from "./components/Navbar";
import { Navbar } from "./components/Navi";
import { Home } from "./pages/Home";
import { ProductDetails } from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import { AdminRoute } from "./routes/AdminRoute";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderManage from "./pages/AdminOrderManage";
import Login from "./pages/Login";
import { Register } from "./pages/Register";
import { Footer } from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Cart } from "./components/Cart";
import { AdminProducts } from "./pages/AdminProducts";
import { CreateProduct } from "./pages/AdminCreateProducts";
import AdminEditProducts from "./pages/AdminEditProducts";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { BannerCarousel } from "./components/BannerCarousel";


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        {" "}
        {/* Wrap with CartProvider */}
        <BrowserRouter>
          <Navbar />
          <BannerCarousel/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route
              path="/cart" // New route for Cart
              element={
                <ProtectedRoute>
                  {" "}
                  {/* Optional: Protect cart */}
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders/:id"
              element={
                <AdminRoute>
                  <AdminOrderManage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <AdminRoute>
                  <CreateProduct />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/:id/edit"
              element={
                <AdminRoute>
                  <AdminEditProducts />
                </AdminRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
