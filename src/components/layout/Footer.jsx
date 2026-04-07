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
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6 text-primary-500" />
              </a>
              <a href="https://web.facebook.com/profile.php?id=61575509915632" className="text-gray-400 hover:text-white transition-colors">
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
              <div className="flex items-center space-x-3 hover:text-primary-400 transition-colors cursor-pointer">
                <Phone className="h-4 w-4 text-primary-500" />
                <span>+251917559943</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-500" />
                <span>goodnewsscake@gmail.com</span>
              </div>
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
