import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import PublicLayout from './components/layout/PublicLayout';

// Public Pages
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import CustomOrder from './pages/CustomOrder';
import Catering from './pages/Catering';
import About from './pages/About';
import Cupcakes from './pages/Cupcakes';
import Cookies from './pages/Cookies';
import Seasonal from './pages/Seasonal';
import Reviews from './pages/Reviews';
import CheckoutPage from './pages/CheckoutPage';
import TrackOrder from './pages/TrackOrder';
import Profile from './pages/Profile';

// Admin Architecture
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import DashboardOverview from './pages/admin/DashboardOverview';
import ProductManagement from './pages/admin/ProductManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import ServiceManagement from './pages/admin/ServiceManagement';
import OrderManagement from './pages/admin/OrderManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import PromotionManagement from './pages/admin/PromotionManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import TestimonialManagement from './pages/admin/TestimonialManagement';
import ContentManagement from './pages/admin/ContentManagement';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App min-h-screen">
            <Routes>
              {/* Customer-Facing Public Website */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/custom-order" element={<CustomOrder />} />
                <Route path="/catering" element={<Catering />} />
                <Route path="/about" element={<About />} />
                <Route path="/cupcakes" element={<Cupcakes />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/seasonal" element={<Seasonal />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/cart" element={<CheckoutPage />} />
                <Route path="/track" element={<TrackOrder />} />
                <Route path="/track/:orderNumber" element={<TrackOrder />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Secure Admin Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Secure Admin Dashboard (Role Protected) */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<DashboardOverview />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="services" element={<ServiceManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="customers" element={<CustomerManagement />} />
                <Route path="inventory" element={<InventoryManagement />} />
                <Route path="payments" element={<PaymentManagement />} />
                <Route path="promotions" element={<PromotionManagement />} />
                <Route path="gallery" element={<GalleryManagement />} />
                <Route path="testimonials" element={<TestimonialManagement />} />
                <Route path="content" element={<ContentManagement />} />
                <Route path="reports" element={<ReportsAnalytics />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
