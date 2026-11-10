import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import PublicLayout from './components/layout/PublicLayout';

// Public Pages (Eager load Home for instant LCP)
import Home from './pages/Home';

// Lazy-loaded Customer Pages
const Gallery = lazy(() => import('./pages/Gallery'));
const CustomOrder = lazy(() => import('./pages/CustomOrder'));
const Catering = lazy(() => import('./pages/Catering'));
const About = lazy(() => import('./pages/About'));
const Cupcakes = lazy(() => import('./pages/Cupcakes'));
const Cookies = lazy(() => import('./pages/Cookies'));
const Seasonal = lazy(() => import('./pages/Seasonal'));
const Reviews = lazy(() => import('./pages/Reviews'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const Profile = lazy(() => import('./pages/Profile'));

// Admin Architecture (Lazy loaded so normal customers never download admin bundle)
const AdminRoute = lazy(() => import('./components/auth/AdminRoute'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const DashboardOverview = lazy(() => import('./pages/admin/DashboardOverview'));
const ProductManagement = lazy(() => import('./pages/admin/ProductManagement'));
const CategoryManagement = lazy(() => import('./pages/admin/CategoryManagement'));
const ServiceManagement = lazy(() => import('./pages/admin/ServiceManagement'));
const OrderManagement = lazy(() => import('./pages/admin/OrderManagement'));
const CustomerManagement = lazy(() => import('./pages/admin/CustomerManagement'));
const InventoryManagement = lazy(() => import('./pages/admin/InventoryManagement'));
const PaymentManagement = lazy(() => import('./pages/admin/PaymentManagement'));
const PromotionManagement = lazy(() => import('./pages/admin/PromotionManagement'));
const GalleryManagement = lazy(() => import('./pages/admin/GalleryManagement'));
const TestimonialManagement = lazy(() => import('./pages/admin/TestimonialManagement'));
const ContentManagement = lazy(() => import('./pages/admin/ContentManagement'));
const ReportsAnalytics = lazy(() => import('./pages/admin/ReportsAnalytics'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

import './App.css';

const PageFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center py-20">
    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App min-h-screen">
            <Suspense fallback={<PageFallback />}>
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
            </Suspense>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
