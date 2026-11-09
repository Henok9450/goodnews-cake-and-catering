import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  Upload, 
  X, 
  Image as ImageIcon,
  Check,
  AlertTriangle,
  ArrowUpDown,
  RefreshCw,
  Sparkles,
  Cake
} from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { uploadImage, validateImageFile } from '../../services/storageService';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Delete confirmation modal
  const [productToDelete, setProductToDelete] = useState(null);

  // Form Fields
  const initialFormData = {
    name: '',
    description: '',
    category: 'cakes',
    price: '',
    discountPrice: '',
    featuredImage: '',
    images: [],
    ingredients: '',
    sizes: '',
    flavors: '',
    size: '1 kg',
    servings: '8-10 people',
    prepTime: '24-48 hours',
    isCustomizable: true,
    isMadeToOrder: true,
    stockQuantity: 10,
    isFeatured: false,
    status: 'published',
    seoTitle: '',
    seoDescription: ''
  };
  const [formData, setFormData] = useState(initialFormData);

  const fetchCatalogData = async () => {
    setLoading(true);
    try {
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        getProducts({ status: 'all' }),
        getCategories(true)
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories.length > 0 ? fetchedCategories : [
        { id: '1', slug: 'cakes', name: 'Cakes' },
        { id: '2', slug: 'cupcakes', name: 'Cupcakes' },
        { id: '3', slug: 'cookies', name: 'Cookies' },
        { id: '4', slug: 'seasonal', name: 'Seasonal Items' },
      ]);
    } catch (err) {
      console.error('Error loading products/categories:', err);
      showNotification('error', 'Failed to load products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 5000);
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category: product.category || 'cakes',
      price: product.price !== null && product.price !== undefined ? product.price : '',
      discountPrice: product.discountPrice || '',
      featuredImage: product.featuredImage || (product.images && product.images[0]) || '',
      images: Array.isArray(product.images) ? product.images : [],
      ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : (product.ingredients || ''),
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || ''),
      flavors: Array.isArray(product.flavors) ? product.flavors.join(', ') : (product.flavors || ''),
      size: product.size || '',
      servings: product.servings || '',
      prepTime: product.prepTime || '24-48 hours',
      isCustomizable: product.isCustomizable !== undefined ? product.isCustomizable : true,
      isMadeToOrder: product.isMadeToOrder !== undefined ? product.isMadeToOrder : true,
      stockQuantity: product.stockQuantity || 0,
      isFeatured: !!product.isFeatured,
      status: product.status || 'published',
      seoTitle: product.seoTitle || product.name || '',
      seoDescription: product.seoDescription || product.description || ''
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImage(true);
    setUploadProgress(10);

    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validation = validateImageFile(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        const url = await uploadImage(file, 'products', (progress) => {
          setUploadProgress(progress);
        });
        uploadedUrls.push(url);
      }

      setFormData(prev => {
        const newImages = [...prev.images, ...uploadedUrls];
        return {
          ...prev,
          images: newImages,
          featuredImage: prev.featuredImage || newImages[0]
        };
      });
      showNotification('success', `Uploaded ${uploadedUrls.length} image(s) to cloud storage successfully!`);
    } catch (err) {
      console.error('Upload error:', err);
      showNotification('error', err.message);
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (imgUrl) => {
    setFormData(prev => {
      const filtered = prev.images.filter(img => img !== imgUrl);
      return {
        ...prev,
        images: filtered,
        featuredImage: prev.featuredImage === imgUrl ? (filtered[0] || '') : prev.featuredImage
      };
    });
  };

  const handleSetFeaturedImage = (imgUrl) => {
    setFormData(prev => ({ ...prev, featuredImage: imgUrl }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showNotification('error', 'Product name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        featuredImage: formData.featuredImage || (formData.images[0] || '/images/cakes/cake1.png'),
        images: formData.images.length > 0 ? formData.images : ['/images/cakes/cake1.png'],
        ingredients: formData.ingredients ? formData.ingredients.split(',').map(s => s.trim()).filter(Boolean) : [],
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        flavors: formData.flavors ? formData.flavors.split(',').map(s => s.trim()).filter(Boolean) : [],
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showNotification('success', `Updated "${formData.name}" successfully!`);
      } else {
        await createProduct(payload);
        showNotification('success', `Created new product "${formData.name}" successfully!`);
      }

      setIsModalOpen(false);
      await fetchCatalogData();
    } catch (err) {
      console.error('Error saving product:', err);
      showNotification('error', 'Save failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      await updateProduct(product.id, { isFeatured: !product.isFeatured });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isFeatured: !p.isFeatured } : p));
      showNotification('success', `Toggled featured status for "${product.name}"`);
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  const handleTogglePublish = async (product) => {
    const newStatus = product.status === 'published' ? 'draft' : 'published';
    try {
      await updateProduct(product.id, { status: newStatus });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: newStatus } : p));
      showNotification('success', `Product "${product.name}" is now ${newStatus}.`);
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      showNotification('success', `Deleted "${productToDelete.name}" successfully.`);
      setProductToDelete(null);
      await fetchCatalogData();
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    const matchesSearch = !search.trim() || 
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Products & Cakes Catalog</h1>
          <p className="text-xs text-gray-500 mt-1">Manage cakes, cupcakes, cookies, seasonal items, descriptions, and uploaded photos</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCatalogData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-2xs"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="btn-primary py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification.message && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in ${
          notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          {notification.type === 'error' ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
          {notification.message}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, flavor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id || c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-400">Loading catalog items...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Cake className="w-12 h-12 mx-auto mb-3 opacity-40 text-primary-500" />
            <p className="text-sm font-bold text-gray-700">No products match your criteria</p>
            <p className="text-xs text-gray-400 mt-1">Try resetting your filters or add a new product</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Size & Servings</th>
                  <th className="py-3.5 px-4">Price / Quote</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredProducts.map((product) => {
                  const isPublished = product.status === 'published';
                  return (
                    <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Image & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.featuredImage || (product.images && product.images[0]) || '/images/cakes/cake1.png'}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-gray-900 truncate">{product.name}</p>
                            <p className="text-[11px] text-gray-500 truncate">{product.description}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 capitalize">
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-[11px] font-semibold">
                          {product.category || 'General'}
                        </span>
                      </td>

                      {/* Size & Servings */}
                      <td className="py-3 px-4 text-gray-600">
                        {product.size || 'Standard'} {product.servings ? `(${product.servings})` : ''}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-semibold">
                        {product.price ? (
                          <span className="text-gray-900">ETB {Number(product.price).toLocaleString()}</span>
                        ) : (
                          <span className="text-primary-600 font-bold text-[11px]">Quote on Request</span>
                        )}
                      </td>

                      {/* Featured Star */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            product.isFeatured 
                              ? 'text-amber-500 hover:text-amber-600 bg-amber-50' 
                              : 'text-gray-300 hover:text-gray-400'
                          }`}
                          title="Toggle Featured on Homepage"
                        >
                          <Star className={`w-4 h-4 ${product.isFeatured ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePublish(product)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            isPublished 
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {product.status || 'published'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(product)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Cake / Product'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Changes will be saved to Firebase and instantly reflected on the customer website
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* Product Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Red Velvet Elegance"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map(c => (
                      <option key={c.id || c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Rich chocolate sponge with silky ganache filling..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>

              {/* IMAGE UPLOAD SECTION */}
              <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-gray-800">Product Images</label>
                    <p className="text-[11px] text-gray-500">Upload high-res JPG, PNG, or WebP photos (Max 5MB)</p>
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-500 transition-colors shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploadingImage && (
                  <div className="space-y-1 py-2">
                    <div className="flex justify-between text-xs text-primary-600 font-bold">
                      <span>Uploading to Firebase Cloud Storage...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {/* Thumbnails grid */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {formData.images.map((imgUrl, idx) => {
                    const isMain = formData.featuredImage === imgUrl;
                    return (
                      <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200 bg-white">
                        <img src={imgUrl} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                        
                        {/* Main Image Badge */}
                        {isMain && (
                          <span className="absolute top-1 left-1 bg-primary-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase">
                            Main
                          </span>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          {!isMain && (
                            <button
                              type="button"
                              onClick={() => handleSetFeaturedImage(imgUrl)}
                              className="p-1 rounded bg-white/20 hover:bg-white text-white hover:text-primary-600"
                              title="Set as Main"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(imgUrl)}
                            className="p-1 rounded bg-white/20 hover:bg-red-600 text-white"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price & Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Base Price (ETB) <span className="text-gray-400 font-normal">(Leave blank for Quote on Request)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 1500"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Promotional / Discount Price (ETB)
                  </label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="e.g. 1300"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Sizes, Servings & Flavors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Default Size</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="e.g. 1.5 kg"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Servings</label>
                  <input
                    type="text"
                    value={formData.servings}
                    onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                    placeholder="e.g. 10-12 people"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Prep Notice</label>
                  <input
                    type="text"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                    placeholder="e.g. 24-48 hours"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Ingredients & Available Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Ingredients <span className="text-gray-400 font-normal">(Comma separated)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    placeholder="Vanilla sponge, Buttercream, Berries"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Available Flavors <span className="text-gray-400 font-normal">(Comma separated)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.flavors}
                    onChange={(e) => setFormData({ ...formData, flavors: e.target.value })}
                    placeholder="Vanilla, Chocolate, Red Velvet"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Toggles (Customizable, Made-to-order, Featured, Status) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isCustomizable}
                    onChange={(e) => setFormData({ ...formData, isCustomizable: e.target.checked })}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-xs font-semibold text-gray-700">Customizable</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isMadeToOrder}
                    onChange={(e) => setFormData({ ...formData, isMadeToOrder: e.target.checked })}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-xs font-semibold text-gray-700">Made-To-Order</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-xs font-semibold text-gray-700">Featured Item</span>
                </label>

                <div>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none"
                  >
                    <option value="published">Status: Published</option>
                    <option value="draft">Status: Draft</option>
                    <option value="archived">Status: Archived</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingImage}
                  className="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving to Database...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-fade-in text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Delete "{productToDelete.name}"?</h3>
            <p className="text-xs text-gray-500 mb-6">
              This will permanently delete this product and its photos from Firebase. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductManagement;
