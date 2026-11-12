import React from 'react';
import { Link } from 'react-router-dom';
import { Cake, Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  // Get current year dynamically
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-950 text-white border-t-4 border-primary-600">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            {/*<Cake className="h-8 w-8 text-primary-500" />*/}
            <span className="text-2xl font-bold tracking-tight font-display">GoodNews <span className="text-primary-500">Cake</span></span>
            <p className="text-primary-400 font-medium italic mt-2 mb-4 tracking-wide text-sm">"Where Every Bite Brings Joy"</p>
            <p className="text-gray-400 mb-6 max-w-md text-sm leading-relaxed">
              Creating delicious, handcrafted cakes for your special moments.
              Baked with love and attention to detail. Celebrate every good thing with us!
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GoodNews Cake Instagram"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-6 w-6 text-primary-500" />
              </a>
              <a 
                href="https://t.me/goodnewscake" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GoodNews Cake Telegram"
                title="GoodNews Cake on Telegram"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="h-6 w-6 text-primary-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 4-1.74 6.67-2.88 8.01-3.44 3.81-1.58 4.6-1.86 5.12-1.87.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.21-.04.36z" />
                </svg>
              </a>
              <a 
                href="https://web.facebook.com/profile.php?id=61575509915632" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GoodNews Cake Facebook"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-6 w-6 text-primary-500" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3 text-gray-400">
              {['Gallery', 'Custom Order', 'Catering', 'About'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <div className="space-y-3 text-gray-400">
              <a 
                href="tel:+251917559943" 
                className="flex items-center space-x-3 hover:text-primary-400 transition-colors cursor-pointer"
              >
                <Phone className="h-4 w-4 text-primary-500" />
                <span>+251917559943</span>
              </a>
              <a 
                href="mailto:goodnewscake@gmail.com" 
                className="flex items-center space-x-3 hover:text-primary-400 transition-colors cursor-pointer"
              >
                <Mail className="h-4 w-4 text-primary-500" />
                <span>goodnewscake@gmail.com</span>
              </a>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary-500" />
                <span>Ayat, Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-primary-500" />
                <span>Mon-Sun: 8AM-6PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} GoodNews Cake. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
