import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Briefcase, 
  X, 
  Upload, 
  AlertTriangle, 
  Check, 
  Eye, 
  EyeOff, 
  Star, 
  RefreshCw 
} from 'lucide-react';
import { getServices, createService, updateService, deleteService } from '../../services/serviceService';
import { uploadImage, validateImageFile } from '../../services/storageService';

const SERVICE_CATEGORIES = [
  'Wedding Cakes',
  'Birthday Cakes',
  'Customized Cakes',
  'Corporate Catering',
  'Event Catering',
  'Wedding Catering',
  'Birthday and Celebration Packages',
  'Other Catering Services'
];

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const initialFormData = {
    title: '',
    description: '',
    category: 'Corporate Catering',
    coverImage: '',
    images: [],
    pricingType: 'quote',
    startingPrice: '',
    serves: '',
    features: '',
    isFeatured: false,
    status: 'published'
  };
  const [formData, setFormData] = useState(initialFormData);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getServices(true);
      setServices(data);
    } catch (err) {
      showNotification('error', 'Failed to load services: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Keyboard accessibility: Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isModalOpen) setIsModalOpen(false);
        if (serviceToDelete) setServiceToDelete(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, serviceToDelete]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 5000);
  };

  const handleOpenCreateModal = () => {
    setEditingService(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      category: service.category || 'Corporate Catering',
      coverImage: service.coverImage || '',
      images: Array.isArray(service.images) ? service.images : [],
      pricingType: service.pricingType || 'quote',
      startingPrice: service.startingPrice || '',
      serves: service.serves || '',
      features: Array.isArray(service.features) ? service.features.join('\n') : (service.features || ''),
      isFeatured: !!service.isFeatured,
      status: service.status || 'published'
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImage(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.valid) throw new Error(validation.error);
        const url = await uploadImage(file, 'services');
        uploadedUrls.push(url);
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
        coverImage: prev.coverImage || uploadedUrls[0]
      }));
      showNotification('success', `Uploaded ${uploadedUrls.length} image(s) to cloud storage.`);
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        coverImage: formData.coverImage || (formData.images[0] || '/images/catering/catering1.png'),
        images: formData.images.length > 0 ? formData.images : ['/images/catering/catering1.png'],
        features: formData.features.split('\n').map(f => f.trim()).filter(Boolean)
      };

      if (editingService) {
        await updateService(editingService.id, payload);
        showNotification('success', `Updated "${formData.title}" successfully!`);
      } else {
        await createService(payload);
        showNotification('success', `Created service "${formData.title}" successfully!`);
      }
      setIsModalOpen(false);
      await fetchServices();
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;
    try {
      await deleteService(serviceToDelete.id);
      showNotification('success', `Deleted service "${serviceToDelete.title}".`);
      setServiceToDelete(null);
      await fetchServices();
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Services & Catering Packages</h1>
          <p className="text-xs text-gray-500 mt-1">Manage wedding packages, corporate catering platters, and event services</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchServices}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-2xs"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="btn-primary py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add New Service
          </button>
        </div>
      </div>

      {notification.message && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
          notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          {notification.type === 'error' ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
          {notification.message}
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-400">
            <div className="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading catering services...
          </div>
        ) : services.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-400 text-xs">
            No services defined yet.
          </div>
        ) : (
          services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="h-44 bg-gray-100 relative overflow-hidden">
                <img
                  src={service.coverImage || (service.images && service.images[0]) || '/images/catering/catering1.png'}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-gray-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {service.category}
                </span>
                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  service.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-200'
                }`}>
                  {service.status || 'published'}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 mb-1">{service.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{service.description}</p>
                  
                  {service.serves && (
                    <p className="text-[11px] font-semibold text-gray-700 mb-2">
                      👥 Serves: <span className="font-normal text-gray-600">{service.serves}</span>
                    </p>
                  )}

                  {Array.isArray(service.features) && service.features.length > 0 && (
                    <ul className="text-[11px] text-gray-600 space-y-1 mb-3">
                      {service.features.slice(0, 2).map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                  <span className="text-xs font-bold text-primary-600">
                    {service.pricingType === 'fixed' && service.startingPrice 
                      ? `ETB ${Number(service.startingPrice).toLocaleString()}` 
                      : 'Quote on Request'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(service)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      title="Edit Service"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setServiceToDelete(service)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-modal-title"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
              <h3 id="service-modal-title" className="text-lg font-bold text-gray-900">
                {editingService ? 'Edit Catering Package' : 'Create New Catering Package'}
              </h3>
              <button 
                type="button"
                aria-label="Close dialog"
                onClick={() => setIsModalOpen(false)} 
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Wedding Dessert Buffet Package"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500"
                  >
                    {SERVICE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Capacity / Serves</label>
                  <input
                    type="text"
                    value={formData.serves}
                    onChange={(e) => setFormData({ ...formData, serves: e.target.value })}
                    placeholder="e.g. 50-100 guests"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive service description for catering clients..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Package Inclusions / Features <span className="text-gray-400 font-normal">(One per line)</span>
                </label>
                <textarea
                  rows="3"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="On-site dessert table styling&#10;Three-tier cutting cake&#10;150 assorted mini pastries"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 font-mono text-[11px]"
                />
              </div>

              {/* Photos */}
              <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800">Photos & Gallery</label>
                  <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-500 flex items-center gap-1.5 shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {uploadingImage && <p className="text-xs text-primary-600 font-semibold animate-pulse">Uploading...</p>}
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 group">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, images: p.images.filter(x => x !== img) }))}
                        className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pricing Model</label>
                  <select
                    value={formData.pricingType}
                    onChange={(e) => setFormData({ ...formData, pricingType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  >
                    <option value="quote">Quotation-Based</option>
                    <option value="fixed">Starting Price</option>
                  </select>
                </div>

                {formData.pricingType === 'fixed' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Starting Price (ETB)</label>
                    <input
                      type="number"
                      value={formData.startingPrice}
                      onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                      placeholder="e.g. 5000"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                  Featured Package
                </label>

                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingImage}
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold"
                >
                  {isSubmitting ? 'Saving...' : editingService ? 'Update Service' : 'Publish Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE DIALOG */}
      {serviceToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-service-title"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 id="delete-service-title" className="text-base font-bold text-gray-900 mb-1">Delete "{serviceToDelete.title}"?</h3>
            <p className="text-xs text-gray-500 mb-5">
              This package will be permanently removed from the public catering listings.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setServiceToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700"
              >
                Delete Package
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ServiceManagement;
