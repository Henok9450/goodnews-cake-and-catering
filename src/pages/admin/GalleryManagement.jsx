import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Upload, AlertCircle, Check, X, RefreshCw } from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { uploadImage, validateImageFile } from '../../services/storageService';
import { INITIAL_PRODUCTS } from '../../utils/seedData';

const GalleryManagement = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Celebration Cakes');
  const [notification, setNotification] = useState({ type: '', message: '' });

  const getFallbackPhotos = () => {
    return INITIAL_PRODUCTS.map((p, idx) => ({
      id: `gallery-${p.slug || idx}`,
      url: p.featuredImage || (p.images && p.images[0]) || '/images/cakes/cake1.png',
      caption: p.name,
      category: p.category === 'cakes' ? 'Celebration Cakes' : (p.category === 'seasonal' ? 'Holiday Specials' : 'Pastries & Sweets')
    }));
  };

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'gallery_photos'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (data.length === 0) {
        data = getFallbackPhotos();
      }
      setPhotos(data);
    } catch (err) {
      console.warn('Gallery fallback notice:', err.message);
      setPhotos(getFallbackPhotos());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.valid) throw new Error(validation.error);
        const url = await uploadImage(file, 'gallery');
        await addDoc(collection(db, 'gallery_photos'), {
          url,
          caption: caption || file.name,
          category,
          createdAt: serverTimestamp()
        });
      }
      showNotification('success', `Uploaded ${files.length} photo(s) to gallery!`);
      setCaption('');
      await fetchPhotos();
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo from gallery?')) return;
    try {
      await deleteDoc(doc(db, 'gallery_photos', id));
      setPhotos(prev => prev.filter(p => p.id !== id));
      showNotification('success', 'Photo removed.');
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Photo Gallery Manager</h1>
          <p className="text-xs text-gray-500 mt-1">Upload and organize bakery showcase photos in high resolution</p>
        </div>
        <button
          onClick={fetchPhotos}
          disabled={loading}
          className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-2xs self-start"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {notification.message && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
          notification.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Upload Box */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <h2 className="text-sm font-extrabold text-gray-900">Upload New Showcase Photo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Caption / Title</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. 3-Tier Gold Wedding Cake"
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Category Tag</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
            >
              <option value="Celebration Cakes">Celebration Cakes</option>
              <option value="Wedding Cakes">Wedding Cakes</option>
              <option value="Cupcakes & Cookies">Cupcakes & Cookies</option>
              <option value="Catering Platters">Catering Platters</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="w-full cursor-pointer btn-primary py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading to Storage...' : 'Select & Upload Photo'}</span>
              <input type="file" multiple accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          <div className="col-span-full py-20 text-center text-xs text-gray-400">Loading gallery photos...</div>
        ) : photos.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-400 text-xs">
            No gallery photos uploaded yet.
          </div>
        ) : (
          photos.map(photo => (
            <div key={photo.id} className="relative group rounded-2xl overflow-hidden bg-gray-100 aspect-square shadow-2xs border border-gray-200/60">
              <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                <span className="self-end p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-sm" onClick={() => handleDelete(photo.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="text-[10px] bg-primary-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">{photo.category}</span>
                  <p className="text-white text-xs font-bold truncate mt-1">{photo.caption}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GalleryManagement;
