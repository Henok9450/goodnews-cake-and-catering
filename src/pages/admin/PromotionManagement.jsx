import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit3, Trash2, X, AlertCircle, Check, Calendar } from 'lucide-react';
import { getPromotions, createPromotion, updatePromotion, deletePromotion } from '../../services/promotionService';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const initialForm = {
    title: '',
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    startDate: '',
    endDate: '',
    applicableCategory: 'all',
    isActive: true
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const data = await getPromotions();
      setPromotions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const handleOpenCreate = () => {
    setEditingPromo(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (promo) => {
    setEditingPromo(promo);
    setFormData({
      title: promo.title || '',
      code: promo.code || '',
      discountType: promo.discountType || 'percentage',
      discountValue: promo.discountValue || 10,
      startDate: promo.startDate || '',
      endDate: promo.endDate || '',
      applicableCategory: promo.applicableCategory || 'all',
      isActive: promo.isActive !== false
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingPromo) {
        await updatePromotion(editingPromo.id, formData);
        showNotification('success', 'Promotion updated successfully!');
      } else {
        await createPromotion(formData);
        showNotification('success', 'Promotion created successfully!');
      }
      setIsModalOpen(false);
      await fetchPromos();
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promotion?')) return;
    try {
      await deletePromotion(id);
      showNotification('success', 'Promotion deleted.');
      await fetchPromos();
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Promotions & Discounts</h1>
          <p className="text-xs text-gray-500 mt-1">Manage seasonal promo codes, discount percentages, and campaign banners</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-primary py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md self-start"
        >
          <Plus className="w-4 h-4" />
          Create Promotion
        </button>
      </div>

      {notification.message && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
          notification.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Promotions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-400">Loading promotions...</div>
        ) : promotions.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-400 text-xs">
            No active promotional campaigns. Click "Create Promotion" to start one.
          </div>
        ) : (
          promotions.map(promo => (
            <div key={promo.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono bg-primary-50 text-primary-700 font-extrabold px-3 py-1 rounded-lg text-sm border border-primary-200">
                    {promo.code || 'NO-CODE'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    promo.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {promo.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-base">{promo.title}</h3>
                <p className="text-xs text-primary-600 font-bold mt-1">
                  {promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `ETB ${promo.discountValue} OFF`}
                </p>
                {promo.endDate && (
                  <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Valid until: {promo.endDate}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={() => handleOpenEdit(promo)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(promo.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-extrabold text-gray-900">
                {editingPromo ? 'Edit Promotion' : 'New Promotional Campaign'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. New Year Holiday Special"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Coupon Code (Optional)</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. SWEET2026"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (ETB)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Value</label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-primary-600"
                  />
                  Activate Promotion Immediately
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary py-2 px-5 text-xs font-bold rounded-xl"
                >
                  {isSubmitting ? 'Saving...' : 'Save Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionManagement;
