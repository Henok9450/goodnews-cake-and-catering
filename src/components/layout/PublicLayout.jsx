import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SEOHead from '../common/SEOHead';
import { MessageCircle } from 'lucide-react';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <SEOHead />
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
