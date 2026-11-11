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

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, copied: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('GoodNews App Error:', error, errorInfo);
    try {
      const telemetryRecord = {
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        error: error?.message || String(error),
        stack: error?.stack?.slice(0, 500) || '',
        component: errorInfo?.componentStack?.slice(0, 500) || '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
      };
      const existing = JSON.parse(sessionStorage.getItem('app_error_telemetry') || '[]');
      existing.unshift(telemetryRecord);
      sessionStorage.setItem('app_error_telemetry', JSON.stringify(existing.slice(0, 10)));
      if (typeof window !== 'undefined') {
        window.__GET_APP_TELEMETRY__ = () => JSON.parse(sessionStorage.getItem('app_error_telemetry') || '[]');
      }
    } catch (e) {
      // ignore storage serialization errors
    }
  }

  copyTelemetry = () => {
    try {
      const logs = sessionStorage.getItem('app_error_telemetry') || '[]';
      navigator.clipboard.writeText(logs);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 3000);
    } catch (e) {}
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-gray-100">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 mb-6">
              An unexpected display issue occurred. Your shopping bag and details remain safely saved.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full btn-primary py-3 rounded-xl font-bold"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.copyTelemetry}
                className="w-full py-2 px-4 text-xs text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                {this.state.copied ? '✓ Diagnostic Report Copied' : 'Copy Diagnostic Report'}
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <GlobalErrorBoundary>
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
                  <Route path="/track-order" element={<TrackOrder />} />
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
  </GlobalErrorBoundary>
  );
}

export default App;
