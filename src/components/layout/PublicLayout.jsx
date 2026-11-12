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

      {/* Floating Direct Consultation & Order Dock (Telegram + WhatsApp) */}
      <aside aria-label="Direct messaging channels" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Telegram Order Button */}
        <a
          href="https://t.me/goodnewscake?text=Hello%20GoodNews%20Cake,%20I'd%20like%20to%20inquire%20about%20ordering%20a%20cake!"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order via Telegram on @goodnewscake"
          className="bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-full shadow-lg hover:shadow-sky-500/30 transition-all duration-300 flex items-center gap-2.5 group hover:scale-105 active:scale-95"
          title="Order via Telegram"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 4-1.74 6.67-2.88 8.01-3.44 3.81-1.58 4.6-1.86 5.12-1.87.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.21-.04.36z" />
          </svg>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-xs font-bold whitespace-nowrap">
            Order via Telegram
          </span>
        </a>

        {/* WhatsApp Order Button */}
        <a
          href="https://wa.me/251917559943?text=Hello%20GoodNews%20Cake,%20I'd%20like%20to%20inquire%20about%20ordering%20a%20cake!"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order via WhatsApp on +251917559943"
          className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 flex items-center gap-2.5 group hover:scale-105 active:scale-95"
          title="Order via WhatsApp"
        >
          <MessageCircle className="w-5 h-5 shrink-0" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-xs font-bold whitespace-nowrap">
            Order via WhatsApp
          </span>
        </a>
      </aside>
    </div>
  );
};

export default PublicLayout;
