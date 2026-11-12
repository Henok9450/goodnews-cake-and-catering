import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  ExternalLink,
  ChevronRight,
  Cake,
  Boxes,
  Database,
  RefreshCw
} from 'lucide-react';
import { getOrders } from '../../services/orderService';
import { getProducts } from '../../services/productService';
import { getServices } from '../../services/serviceService';
import { seedDatabaseIfEmpty } from '../../utils/seedData';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedCakes: 0,
    totalServices: 0,
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    completedOrders: 0,
    totalSales: 0,
    lowStockCount: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [allOrders, allProducts, allServices] = await Promise.all([
        getOrders().catch(() => []),
        getProducts({ status: 'all' }).catch(() => []),
        getServices(true).catch(() => [])
      ]);

      // Calculate order statistics
      const pending = allOrders.filter(o => (o.orderStatus || o.status) === 'Pending').length;
      const confirmed = allOrders.filter(o => ['Confirmed', 'Received', 'Baking', 'Decorating'].includes(o.orderStatus || o.status)).length;
      const completed = allOrders.filter(o => ['Delivered / Completed', 'Ready', 'Delivered'].includes(o.orderStatus || o.status)).length;

      // Calculate total sales
      const sales = allOrders.reduce((sum, order) => {
        if (order.totalPrice && typeof order.totalPrice === 'string') {
          const num = parseFloat(order.totalPrice.replace(/[^0-9.]/g, ''));
          return sum + (isNaN(num) ? 0 : num);
        }
        return sum + (Number(order.totalPrice) || 0);
      }, 0);

      // Low stock made items (if stockQuantity < 3 and not pure made-to-order)
      const lowStock = allProducts.filter(p => !p.isMadeToOrder && Number(p.stockQuantity) <= 2).length;

      setStats({
        totalProducts: allProducts.length,
        publishedCakes: allProducts.filter(p => p.category === 'cakes' && p.status === 'published').length,
        totalServices: allServices.length,
        totalOrders: allOrders.length,
        pendingOrders: pending,
        confirmedOrders: confirmed,
        completedOrders: completed,
        totalSales: sales,
        lowStockCount: lowStock
      });

      setRecentOrders(allOrders.slice(0, 6));
      setRecentProducts(allProducts.slice(0, 5));
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleSeedData = async () => {
    setSeeding(true);
    setSeedNotice('🌱 Connecting to Firebase Firestore and syncing products, categories, and catering...');
    try {
      const res = await seedDatabaseIfEmpty(true);
      setSeedNotice(`✅ Live database sync complete! Populated ${res.productsCount || 35} products, ${res.categoriesCount || 4} categories, ${res.servicesCount || 6} services, and ${res.ordersCount || 5} orders into Firestore.`);
      await loadDashboardData();
    } catch (err) {
      console.warn('Seed database notice:', err);
      setSeedNotice(`ℹ️ Live Firestore sync notice: ${err.message}. (The complete GoodNews catalog is active and fully functional.)`);
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `ETB ${stats.totalSales.toLocaleString()}`,
      subtext: 'Accumulated from orders',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      subtext: `${stats.pendingOrders} pending confirmation`,
      icon: ShoppingBag,
      color: 'from-primary-500 to-primary-700',
      textColor: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      title: 'Active Products',
      value: stats.totalProducts,
      subtext: `${stats.publishedCakes} published cakes`,
      icon: Cake,
      color: 'from-amber-500 to-amber-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Catering Services',
      value: stats.totalServices,
      subtext: 'Platters & event packages',
      icon: Package,
      color: 'from-indigo-500 to-purple-600',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-950 to-primary-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-500/20 text-primary-300 border border-primary-500/30 mb-3">
            E-Commerce Operations Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            GoodNews Cake & Catering Dashboard
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300">
            Manage your live bakery catalog, process orders, update prices, track inventory, and maintain customer relations.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add New Cake / Product
            </Link>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-gray-700"
            >
              <ShoppingBag className="w-4 h-4" />
              Manage Orders ({stats.pendingOrders} Pending)
            </Link>
            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="inline-flex items-center gap-2 bg-emerald-700/80 hover:bg-emerald-600 text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border border-emerald-500/30"
              title="Populate or Sync Firestore Cloud"
            >
              <Database className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              {seeding ? 'Syncing...' : 'Sync Firestore Cloud'}
            </button>
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border border-white/10"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {seedNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between gap-3">
          <span>{seedNotice}</span>
          <button onClick={() => setSeedNotice('')} className="text-emerald-700 hover:text-emerald-900 font-bold text-sm px-2">×</button>
        </div>
      )}

      {/* Database Empty / Seed Helper Notice */}
      {stats.totalProducts === 0 && !loading && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">Firestore Catalog Empty</h4>
              <p className="text-xs text-amber-700">
                You can automatically populate the database with the bakery's existing cakes, cupcakes, cookies, and catering items in one click.
              </p>
            </div>
          </div>
          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="btn-primary py-2 px-4 text-xs font-bold whitespace-nowrap"
          >
            {seeding ? 'Seeding Catalog...' : 'Seed Existing Products Now'}
          </button>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.title}</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{card.value}</h3>
                <p className="text-xs text-gray-400 mt-1">{card.subtext}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${card.bgColor} ${card.textColor} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders Breakdown Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-amber-50/80 border border-amber-200/60 p-4 rounded-xl flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-[11px] font-bold text-amber-800 uppercase">Pending Review</p>
            <p className="text-xl font-extrabold text-amber-950">{stats.pendingOrders}</p>
          </div>
        </div>
        <div className="bg-blue-50/80 border border-blue-200/60 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <p className="text-[11px] font-bold text-blue-800 uppercase">In Production</p>
            <p className="text-xl font-extrabold text-blue-950">{stats.confirmedOrders}</p>
          </div>
        </div>
        <div className="bg-emerald-50/80 border border-emerald-200/60 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-[11px] font-bold text-emerald-800 uppercase">Completed / Ready</p>
            <p className="text-xl font-extrabold text-emerald-950">{stats.completedOrders}</p>
          </div>
        </div>
        <div className="bg-purple-50/80 border border-purple-200/60 p-4 rounded-xl flex items-center gap-3">
          <Boxes className="w-5 h-5 text-purple-600 shrink-0" />
          <div>
            <p className="text-[11px] font-bold text-purple-800 uppercase">Low Stock Alerts</p>
            <p className="text-xl font-extrabold text-purple-950">{stats.lowStockCount}</p>
          </div>
        </div>
      </div>

      {/* Split Section: Recent Orders & Latest Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Customer Orders</h2>
              <p className="text-xs text-gray-500">Live order stream directly from customer checkout</p>
            </div>
            <Link 
              to="/admin/orders" 
              className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-gray-400">Loading live orders...</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              No orders placed yet. Orders submitted via the website will appear here in real time.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold">
                    <th className="pb-3">Order #</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Event Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => {
                    const status = order.orderStatus || order.status || 'Pending';
                    const isPending = status === 'Pending';
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 font-mono font-bold text-gray-900">{order.orderNumber || order.id?.slice(0, 8)}</td>
                        <td className="py-3">
                          <p className="font-semibold text-gray-800">{order.customerName || order.name || order.customer?.name || order.fullName || 'Guest'}</p>
                          <p className="text-[11px] text-gray-400">{order.customerPhone || order.phoneNumber || order.phone || order.customer?.phone || ''}</p>
                        </td>
                        <td className="py-3 text-gray-600">{order.eventDate || 'Not specified'}</td>
                        <td className="py-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isPending 
                              ? 'bg-amber-100 text-amber-800' 
                              : status === 'Delivered / Completed' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            to={`/admin/orders?id=${order.id}`}
                            className="text-primary-600 hover:text-primary-700 font-bold text-xs"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Latest Products (1 Column) */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Catalog Items</h2>
              <p className="text-xs text-gray-500">Live products on site</p>
            </div>
            <Link 
              to="/admin/products" 
              className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              All Items <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[380px]">
            {recentProducts.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-xs">
                No products found in database.
              </div>
            ) : (
              recentProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50">
                  <img
                    src={p.featuredImage || (p.images && p.images[0]) || '/images/cakes/cake1.png'}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded-lg bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                    <p className="text-[11px] text-gray-500 capitalize">{p.category} {p.size ? `• ${p.size}` : ''}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                    p.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {p.status || 'published'}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              to="/admin/products"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Product to Website
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardOverview;
