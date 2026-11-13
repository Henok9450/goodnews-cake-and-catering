import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Phone, 
  Menu, 
  X, 
  User, 
  ChevronDown, 
  LayoutDashboard, 
  Clock, 
  Sparkles,
  Cake,
  UtensilsCrossed,
  Truck,
  Star,
  BookOpen
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAttention, setShowAttention] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { user, loginWithGoogle, loading, isAdmin } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle(false);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') return;
      if (err.code === 'auth/unauthorized-domain') {
        alert('Domain not authorized in Firebase: Please add "goodnews-cake-and-catering.vercel.app" to Authorized Domains in Firebase Console > Authentication > Settings.');
      } else {
        alert('Google Sign-In: ' + (err.message || 'Please check your connection and try again.'));
      }
    }
  };

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

  // First-visit attention tooltip and gentle pulse
  useEffect(() => {
    try {
      const discovered = localStorage.getItem('goodnews_menu_discovered');
      if (!discovered) {
        setShowAttention(true);
        const timer = setTimeout(() => {
          setShowAttention(false);
          try { localStorage.setItem('goodnews_menu_discovered', 'true'); } catch (e) {}
        }, 8000);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  const dismissAttention = (e) => {
    if (e) e.stopPropagation();
    setShowAttention(false);
    try { localStorage.setItem('goodnews_menu_discovered', 'true'); } catch (e) {}
  };

  const handleMenuToggle = () => {
    const next = !isMenuOpen;
    setIsMenuOpen(next);
    if (showAttention) {
      dismissAttention();
    }
  };

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
                className={`transition-all duration-300 ${isScrolled ? 'h-9 sm:h-11 md:h-12' : 'h-10 sm:h-12 md:h-14 lg:h-16'} max-w-[120px] xs:max-w-[150px] sm:max-w-[190px] md:max-w-none w-auto object-contain`} 
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
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              
              {/* CALL BUTTON */}
              <a
                href="tel:+251917559943"
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all flex items-center justify-center min-w-[36px] min-h-[36px]"
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
                className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all flex items-center justify-center min-w-[36px] min-h-[36px]"
                onClick={() => navigate('/cart')}
                title="Cart"
                aria-label={`Cart, ${getCartCount()} items`}
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                {getCartCount() > 0 && (
                  <span className="absolute 0 top-0.5 right-0.5 bg-primary-600 text-white rounded-full text-[9px] sm:text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border-2 border-white shadow-xs">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {/* AUTH / PROFILE */}
              {!loading && (
                user ? (
                  <Link
                    to="/profile"
                    className="flex items-center gap-1.5 p-1 sm:pr-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all border border-gray-200 min-h-[36px]"
                    title="My Account"
                    aria-label="My Account"
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
                    onClick={handleGoogleSignIn}
                    className="hidden sm:flex px-3 py-1.5 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-all text-xs font-bold shadow-sm active:scale-95 items-center gap-1.5 min-h-[36px]"
                    title="Sign In with Google"
                    aria-label="Sign In with Google"
                  >
                    <User className="h-3.5 w-3.5 shrink-0" />
                    <span>Sign In</span>
                  </button>
                )
              )}

              {/* ENHANCED MOBILE MENU TOGGLE (With prominent MENU label and 44x44 tap target) */}
              <div className="relative lg:hidden">
                <button
                  id="mobile-menu-toggle-btn"
                  className={`min-h-[44px] min-w-[44px] px-2.5 sm:px-3 py-1.5 flex items-center justify-center gap-1.5 rounded-full font-bold transition-all border ${
                    isMenuOpen 
                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm' 
                      : 'bg-gray-100 hover:bg-primary-50 text-gray-900 hover:text-primary-600 border-gray-200 shadow-2xs'
                  } ${showAttention && !isMenuOpen ? 'ring-2 ring-primary-500 ring-offset-2 animate-pulse' : ''}`}
                  onClick={handleMenuToggle}
                  aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-navigation-drawer"
                >
                  {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider select-none">
                    {isMenuOpen ? 'Close' : 'Menu'}
                  </span>
                </button>

                {/* Subtle First-Visit Onboarding Tooltip */}
                {showAttention && !isMenuOpen && (
                  <div 
                    role="tooltip"
                    className="absolute right-0 top-full mt-2.5 z-50 bg-gray-900 text-white px-3.5 py-2 rounded-xl shadow-xl border border-gray-700 flex items-center gap-2 text-xs animate-in fade-in zoom-in-95 duration-200 max-w-[240px] xs:max-w-none"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                    <span className="font-semibold text-gray-100 text-[11px] leading-tight">
                      Explore our Cakes &amp; Catering
                    </span>
                    <button 
                      onClick={dismissAttention}
                      aria-label="Dismiss navigation tip" 
                      className="text-gray-400 hover:text-white p-0.5 rounded-md hover:bg-gray-800 ml-1 shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ENHANCED EXPANDED MOBILE NAVIGATION DRAWER */}
        {isMenuOpen && (
          <nav 
            id="mobile-navigation-drawer"
            className="lg:hidden max-h-[calc(100vh-6.5rem)] overflow-y-auto overscroll-contain pb-8 border-t border-gray-100 animate-in slide-in-from-top-4 duration-300 bg-white shadow-xl"
          >
            <div className="p-4 space-y-5">
              
              {/* Bakery Operating Hours & Quick Call Card */}
              <div className="p-3.5 bg-gradient-to-r from-gray-50 to-primary-50/30 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bakeryStatus.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      {bakeryStatus.isOpen ? 'Bakery is Open Now' : 'Bakery is Closed'}
                    </p>
                    <p className="text-[11px] text-gray-500">Mon-Sun: 8:00 AM – 6:00 PM EAT</p>
                  </div>
                </div>
                <a
                  href="tel:+251917559943"
                  className="text-xs font-bold text-primary-700 bg-white border border-primary-200 px-3 py-1.5 rounded-xl hover:bg-primary-50 transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-primary-600" /> Call
                </a>
              </div>

              {/* Section 1: Artisanal Cakes & Treats */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2">
                  Artisanal Cakes &amp; Treats
                </p>
                <div className="grid grid-cols-1 gap-1">
                  <Link
                    to="/gallery"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      isActive('/gallery') ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                        <Cake className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">All Celebration Cakes</p>
                        <p className="text-[11px] text-gray-500">Birthday, Wedding, Anniversary &amp; Custom</p>
                      </div>
                    </div>
                    <span className="text-xs text-primary-600 font-bold">Browse &rarr;</span>
                  </Link>

                  <Link
                    to="/cupcakes"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      isActive('/cupcakes') ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Artisanal Cupcakes</p>
                        <p className="text-[11px] text-gray-500">Boxed treats, buttercream &amp; toppings</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/cookies"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      isActive('/cookies') ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                        <span className="text-sm">🍪</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Handcrafted Cookies</p>
                        <p className="text-[11px] text-gray-500">Freshly baked chocolate chip, crinkles &amp; more</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/seasonal"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      isActive('/seasonal') ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                        <span className="text-sm">✨</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Seasonal &amp; Holiday Specials</p>
                        <p className="text-[11px] text-gray-500">Fasika, Enkutatash &amp; Holiday limited editions</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Section 2: Specialty & Events */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2">
                  Specialty &amp; Event Services
                </p>
                <div className="grid grid-cols-1 gap-1">
                  <Link
                    to="/custom-order"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      isActive('/custom-order') ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-800 flex items-center justify-center">
                        <span className="text-sm">👑</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Custom Cake Builder</p>
                        <p className="text-[11px] text-gray-500">Design your dream cake with flavors &amp; theme</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Custom</span>
                  </Link>

                  <Link
                    to="/catering"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      isActive('/catering') ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                        <UtensilsCrossed className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Catering &amp; Event Services</p>
                        <p className="text-[11px] text-gray-500">Savory platters, sambusas, finger food &amp; buffet</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Events</span>
                  </Link>
                </div>
              </div>

              {/* Section 3: Customer Care & Info */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2">
                  Customer Care &amp; Tracking
                </p>
                <div className="grid grid-cols-1 gap-1">
                  <Link
                    to="/track"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isActive('/track') ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Track Order Status</p>
                      <p className="text-[11px] text-gray-500">Real-time live bakery &amp; delivery progress</p>
                    </div>
                  </Link>

                  <Link
                    to="/reviews"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isActive('/reviews') ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Customer Testimonials</p>
                      <p className="text-[11px] text-gray-500">Read verified customer reviews</p>
                    </div>
                  </Link>

                  <Link
                    to="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isActive('/about') ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">About GoodNews Bakery</p>
                      <p className="text-[11px] text-gray-500">Our ingredients, artisanal values &amp; team</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Sign In button in Mobile Drawer */}
              {!loading && !user && (
                <button
                  onClick={() => { setIsMenuOpen(false); handleGoogleSignIn(); }}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-3 rounded-xl text-xs font-bold hover:bg-primary-700 transition-all shadow-md active:scale-95 mt-4"
                >
                  <User className="w-4 h-4" />
                  SIGN IN WITH GOOGLE
                </button>
              )}

              {/* Admin Link in Mobile Drawer */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
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
