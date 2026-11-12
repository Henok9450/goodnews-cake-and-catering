import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, ShoppingBag, Calendar, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import { getOrders } from '../../services/orderService';

const FIRESTORE_RULES_GUIDE = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isAdmin() { return isAuthenticated(); }

    match /admins/{adminId} { allow read, write: if isAuthenticated(); }
    match /products/{productId} { allow read: if true; allow write: if isAdmin(); }
    match /categories/{categoryId} { allow read: if true; allow write: if isAdmin(); }
    match /services/{serviceId} { allow read: if true; allow write: if isAdmin(); }
    match /website_content/{contentId} { allow read: if true; allow write: if isAdmin(); }
    match /reviews/{reviewId} { allow read, create: if true; allow update, delete: if isAdmin(); }
    match /gallery_photos/{photoId} { allow read: if true; allow write: if isAdmin(); }
    match /promotions/{promoId} { allow read: if true; allow write: if isAdmin(); }
    match /payment_settings/{settingId} { allow read: if true; allow write: if isAdmin(); }
    match /customers/{customerId} { allow read, write: if isAuthenticated(); }
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if isAuthenticated();
    }
  }
}`;

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [permissionError, setPermissionError] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);

  const fetchCustomerData = async () => {
    setLoading(true);
    setPermissionError(false);
    try {
      const orders = await getOrders();
      
      // Group orders by phone or email or name to build customer profiles
      const customerMap = {};

      orders.forEach(order => {
        const key = (order.phoneNumber || order.customerPhone || order.phone || order.customerEmail || order.email || order.customerName || order.name || order.id || 'guest').trim().toLowerCase();
        if (!customerMap[key]) {
          customerMap[key] = {
            id: key,
            name: order.customerName || order.name || order.customer?.name || order.fullName || 'Customer',
            phone: order.customerPhone || order.phoneNumber || order.phone || order.customer?.phone || '',
            email: order.customerEmail || order.email || order.customer?.email || '',
            address: order.deliveryAddress || order.address || order.customer?.address || order.location || '',
            ordersCount: 0,
            totalSpent: 0,
            lastOrderDate: order.eventDate || order.deliveryDate || order.orderDate || (order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : '') || '',
            orders: []
          };
        }

        customerMap[key].ordersCount += 1;
        customerMap[key].orders.push(order);

        // Add spent
        if (order.totalPrice && typeof order.totalPrice === 'string') {
          const num = parseFloat(order.totalPrice.replace(/[^0-9.]/g, ''));
          if (!isNaN(num)) customerMap[key].totalSpent += num;
        } else if (typeof order.totalPrice === 'number') {
          customerMap[key].totalSpent += order.totalPrice;
        } else if (typeof order.total === 'number') {
          customerMap[key].totalSpent += order.total;
        } else if (typeof order.amount === 'number') {
          customerMap[key].totalSpent += order.amount;
        }
      });

      setCustomers(Object.values(customerMap));
    } catch (err) {
      console.error('Error fetching customers:', err);
      if (err.message && err.message.toLowerCase().includes('permission')) {
        setPermissionError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRules = () => {
    try {
      navigator.clipboard.writeText(FIRESTORE_RULES_GUIDE);
      setCopiedRules(true);
      setTimeout(() => setCopiedRules(false), 4000);
    } catch (e) {}
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const filteredCustomers = customers.filter(c => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    const nameMatch = c.name ? String(c.name).toLowerCase().includes(term) : false;
    const phoneMatch = c.phone ? String(c.phone).toLowerCase().includes(term) : false;
    const emailMatch = c.email ? String(c.email).toLowerCase().includes(term) : false;
    return nameMatch || phoneMatch || emailMatch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Customer Directory</h1>
          <p className="text-xs text-gray-500 mt-1">Manage guest and registered customer order histories and contact profiles</p>
        </div>
        <button
          onClick={fetchCustomerData}
          disabled={loading}
          className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-2xs self-start"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {permissionError && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 shadow-xs animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-800 shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-amber-950">Firebase Security Rules Permission Notice</h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Customer profiles are automatically compiled from your real customer orders in Firebase Firestore. Reading the <code>orders</code> collection was denied by your Firebase Console Security Rules.
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5 items-center">
                <button
                  type="button"
                  onClick={handleCopyRules}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  {copiedRules ? '✓ Security Rules Copied to Clipboard!' : 'Copy Firestore Rules for Firebase Console'}
                </button>
                <button
                  type="button"
                  onClick={fetchCustomerData}
                  className="px-4 py-2 bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 rounded-xl text-xs font-bold transition-all"
                >
                  Retry Connection
                </button>
              </div>
              <p className="text-[11px] text-amber-700 mt-2">
                Open <strong>Firebase Console &gt; Firestore Database &gt; Rules</strong>, paste, and click <strong>Publish</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone number, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <span className="text-xs text-gray-500 font-semibold hidden sm:inline">
          {filteredCustomers.length} Customer{filteredCustomers.length !== 1 ? 's' : ''} Found
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400">Loading customers...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-xs">No customer records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Total Orders</th>
                  <th className="py-3.5 px-4">Total Spent</th>
                  <th className="py-3.5 px-4">Delivery Address</th>
                  <th className="py-3.5 px-4 text-right">History</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredCustomers.map((customer, i) => (
                  <tr key={i} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center shrink-0">
                          {customer.name[0]?.toUpperCase() || 'C'}
                        </div>
                        <span className="font-bold text-gray-900">{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{customer.phone || '-'}</td>
                    <td className="py-3.5 px-4 text-gray-600">{customer.email || '-'}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-gray-100 text-gray-800 font-bold px-2.5 py-1 rounded-full text-[11px]">
                        {customer.ordersCount} order(s)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      ETB {customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate">{customer.address || 'Pickup'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="text-primary-600 hover:text-primary-700 font-bold text-xs"
                      >
                        View Orders
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Orders History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-fade-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">{selectedCustomer.name}</h3>
                <p className="text-xs text-gray-500">{selectedCustomer.phone} • {selectedCustomer.email || 'No email'}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-1 text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Past Orders ({selectedCustomer.orders.length})</p>
              {selectedCustomer.orders.map((o, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-900">#{o.orderNumber || o.id?.slice(0, 8)}</p>
                    <p className="text-[11px] text-gray-500">{o.eventDate || o.orderDate} • {o.orderStatus || o.status || 'Pending'}</p>
                  </div>
                  <span className="font-bold text-gray-900">{o.totalPrice || 'Quote on Request'}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-3 border-t border-gray-100 text-right">
              <button onClick={() => setSelectedCustomer(null)} className="btn-primary py-2 px-4 rounded-xl text-xs font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerManagement;
