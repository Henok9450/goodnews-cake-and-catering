import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { MessageCircle } from 'lucide-react';

const PAGE_TITLES = {
  '/': 'GoodNews Cake & Catering | Artisanal Cakes & Catering in Addis Ababa',
  '/gallery': 'Artisanal Cake Gallery | GoodNews Cake & Catering',
  '/custom-order': 'Custom Cake Studio & Design | GoodNews Cake & Catering',
  '/catering': 'Catering Packages & Buffets | GoodNews Cake & Catering',
  '/seasonal': 'Ethiopian Holiday & Seasonal Cakes | GoodNews Cake & Catering',
  '/cupcakes': 'Gourmet Handcrafted Cupcakes | GoodNews Cake & Catering',
  '/cookies': 'Fresh Artisanal Cookies | GoodNews Cake & Catering',
  '/about': 'Our Story & Philosophy | GoodNews Cake & Catering',
  '/reviews': 'Customer Testimonials & Reviews | GoodNews Cake & Catering',
  '/cart': 'Shopping Cart & Secure Checkout | GoodNews Cake & Catering',
  '/track': 'Track Your Cake Order Status | GoodNews Cake & Catering',
  '/profile': 'Customer Profile & Order History | GoodNews Cake & Catering',
};

const PublicLayout = () => {
  const location = useLocation();

  useEffect(() => {
    const basePath = location.pathname.startsWith('/track/') ? '/track' : location.pathname;
    const title = PAGE_TITLES[basePath] || 'GoodNews Cake & Catering | Addis Ababa';
    document.title = title;
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />

      {/* Floating WhatsApp Consultation Button */}
      <a
        href="https://wa.me/251917559943?text=Hello%20GoodNews%20Cake,%20I'd%20like%20to%20inquire%20about%20ordering%20a%20cake!"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order via WhatsApp on +251917559943"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center gap-2.5 group hover:scale-105 active:scale-95"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 shrink-0" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-xs font-bold whitespace-nowrap">
          Order via WhatsApp
        </span>
      </a>
    </div>
  );
};

export default PublicLayout;
