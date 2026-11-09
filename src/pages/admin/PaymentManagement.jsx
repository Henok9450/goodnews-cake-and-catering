import React, { useState, useEffect } from 'react';
import { CreditCard, Check, AlertCircle, RefreshCw, Smartphone, Landmark, Banknote, ShieldCheck } from 'lucide-react';
import { getOrders, updatePaymentStatus } from '../../services/orderService';
import { getContentSection, updateContentSection } from '../../services/contentService';

const PaymentManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentConfig, setPaymentConfig] = useState({
    cashOnDelivery: true,
    telebirrEnabled: true,
    telebirrNumber: '+251 917 559 943',
    cbeEnabled: true,
    cbeAccount: '1000123456789 (GoodNews Bakery)',
    instructions: 'Please include your Order Number as the transfer remark.'
  });
  const [savingConfig, setSavingConfig] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [allOrders, config] = await Promise.all([
        getOrders(),
        getContentSection('payment_settings')
      ]);
      setOrders(allOrders);
      if (config) {
        setPaymentConfig(prev => ({ ...prev, ...config }));
      }
    } catch (err) {
      console.error('Error loading payment info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      await updateContentSection('payment_settings', paymentConfig);
      showNotification('success', 'Payment options and bank accounts updated successfully!');
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setSavingConfig(false);
    }
  };

  const handleVerifyPayment = async (orderId, newStatus) => {
    try {
      await updatePaymentStatus(orderId, newStatus, '', 'Admin Manual Verification');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: newStatus } : o));
      showNotification('success', `Payment marked as ${newStatus}`);
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Payment Methods & Verification</h1>
        <p className="text-xs text-gray-500 mt-1">Configure accepted payment channels (Telebirr, CBE, Cash) and manually verify customer payments</p>
      </div>

      {notification.message && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
          notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
          {notification.message}
        </div>
      )}

      {/* Payment Channels Configuration */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
        <h2 className="text-base font-extrabold text-gray-900 mb-1">Customer Payment Channels</h2>
        <p className="text-xs text-gray-500 mb-6">These options and instructions are presented to customers during checkout.</p>

        <form onSubmit={handleSaveConfig} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Telebirr */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                  <Smartphone className="w-4 h-4 text-primary-600" />
                  Telebirr
                </div>
                <input
                  type="checkbox"
                  checked={paymentConfig.telebirrEnabled}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, telebirrEnabled: e.target.checked })}
                  className="rounded text-primary-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Merchant / Phone Number</label>
                <input
                  type="text"
                  value={paymentConfig.telebirrNumber}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, telebirrNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* CBE */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                  <Landmark className="w-4 h-4 text-primary-600" />
                  CBE Bank Transfer
                </div>
                <input
                  type="checkbox"
                  checked={paymentConfig.cbeEnabled}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, cbeEnabled: e.target.checked })}
                  className="rounded text-primary-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Account Number & Name</label>
                <input
                  type="text"
                  value={paymentConfig.cbeAccount}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, cbeAccount: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Cash on Delivery */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  Cash on Delivery / Pickup
                </div>
                <input
                  type="checkbox"
                  checked={paymentConfig.cashOnDelivery}
                  onChange={(e) => setPaymentConfig({ ...paymentConfig, cashOnDelivery: e.target.checked })}
                  className="rounded text-primary-600"
                />
              </div>
              <p className="text-xs text-gray-500">
                Allow customers to pay in cash upon receiving their cake or pickup at the bakery.
              </p>
            </div>

          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Payment Instructions to Customer</label>
            <input
              type="text"
              value={paymentConfig.instructions}
              onChange={(e) => setPaymentConfig({ ...paymentConfig, instructions: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={savingConfig}
              className="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold shadow-md"
            >
              {savingConfig ? 'Saving...' : 'Save Payment Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Orders Awaiting Payment Verification */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
        <h2 className="text-base font-extrabold text-gray-900 mb-1">Recent Order Payment Verifications</h2>
        <p className="text-xs text-gray-500 mb-6">Review payment statuses and mark bank transfers or Telebirr payments as confirmed.</p>

        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">Loading payment records...</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400">No payment records yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {orders.slice(0, 10).map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">
                      {order.orderNumber || order.id?.slice(0, 8)}
                    </td>
                    <td className="py-3 px-4">{order.name || order.customer?.name || 'Guest'}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{order.totalPrice || 'Quote'}</td>
                    <td className="py-3 px-4 text-gray-600">{order.paymentMethod || 'Offline / Transfer'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.paymentStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {order.paymentStatus !== 'Paid' ? (
                        <button
                          onClick={() => handleVerifyPayment(order.id, 'Paid')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
                        >
                          Mark as Paid
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerifyPayment(order.id, 'Pending')}
                          className="text-xs text-gray-400 hover:text-gray-600 font-semibold"
                        >
                          Revert to Pending
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;
