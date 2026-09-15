import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Phone, Menu, X, User, ChevronDown, LayoutDashboard, Clock, Sparkles } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { user, loginWithGoogle, loading, isAdmin } = useAuth();

  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Check bakery operating status (8:00 AM - 6:00 PM East Africa Time UTC+3)
  const getBakeryStatus = () => {
    try {
      const now = new Date();
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const eatDate = new Date(utcTime + (3600000 * 3));
      const hours = eatDate.getHours();
      const isOpen = hours >= 8 && hours < 18;
      return {
        isOpen,
        text: isOpen ? 'Open Today: 8:00 AM - 6:00 PM' : 'Opens Today at 8:00 AM',
        shortText: isOpen ? 'Open: 8AM-6PM' : 'Opens: 8AM',
      };
    } catch (e) {
      return { isOpen: true, text: 'Open: 8:00 AM - 6:00 PM', shortText: '8AM-6PM' };
    }
  };

  const bakeryStatus = getBakeryStatus();

  const navGroups = [
    { label: 'Home', path: '/' },
    { 
      label: 'Shop', 
      items: [
        { path: '/gallery', label: 'All Cakes' },
        { path: '/cupcakes', label: 'Cupcakes' },
        { path: '/cookies', label: 'Cookies' },
        { path: '/seasonal', label: 'Seasonal Items' },
      ]
    },
    { 
      label: 'Specialty', 
      items: [
        { path: '/custom-order', label: 'Custom Cake' },
        { path: '/catering', label: 'Catering' },
      ]
    },
    { label: 'Track Order', path: '/track' },
    { label: 'About', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-300">
      
      {/* TOP ANNOUNCEMENT & OPERATING HOURS TIMESTAMP BAR */}
      <div className="bg-dark-950 text-white text-[11px] sm:text-xs py-1 px-3 sm:px-6 border-b border-gray-800">
        <div className="container mx-auto flex items-center justify-between">
          {/* Operating Hours / Timestamp */}
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${bakeryStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <div className="flex items-center gap-1.5 text-gray-200 font-medium">
              <Clock className="w-3.5 h-3.5 text-primary-400 shrink-0" />
              <span className="hidden sm:inline">{bakeryStatus.text}</span>
              <span className="sm:hidden">{bakeryStatus.shortText}</span>
            </div>
          </div>

          {/* Right: Quick Note & Contact */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-gray-400">🚚 Delivery in Addis Ababa</span>
            <a 
              href="tel:+251917559943" 
              className="flex items-center gap-1 text-primary-400 hover:text-primary-300 font-semibold transition-colors"
              title="Call Bakery"
            >
              <Phone className="w-3 h-3 shrink-0" />
              <span>+251 917 559 943</span>
            </a>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION BAR */}
      <div className={`transition-all duration-300 ${
        isScrolled 
          ? 'py-2 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100' 
          : 'py-2.5 sm:py-3 bg-white shadow-sm'
      }`}>
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center gap-2">
            
            {/* LOGO SECTION */}
            <Link to="/" className="flex items-center shrink min-w-0" onClick={() => setIsMenuOpen(false)}>
              <img
                src="/images/logo/logo3.png"
                alt="GoodNews Cake"
                className={`transition-all duration-300 ${isScrolled ? 'h-9 sm:h-11 md:h-12' : 'h-10 sm:h-12 md:h-14 lg:h-16'} max-w-[130px] xs:max-w-[160px] sm:max-w-[200px] md:max-w-none w-auto object-contain`} 
              />
            </Link>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navGroups.map((group) => (
                <div 
                  key={group.label} 
                  className="relative group lg:px-2"
                  onMouseEnter={() => group.items && setActiveDropdown(group.label)}
                  onMouseLeave={() => group.items && setActiveDropdown(null)}
                >
                  {group.path ? (
                    <Link
                      to={group.path}
                      className={`px-3 py-2 text-sm font-semibold transition-all rounded-lg flex items-center ${
                        isActive(group.path) ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                    >
                      {group.label}
                    </Link>
                  ) : (
                    <button className="px-3 py-2 text-sm font-semibold text-gray-600 group-hover:text-primary-600 transition-all rounded-lg flex items-center gap-1">
                      {group.label}
                      <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                    </button>
                  )}

                  {/* Dropdown Menu */}
                  {group.items && (
                    <div className={`absolute top-full left-0 pt-2 transition-all duration-300 ${
                      activeDropdown === group.label ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'
                    }`}>
                      <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2 min-w-[200px]">
                        {group.items.map(item => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`block px-4 py-2.5 text-sm rounded-lg transition-colors ${
                              isActive(item.path) ? 'bg-primary-50 text-primary-700 font-bold' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* ACTION BUTTONS (Right Side) */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
              
              {/* CALL BUTTON */}
              <a
                href="tel:+251917559943"
                className="p-1.5 sm:p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all"
                title="Call Bakery"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>

              {/* ADMIN PILL (Desktop) */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden lg:flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  ADMIN DASHBOARD
                </Link>
              )}

              {/* CART BUTTON */}
              <button
                className="relative p-1.5 sm:p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all"
                onClick={() => navigate('/cart')}
                title="Cart"
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:top-1 sm:right-1 bg-primary-600 text-white rounded-full text-[9px] sm:text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border-2 border-white">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {/* AUTH / PROFILE */}
              {!loading && (
                user ? (
                  <Link
                    to="/profile"
                    className="flex items-center gap-1.5 p-1 sm:pr-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all border border-gray-200"
                    title="My Account"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-600 flex items-center justify-center text-white overflow-hidden shadow-inner shrink-0">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || 'Account'} className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </div>
                    <span className="hidden md:block text-xs font-bold text-gray-700 tracking-tight">MY ACCOUNT</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => loginWithGoogle()}
                    className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-all text-xs sm:text-sm font-bold shadow-sm active:scale-95 flex items-center gap-1.5"
                    title="Sign In"
                  >
                    <User className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                )
              )}

              {/* MOBILE MENU TOGGLE */}
              <button
                className="lg:hidden p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
              >
                {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
              </button>
            </div>
          </div>

          {/* MOBILE NAVIGATION DRAWER */}
          {isMenuOpen && (
            <nav className="lg:hidden max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain mt-2 pb-6 border-t border-gray-100 animate-in slide-in-from-top-4 duration-300">
              
              {/* Bakery Hours Card inside Drawer */}
              <div className="my-3 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bakeryStatus.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      {bakeryStatus.isOpen ? 'Bakery is Open' : 'Bakery is Closed'}
                    </p>
                    <p className="text-[11px] text-gray-500">Mon-Sun: 8:00 AM – 6:00 PM</p>
                  </div>
                </div>
                <a
                  href="tel:+251917559943"
                  className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1.5 rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
              </div>

              <div className="flex flex-col space-y-1">
                {navGroups.map((group) => (
                  <React.Fragment key={group.label}>
                    {group.path ? (
                      <Link
                        to={group.path}
                        className={`block px-4 py-2.5 text-base font-bold transition-colors ${
                          isActive(group.path) ? 'text-primary-600 bg-primary-50 rounded-lg' : 'text-gray-700 hover:text-primary-600'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {group.label}
                      </Link>
                    ) : (
                      <div className="space-y-1 px-4 py-2">
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{group.label}</p>
                         {group.items.map(sub => (
                           <Link
                            key={sub.path}
                            to={sub.path}
                            className={`block py-2 text-base font-medium transition-colors ${
                              isActive(sub.path) ? 'text-primary-600 font-semibold' : 'text-gray-600'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {sub.label}
                          </Link>
                         ))}
                      </div>
                    )}
                  </React.Fragment>
                ))}
                
                {/* Mobile Admin Link */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="mx-4 mt-3 flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    BAKERY DASHBOARD
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
