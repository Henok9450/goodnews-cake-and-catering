import React, { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, Calendar, ShoppingBag, DollarSign, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { getOrders } from '../../services/orderService';
import { getProducts } from '../../services/productService';

const ReportsAnalytics = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all'); // '7days', '30days', 'all'

  const loadData = async () => {
    setLoading(true);
    try {
      const [allOrders, allProducts] = await Promise.all([
        getOrders(),
        getProducts({ status: 'all' })
      ]);
      setOrders(allOrders);
      setProducts(allProducts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter orders by date range
  const filteredOrders = orders.filter(o => {
    if (dateRange === 'all') return true;
    const orderDate = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.eventDate || Date.now());
    const now = new Date();
    const daysDiff = (now - orderDate) / (1000 * 60 * 60 * 24);
    if (dateRange === '7days') return daysDiff <= 7;
    if (dateRange === '30days') return daysDiff <= 30;
    return true;
  });

  // Calculate metrics
  const totalRevenue = filteredOrders.reduce((sum, o) => {
    if (o.totalPrice && typeof o.totalPrice === 'string') {
      const num = parseFloat(o.totalPrice.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(num) ? 0 : num);
    }
    return sum + (Number(o.totalPrice) || 0);
  }, 0);

  const statusCounts = filteredOrders.reduce((acc, o) => {
    const st = o.orderStatus || o.status || 'Pending';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  // Best selling products extraction
  const productSalesMap = {};
  filteredOrders.forEach(o => {
    if (Array.isArray(o.items)) {
      o.items.forEach(item => {
        const title = item.title || item.orderType || 'Item';
        productSalesMap[title] = (productSalesMap[title] || 0) + (Number(item.details?.quantity) || 1);
      });
    }
  });

  const topProducts = Object.entries(productSalesMap)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const exportCSV = () => {
    if (filteredOrders.length === 0) return;
    const headers = ['Order Number', 'Customer', 'Phone', 'Event Date', 'Total Amount', 'Status', 'Payment Status'];
    const rows = filteredOrders.map(o => [
      `"${o.orderNumber || o.id}"`,
      `"${o.name || o.customer?.name || ''}"`,
      `"${o.phone || o.customer?.phone || ''}"`,
      `"${o.eventDate || o.deliveryDate || ''}"`,
      `"${o.totalPrice || 'Quote'}"`,
      `"${o.orderStatus || o.status || 'Pending'}"`,
      `"${o.paymentStatus || 'Pending'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `goodnews_orders_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Reports & Performance Analytics</h1>
          <p className="text-xs text-gray-500 mt-1">Real-time revenue metrics, order status breakdowns, and CSV data export</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none shadow-2xs"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="all">All Time Records</option>
          </select>
          <button
            onClick={exportCSV}
            className="btn-primary py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reported Revenue</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">ETB {totalRevenue.toLocaleString()}</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">From completed & active orders</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Volume</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{filteredOrders.length}</h3>
            <p className="text-xs text-primary-600 font-semibold mt-1">Orders in selected period</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average Order Value</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
              ETB {filteredOrders.length > 0 ? Math.round(totalRevenue / filteredOrders.length).toLocaleString() : 0}
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-1">Per transaction average</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Status Distribution & Top Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <h2 className="text-base font-extrabold text-gray-900 mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percent = Math.round((count / (filteredOrders.length || 1)) * 100);
              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>{status}</span>
                    <span>{count} orders ({percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Ordered Items */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <h2 className="text-base font-extrabold text-gray-900 mb-4">Most Popular Cake & Catering Items</h2>
          {topProducts.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No item frequency records in this date range.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                  <span className="font-bold text-gray-900">{item.name}</span>
                  <span className="bg-primary-50 text-primary-700 font-extrabold px-3 py-1 rounded-lg">
                    {item.qty} units ordered
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ReportsAnalytics;
