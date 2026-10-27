import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import AuthModal from "./components/common/AuthModal";
import CartDrawer from "./components/common/CartDrawer";

import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/wish-list" element={<WishlistPage />} />
                    <Route path="/products/:id" element={<ProductDetailsPage />} />
                    <Route path="/products/category/:catId" element={<CategoryProductsPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />

                    {/* Hospital User Routes */}
                    <Route path="/user/profile" element={<UserDashboardPage />} />
                    <Route path="/user/orders" element={<UserDashboardPage />} />
                    <Route path="/user/setting" element={<UserDashboardPage />} />

                    {/* Procurement Admin Routes */}
                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/admin/dashboard/categories" element={<Navigate to="/admin/dashboard?tab=categories" replace />} />
                    <Route path="/admin/dashboard/products" element={<Navigate to="/admin/dashboard?tab=products" replace />} />
                    <Route path="/admin/dashboard/orders" element={<Navigate to="/admin/dashboard?tab=overview" replace />} />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
                <AuthModal />
                <CartDrawer />
              </div>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
