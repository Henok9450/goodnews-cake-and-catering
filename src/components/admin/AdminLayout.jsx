import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Cake, 
  FolderTree, 
  Briefcase, 
  ShoppingBag, 
  Users, 
  Boxes, 
  CreditCard, 
  Tag, 
  Image as ImageIcon, 
  MessageSquare, 
  Globe, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Bell
} from 'lucide-react';


class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-2xl mx-auto my-12 bg-white rounded-2xl border border-red-200 shadow-md text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Module Notice</h2>
          <p className="text-xs text-gray-500 mb-6 font-mono bg-gray-50 p-3 rounded-lg border border-gray-200 overflow-x-auto text-left">
            {this.state.error?.message || 'Component failed to load'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold shadow-md"
          >
            Reload Module
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, adminProfile, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products & Cakes', path: '/admin/products', icon: Cake },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Services & Catering', path: '/admin/services', icon: Briefcase },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Promotions', path: '/admin/promotions', icon: Tag },
    { name: 'Photo Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { name: 'Website Content', path: '/admin/content', icon: Globe },
    { name: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get current section name for breadcrumb
  const currentNav = navigation.find(item => isActive(item)) || { name: 'Admin Dashboard' };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans">
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden bg-gray-900 text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white focus:outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-wide text-white">GoodNews</span>
            <span className="text-xs bg-primary-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-white">Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            target="_blank" 
            className="p-2 text-gray-400 hover:text-white rounded-lg bg-gray-800"
            title="Open Public Site"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button 
            onClick={handleLogout} 
            className="p-2 text-red-400 hover:text-red-300 rounded-lg bg-gray-800"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-gray-900 text-gray-300 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-base leading-tight">GoodNews Cake</h1>
              <p className="text-[11px] font-semibold text-primary-400 uppercase tracking-wider">Control Center</p>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {navigation.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  active 
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md shadow-primary-600/30' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-white' : 'text-gray-400 group-hover:text-primary-400'}`} />
                <span className="flex-1 truncate">{item.name}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 text-white/70 shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold text-sm">
              {(adminProfile?.displayName || user?.displayName || user?.email || 'A')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {adminProfile?.displayName || user?.displayName || 'Administrator'}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-gray-800/60">
            <Link
              to="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors border border-red-500/20"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              Exit
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* DESKTOP TOP HEADER */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200/80 sticky top-0 z-30 shadow-xs">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-medium text-gray-400">Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-bold text-gray-900">{currentNav.name}</span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Firebase Store Connection
            </div>

            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3.5 py-1.5 rounded-lg transition-colors border border-primary-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Public Website
            </Link>
          </div>
        </header>

        {/* DYNAMIC SUBPAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <AdminErrorBoundary>
            <Outlet />
          </AdminErrorBoundary>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
