import React, { useState, useEffect } from 'react';
import { Boxes, Search, AlertCircle, Check, ArrowUpDown, RefreshCw, Plus, Minus } from 'lucide-react';
import { getProducts, updateProduct } from '../../services/productService';

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'low-stock', 'made-to-order'
  const [notification, setNotification] = useState({ type: '', message: '' });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await getProducts({ status: 'all' });
      setProducts(data);
    } catch (err) {
      showNotification('error', 'Failed to fetch inventory: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const handleAdjustStock = async (product, delta) => {
    const current = Number(product.stockQuantity) || 0;
    const newStock = Math.max(0, current + delta);
    try {
      await updateProduct(product.id, { stockQuantity: newStock });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stockQuantity: newStock } : p));
      showNotification('success', `Adjusted stock for "${product.name}" to ${newStock}`);
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  const handleToggleMadeToOrder = async (product) => {
    const newMadeToOrder = !product.isMadeToOrder;
    try {
      await updateProduct(product.id, { isMadeToOrder: newMadeToOrder });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isMadeToOrder: newMadeToOrder } : p));
      showNotification('success', `"${product.name}" marked as ${newMadeToOrder ? 'Made-to-Order' : 'Standard Inventory'}`);
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = !search.trim() || p.name?.toLowerCase().includes(search.toLowerCase());
    if (filter === 'low-stock') {
      return matchesSearch && !p.isMadeToOrder && (Number(p.stockQuantity) || 0) <= 2;
    }
    if (filter === 'made-to-order') {
      return matchesSearch && p.isMadeToOrder;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Inventory & Stock Control</h1>
          <p className="text-xs text-gray-500 mt-1">Manage stock levels, out-of-stock indicators, and made-to-order cake settings</p>
        </div>
        <button
          onClick={fetchInventory}
          disabled={loading}
          className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-2xs self-start"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {notification.message && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
          notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
          {notification.message}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {['all', 'low-stock', 'made-to-order'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400">Loading inventory...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-xs">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Model</th>
                  <th className="py-3.5 px-4">Current Stock</th>
                  <th className="py-3.5 px-4">Quick Adjust</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredProducts.map(product => {
                  const isMadeToOrder = product.isMadeToOrder;
                  const stock = Number(product.stockQuantity) || 0;
                  const isLow = !isMadeToOrder && stock <= 2;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.featuredImage || (product.images && product.images[0]) || '/images/cakes/cake1.png'}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <span className="font-bold text-gray-900">{product.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 capitalize">{product.category}</td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleMadeToOrder(product)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                            isMadeToOrder ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {isMadeToOrder ? 'Made to Order' : 'Track Stock'}
                        </button>
                      </td>

                      <td className="py-3 px-4">
                        {isMadeToOrder ? (
                          <span className="text-gray-400 italic">Fresh on Order</span>
                        ) : (
                          <span className={`font-mono font-bold text-sm ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                            {stock} unit(s)
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {!isMadeToOrder && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleAdjustStock(product, -1)}
                              className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                              title="Decrease 1"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleAdjustStock(product, 1)}
                              className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                              title="Increase 1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleAdjustStock(product, 5)}
                              className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-[10px] font-bold text-gray-700"
                              title="Add 5"
                            >
                              +5
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {isMadeToOrder ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Always Available
                          </span>
                        ) : isLow ? (
                          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Low Stock
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
