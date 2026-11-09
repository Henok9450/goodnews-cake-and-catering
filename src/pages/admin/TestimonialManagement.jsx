import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Check, X, Trash2, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

const TestimonialManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    userName: '',
    rating: 5,
    comment: '',
    status: 'approved'
  });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'reviews', id), { status });
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      showNotification('success', `Review marked as ${status}`);
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await deleteDoc(doc(db, 'reviews', id));
      setReviews(prev => prev.filter(r => r.id !== id));
      showNotification('success', 'Review deleted.');
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  const handleCreateTestimonial = async (e) => {
    e.preventDefault();
    if (!formData.userName || !formData.comment) return;
    try {
      await addDoc(collection(db, 'reviews'), {
        ...formData,
        rating: Number(formData.rating),
        createdAt: serverTimestamp(),
        dateDisplay: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      });
      showNotification('success', 'Customer testimonial added successfully!');
      setIsModalOpen(false);
      setFormData({ userName: '', rating: 5, comment: '', status: 'approved' });
      await fetchReviews();
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  const filteredReviews = reviews.filter(r => filter === 'all' || r.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Testimonials & Reviews</h1>
          <p className="text-xs text-gray-500 mt-1">Moderate customer reviews submitted online and add curated testimonials</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchReviews}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-2xs"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
          </button>
        </div>
      </div>

      {notification.message && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
          notification.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'rejected'].map(st => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
              filter === st ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {st} ({reviews.filter(r => st === 'all' || r.status === st).length})
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-400">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-400 text-xs">No reviews matching this status.</div>
        ) : (
          filteredReviews.map(r => (
            <div key={r.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : r.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {r.status || 'pending'}
                  </span>
                  <div className="flex text-amber-400">
                    {[...Array(Number(r.rating) || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-700 italic mb-4">"{r.comment}"</p>
                <p className="font-bold text-xs text-gray-900">{r.userName || 'Customer'}</p>
                <p className="text-[10px] text-gray-400">{r.dateDisplay || 'Recent review'}</p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                <div className="flex gap-1.5">
                  {r.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(r.id, 'approved')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px]"
                    >
                      Approve
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(r.id, 'rejected')}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold text-[11px]"
                    >
                      Reject
                    </button>
                  )}
                </div>
                <button onClick={() => handleDelete(r.id)} className="p-1.5 text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <h3 className="text-base font-extrabold text-gray-900 mb-4">Add Curated Testimonial</h3>
            <form onSubmit={handleCreateTestimonial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  placeholder="e.g. Mahlet Solomon"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Star Rating (1-5)</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Testimonial Text *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="The wedding cake was stunning and delicious..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-2 px-5 text-xs font-bold rounded-xl">
                  Publish Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialManagement;
