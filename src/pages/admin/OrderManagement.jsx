import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Phone, 
  MapPin, 
  Calendar, 
  Printer, 
  MessageSquare, 
  Check, 
  Ban, 
  CreditCard,
  ChevronRight,
  RefreshCw,
  FileText
} from 'lucide-react';
import { 
  getOrders, 
  updateOrderStatus, 
  updatePaymentStatus, 
  cancelOrder, 
  ORDER_STATUSES, 
  PAYMENT_STATUSES 
} from '../../services/orderService';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status Update state
  const [updating, setUpdating] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Notification
  const [notification, setNotification] = useState({ type: '', message: '' });

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);

      // If URL has ?id=..., auto-select that order
      const paramId = searchParams.get('id');
      if (paramId) {
        const found = data.find(o => o.id === paramId || o.orderNumber === paramId);
        if (found) setSelectedOrder(found);
      }
    } catch (err) {
      showNotification('error', 'Failed to fetch orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [searchParams]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 5000);
  };

  const handleStatusChangeSubmit = async (statusToSet) => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await updateOrderStatus(selectedOrder.id, statusToSet, adminNote);
      showNotification('success', `Order #${selectedOrder.orderNumber} status changed to ${statusToSet}`);
      setAdminNote('');
      await fetchAllOrders();
      // Update selected order view
      setSelectedOrder(prev => ({
        ...prev,
        orderStatus: statusToSet,
        status: statusToSet
      }));
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentChange = async (newPayStatus) => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await updatePaymentStatus(selectedOrder.id, newPayStatus);
      showNotification('success', `Payment status updated to ${newPayStatus}`);
      await fetchAllOrders();
      setSelectedOrder(prev => ({ ...prev, paymentStatus: newPayStatus }));
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrderSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !cancellationReason.trim()) return;
    setUpdating(true);
    try {
      await cancelOrder(selectedOrder.id, cancellationReason);
      showNotification('success', `Order cancelled with reason recorded.`);
      setShowCancelModal(false);
      setCancellationReason('');
      await fetchAllOrders();
      setSelectedOrder(prev => ({ ...prev, orderStatus: 'Cancelled', status: 'Cancelled' }));
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const filteredOrders = orders.filter(order => {
    const currentStatus = order.orderStatus || order.status || 'Pending';
    const matchesStatus = statusFilter === 'All' || currentStatus === statusFilter;
    const term = search.toLowerCase().trim();
    const matchesSearch = !term ||
      (order.orderNumber && order.orderNumber.toLowerCase().includes(term)) ||
      (order.name && order.name.toLowerCase().includes(term)) ||
      (order.phone && order.phone.includes(term)) ||
      (order.customer?.name && order.customer.name.toLowerCase().includes(term));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-xs text-gray-500 mt-1">Review live orders, update bakery workflow statuses, and manage payments</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAllOrders}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-2xs"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {notification.message && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
          notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order #, customer name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs text-gray-400 font-medium">Status:</span>
          {['All', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === st 
                  ? 'bg-gray-900 text-white shadow-xs' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-xs">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-gray-400" />
            No customer orders matching this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Delivery / Event Date</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Order Status</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredOrders.map(order => {
                  const status = order.orderStatus || order.status || 'Pending';
                  const isPending = status === 'Pending';
                  const isCancelled = status === 'Cancelled';
                  const isDone = status.includes('Delivered') || status.includes('Ready');

                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      className={`hover:bg-gray-50/80 cursor-pointer transition-colors ${
                        selectedOrder?.id === order.id ? 'bg-primary-50/40' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        {order.orderNumber || order.id?.slice(0, 8)}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-gray-900">{order.name || order.customer?.name || 'Guest Customer'}</p>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {order.phone || order.customer?.phone || 'No phone'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{order.eventDate || order.deliveryDate || 'Not specified'}</span>
                        </div>
                        {order.deliveryTime && (
                          <p className="text-[11px] text-gray-400 mt-0.5">{order.deliveryTime}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {order.totalPrice || 'Quote on Request'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isPending 
                            ? 'bg-amber-100 text-amber-800' 
                            : isCancelled 
                            ? 'bg-red-100 text-red-700' 
                            : isDone 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[11px] font-bold ${
                          order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-gray-500'
                        }`}>
                          {order.paymentStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                          className="btn-primary py-1 px-3 rounded-lg text-xs font-bold"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ORDER DETAILS DRAWER / MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
          <div className="bg-white h-full max-w-xl w-full p-6 sm:p-8 shadow-2xl overflow-y-auto flex flex-col justify-between animate-fade-in custom-scrollbar">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <span className="text-[11px] font-bold text-primary-600 uppercase tracking-wider">Order Details</span>
                  <h2 className="text-xl font-extrabold text-gray-900 mt-0.5">#{selectedOrder.orderNumber || selectedOrder.id}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintInvoice}
                    className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    title="Print Receipt"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Status Update Quick Bar */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3">
                <p className="text-xs font-bold text-gray-700">Update Workflow Status</p>
                <div className="flex flex-wrap gap-2">
                  {ORDER_STATUSES.map(st => {
                    const isCurrent = (selectedOrder.orderStatus || selectedOrder.status) === st;
                    return (
                      <button
                        key={st}
                        disabled={updating || isCurrent}
                        onClick={() => handleStatusChangeSubmit(st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isCurrent 
                            ? 'bg-primary-600 text-white shadow-xs' 
                            : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>

                {/* Optional note */}
                <input
                  type="text"
                  placeholder="Optional internal note (e.g. 'Decorating started at 10 AM')"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Customer Information */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer & Delivery</h3>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2 text-xs text-gray-700">
                  <p><strong>Name:</strong> {selectedOrder.name || selectedOrder.customer?.name || 'Guest'}</p>
                  <p><strong>Phone:</strong> {selectedOrder.phone || selectedOrder.customer?.phone || 'Not provided'}</p>
                  {selectedOrder.email && <p><strong>Email:</strong> {selectedOrder.email}</p>}
                  <p><strong>Address:</strong> {selectedOrder.address || selectedOrder.customer?.address || 'Pickup at bakery'}</p>
                  <p><strong>Scheduled Date:</strong> {selectedOrder.eventDate || selectedOrder.deliveryDate || 'Not specified'}</p>
                  {selectedOrder.deliveryTime && <p><strong>Delivery Time:</strong> {selectedOrder.deliveryTime}</p>}
                  {selectedOrder.orderNotes && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <strong>Customer Notes:</strong>
                      <p className="italic text-gray-600 mt-1">{selectedOrder.orderNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Ordered Items Breakdown */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ordered Items</h3>
                <div className="space-y-2">
                  {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-gray-100 bg-white flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-gray-900">{item.title || item.orderType || 'Item'}</p>
                          <div className="text-[11px] text-gray-500 space-x-2 mt-0.5">
                            {item.details?.size && <span>Size: {item.details.size}</span>}
                            {item.details?.flavor && <span>• Flavor: {item.details.flavor}</span>}
                            {item.details?.quantity && <span>• Qty: {item.details.quantity}</span>}
                          </div>
                        </div>
                        <span className="font-bold text-gray-700">{item.price || 'Quote on Request'}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 whitespace-pre-wrap">
                      {selectedOrder.orderSummary || 'Standard order items'}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Section */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">Total Bill:</span>
                  <span className="font-extrabold text-base text-gray-900">{selectedOrder.totalPrice || 'Quote on Request'}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-600">Payment Status:</span>
                  <div className="flex gap-1.5">
                    {PAYMENT_STATUSES.map(ps => (
                      <button
                        key={ps}
                        disabled={updating || selectedOrder.paymentStatus === ps}
                        onClick={() => handlePaymentChange(ps)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          selectedOrder.paymentStatus === ps ? 'bg-emerald-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        {ps}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status History Trail */}
              {Array.isArray(selectedOrder.statusHistory) && selectedOrder.statusHistory.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status History Log</h3>
                  <div className="space-y-1.5 text-[11px] max-h-32 overflow-y-auto">
                    {selectedOrder.statusHistory.map((hist, i) => (
                      <div key={i} className="p-2 rounded-lg bg-gray-50 border border-gray-100 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-gray-800">{hist.status}</span>
                          {hist.note && <p className="text-gray-500">{hist.note}</p>}
                        </div>
                        <span className="text-[10px] text-gray-400">{new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex-1 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Ban className="w-4 h-4" />
                Cancel Order
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CANCELLATION MODAL */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-gray-900 mb-2">Cancel Order #{selectedOrder.orderNumber}?</h3>
            <p className="text-xs text-gray-500 mb-4">Please record a reason for cancellation (e.g., customer request, unavailable slot).</p>
            
            <form onSubmit={handleCancelOrderSubmit} className="space-y-4">
              <textarea
                required
                rows="3"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Enter cancellation reason..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderManagement;
