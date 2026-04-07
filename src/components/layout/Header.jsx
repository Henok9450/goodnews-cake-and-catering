import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Phone, Menu, X, User, ChevronDown, LayoutDashboard } from 'lucide-react';
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'py-2 bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20' 
        : 'py-4 bg-white shadow-sm'
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* LOGO SECTION */}
          <Link to="/" className="flex items-center shrink-0" onClick={() => setIsMenuOpen(false)}>
            <img
              src="/images/logo/logo3.png"
              alt="GoodNews Cake"
              className={`transition-all duration-300 ${isScrolled ? 'h-12' : 'h-16'} w-auto object-contain`} 
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
          <div className="flex items-center space-x-2 md:space-x-4">
            
            {/* CALL BUTTON (Refined) */}
            <a
              href="tel:+251917559943"
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all"
              title="Call Bakery"
            >
              <Phone className="h-5 w-5" />
            </a>

            {/* ADMIN PILL (Exclusive) */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden lg:flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                ADMIN DASHBOARD
              </Link>
            )}

            {/* CART (Sleek Circle) */}
            <button
              className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartCount() > 0 && (
                <span className="absolute top-1 right-1 bg-primary-600 text-white rounded-full text-[10px] font-bold w-5 h-5 flex items-center justify-center border-2 border-white">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* AUTH / PROFILE */}
            {!loading && (
              user ? (
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all border border-gray-200"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white overflow-hidden shadow-inner">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <span className="hidden sm:block text-xs font-bold text-gray-700 tracking-tight">MY ACCOUNT</span>
                </Link>
              ) : (
                <button
                  onClick={() => loginWithGoogle()}
                  className="px-5 py-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-all text-sm font-bold shadow-sm active:scale-95 flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )
            )}

            {/* MOBILE MENU TOGGLE */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-6 border-t border-gray-100 animate-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col space-y-1 pt-4">
              {navGroups.map((group) => (
                <React.Fragment key={group.label}>
                  {group.path ? (
                    <Link
                      to={group.path}
                      className={`block px-4 py-3 text-base font-bold transition-colors ${
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
                          className={`block py-3 text-base font-medium transition-colors ${
                            isActive(sub.path) ? 'text-primary-600' : 'text-gray-600'
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
                  className="mx-4 mt-4 flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-4 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all"
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
    </header>
  );
};

export default Header;
