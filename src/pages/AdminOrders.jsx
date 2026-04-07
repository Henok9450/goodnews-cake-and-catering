import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Trash2, 
  ChevronRight, 
  Calendar, 
  User, 
  Phone, 
  MapPin,
  AlertCircle,
  Zap,
  MessageSquare,
  Star,
  Check,
  X
} from 'lucide-react';
import { calculateOrderStatus, getStatusBadgeStyle } from '../utils/statusUtils';

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'reviews'
  
  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('pending'); // 'pending', 'approved', 'rejected', 'All'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const statuses = ['Received', 'Baking', 'Decorating', 'Ready', 'Delivered', 'Cancelled'];
  const reviewStatuses = ['pending', 'approved', 'rejected', 'All'];

  useEffect(() => {
    // Always fetch orders
    const qOrders = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id, ...doc.data()
      }));
      setOrders(ordersData);
      setOrdersLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setOrdersLoading(false);
    });

    return () => unsubOrders();
  }, []);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [orderFilter]);

  useEffect(() => {
    if (activeTab !== 'reviews') return;
    setReviewsLoading(true);
    const qReviews = query(
      collection(db, 'reviews'),
      orderBy('createdAt', 'desc')
    );
    const unsubReviews = onSnapshot(qReviews, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id, ...doc.data()
      }));
      setReviews(reviewsData);
      setReviewsLoading(false);
    }, (error) => {
      console.error("Error fetching reviews:", error);
      setReviewsLoading(false);
    });

    return () => unsubReviews();
  }, [activeTab]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status: newStatus,
        manualStatus: newStatus,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      alert("Error updating status: " + error.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order record? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
        if (selectedOrder?.id === orderId) setSelectedOrder(null);
      } catch (error) {
        alert("Error deleting order: " + error.message);
      }
    }
  };

  const handleUpdateReviewStatus = async (reviewId, newStatus) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), { status: newStatus });
    } catch (error) {
      alert("Error updating review: " + error.message);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to permanently delete this review?")) {
      try {
        await deleteDoc(doc(db, 'reviews', reviewId));
      } catch (error) {
        alert("Error deleting review: " + error.message);
      }
    }
  };

  const filteredOrders = orderFilter === 'All' 
    ? orders 
    : orders.filter(o => {
        const computed = calculateOrderStatus(o) || '';
        return computed.toLowerCase() === orderFilter.toLowerCase();
      });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const filteredReviews = reviewFilter === 'All'
    ? reviews
    : reviews.filter(r => r.status === reviewFilter);

  if (ordersLoading) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const pendingReviewsCount = reviews.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen pt-24 bg-gray-50 pb-12">
      <div className="container mx-auto px-4">
        
        {/* Header Section (Dark Premium) Navigational wrapper */}
        <div className="bg-dark-900 rounded-3xl p-8 mb-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold font-display tracking-tight flex items-center gap-3">
                <Package className="w-8 h-8 text-primary-500" />
                Bakery Manager Dashboard
              </h1>
              <p className="text-dark-300 mt-1">Direct control over orders and customer reviews.</p>
            </div>
            
            {/* Top Level Tabs */}
            <div className="flex bg-dark-800 p-1.5 rounded-xl gap-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'orders' ? 'bg-primary-600 text-white shadow-lg' : 'text-dark-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Package className="w-5 h-5" />
                Orders
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all relative ${
                  activeTab === 'reviews' ? 'bg-primary-600 text-white shadow-lg' : 'text-dark-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                Reviews
                {/* Notification Badge if there are pending reviews (only visual if we pre-fetched them, since reviews fetch lazily, it might not show initially unless active) */}
                {pendingReviewsCount > 0 && activeTab === 'reviews' && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-primary-500 font-bold text-[10px] items-center justify-center">{pendingReviewsCount}</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ----------------- ORDERS VIEW ----------------- */}
        {activeTab === 'orders' && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 font-display">Active Orders ({filteredOrders.length})</h2>
              <div className="mt-4 md:mt-0 flex gap-2 overflow-x-auto pb-2">
                {['All', ...statuses].map(s => (
                  <button
                    key={s}
                    onClick={() => setOrderFilter(s)}
                    className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-bold transition-all ${
                      orderFilter === s 
                        ? 'bg-primary-600 text-white shadow-lg scale-105' 
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Order List */}
              <div className="lg:col-span-2 space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
                    <p className="text-gray-500">There are no orders matching your current filter.</p>
                  </div>
                ) : (
                  currentOrders.map(order => (
                    <div 
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`bg-white rounded-2xl shadow-sm border p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedOrder?.id === order.id ? 'border-primary-500 ring-1 ring-primary-500' : 'border-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between font-display text-lg mb-3">
                        <span className="font-bold text-gray-900">{order.orderNumber || 'GN-NEW'}</span>
                        <div className="flex items-center gap-2">
                           <span className={getStatusBadgeStyle(order, calculateOrderStatus(order))}>
                             {calculateOrderStatus(order)}
                           </span>
                           {!order.manualStatus && (
                             <Zap className="w-3.5 h-3.5 text-primary-400" title="Auto-Progressing" />
                           )}
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>{order.name}</span></div>
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{order.orderDate}</span></div>
                        <div className="flex items-center gap-2"><Package className="w-4 h-4" /><span className="truncate">{order.items?.length || 1} Item(s)</span></div>
                        <div className="flex items-center gap-2 font-bold text-gray-900"><span>Total: {order.totalPrice}</span></div>
                      </div>
                    </div>
                  ))
                )}
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none transition-colors font-medium text-sm"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-500 font-medium bg-gray-100 px-4 py-2 rounded-lg">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none transition-colors font-medium text-sm"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* Order Details */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  {selectedOrder ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                      <div className="flex justify-between items-start mb-6">
                        <h2 className="text-xl font-bold text-gray-900 font-display">Order Details</h2>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleDeleteOrder(selectedOrder.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Permanently Delete Order Record"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => setSelectedOrder(null)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            title="Close Details"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Status Dropdown */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Update Status (Manual Override)</label>
                          <select
                            value={calculateOrderStatus(selectedOrder)}
                            onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                          >
                            {statuses.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-3">
                          <h3 className="font-bold text-gray-900 flex items-center gap-2">
                             <User className="w-4 h-4" /> Customer Contact
                          </h3>
                          <div className="text-sm space-y-2">
                            <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {selectedOrder.phone || 'N/A'}</p>
                            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {selectedOrder.deliveryAddress || 'Pick-up'}</p>
                            {selectedOrder.deliveryTime && (
                              <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> Preferred: {selectedOrder.deliveryTime}</p>
                            )}
                          </div>
                        </div>

                        {/* Items Breakdown */}
                        <div className="space-y-3">
                          <h3 className="font-bold text-gray-900 flex items-center gap-2">
                             <Package className="w-4 h-4" /> Items
                          </h3>
                          <div className="space-y-4">
                            {selectedOrder.items?.map((item, idx) => (
                              <div key={idx} className="bg-primary-50/50 rounded-xl p-3 text-sm">
                                <p className="font-bold text-primary-900 mb-1">{item.title}</p>
                                <div className="grid grid-cols-2 gap-x-2 text-xs text-primary-700">
                                  {item.details?.size && <p>Size: {item.details.size}</p>}
                                  {item.details?.flavor && <p>Flavor: {item.details.flavor}</p>}
                                  {item.details?.frosting && <p>Frosting: {item.details.frosting}</p>}
                                  {item.details?.filling && <p>Filling: {item.details.filling}</p>}
                                </div>
                                {item.details?.message && (
                                  <p className="mt-2 text-xs italic bg-white inline-block px-2 py-1 rounded">" {item.details.message} "</p>
                                )}
                              </div>
                            ))}
                            {!selectedOrder.items && (
                              <pre className="text-xs whitespace-pre-wrap bg-gray-50 p-2 rounded">
                                {selectedOrder.orderSummary}
                              </pre>
                            )}
                          </div>
                        </div>

                        {selectedOrder.deliveryNotes && (
                          <div className="pt-4 border-t border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Customer Notes</p>
                            <p className="text-sm text-gray-600">{selectedOrder.deliveryNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-400">
                      <ChevronRight className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p>Select an order from the list to view details and update status</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ----------------- REVIEWS VIEW ----------------- */}
        {activeTab === 'reviews' && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 font-display">Customer Reviews ({reviews.length})</h2>
              
              <div className="mt-4 md:mt-0 flex gap-2 overflow-x-auto pb-2">
                {reviewStatuses.map(s => (
                  <button
                    key={s}
                    onClick={() => setReviewFilter(s)}
                    className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-bold capitalize transition-all ${
                      reviewFilter === s 
                        ? 'bg-primary-600 text-white shadow-lg scale-105' 
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {reviewsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No reviews found</h3>
                <p className="text-gray-500">There are no reviews matching your current filter.</p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                {filteredReviews.map(review => (
                  <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-dark-100 text-primary-700 font-bold rounded-full flex items-center justify-center">
                            {review.userPhoto ? (
                                <img src={review.userPhoto} alt={review.userName} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                review.userName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 flex items-center gap-1">
                              {review.userName}
                              {review.userId && <span className="text-primary-600 text-xs">✓</span>}
                            </h4>
                            <p className="text-xs text-gray-500">{review.dateDisplay}</p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                          review.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200 animate-pulse' :
                          review.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {review.status}
                        </div>
                      </div>
                      
                      <div className="flex gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                        ))}
                      </div>
                      
                      <p className="text-gray-700 italic mb-6">"{review.comment}"</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-50 mt-auto">
                      {review.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleUpdateReviewStatus(review.id, 'rejected')}
                            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors"
                          >
                            <X className="w-4 h-4" /> Reject
                          </button>
                          <button 
                            onClick={() => handleUpdateReviewStatus(review.id, 'approved')}
                            className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 border border-green-200 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-4 h-4" /> Approve
                          </button>
                        </>
                      )}
                      {review.status === 'approved' && (
                        <button 
                          onClick={() => handleUpdateReviewStatus(review.id, 'rejected')}
                          className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-bold transition-colors"
                        >
                          Hide Review
                        </button>
                      )}
                      {review.status === 'rejected' && (
                        <button 
                          onClick={() => handleUpdateReviewStatus(review.id, 'approved')}
                          className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-bold transition-colors"
                        >
                          Approve Review
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-2"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default AdminOrders;
