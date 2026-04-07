import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
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
import AdminOrders from './pages/AdminOrders';
import AdminRoute from './components/auth/AdminRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
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
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;