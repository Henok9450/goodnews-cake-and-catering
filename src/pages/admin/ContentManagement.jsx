import React, { useState, useEffect } from 'react';
import { Globe, Save, Check, AlertCircle, RefreshCw, Phone, Clock, FileText, Sparkles, MessageCircle } from 'lucide-react';
import { getContentSection, updateContentSection } from '../../services/contentService';
import { INITIAL_CMS_CONTENT } from '../../utils/seedData';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('homepage'); // 'homepage', 'about', 'contact'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  // CMS Content States
  const [homepageContent, setHomepageContent] = useState({
    heroBadge: 'Where Every Bite Brings Joy',
    heroTitle: "Celebrate Life's Sweet Moments",
    heroSubtitle: 'Handcrafted cakes for every occasion. From birthdays to weddings, we bake happiness into every slice. Because every good news deserves a sweet celebration!',
    primaryCtaText: 'Order a Custom Cake',
    primaryCtaLink: '/custom-order',
    secondaryCtaText: 'Explore Our Cakes',
    secondaryCtaLink: '/gallery'
  });

  const [aboutContent, setAboutContent] = useState({
    passionText: "Creating beautiful, delicious cakes that celebrate life's special moments.",
    missionText: "Spread joy and sweetness through exceptional baking and customer service.",
    communityText: "Serving our local community with love and dedication since day one.",
    storyText: "GoodNews Cake started with a simple idea: every piece of good news deserves a sweet celebration. What began as a home bakery has grown into a beloved local business, but our commitment to quality and personal touch remains the same."
  });

  const [contactContent, setContactContent] = useState({
    phone: '+251 917 559 943',
    whatsapp: '+251 917 559 943',
    email: 'goodnewscake@gmail.com',
    address: 'Addis Ababa, Ethiopia',
    operatingHours: 'Open Today: 8:00 AM - 6:00 PM',
    deliveryInfo: 'Fast & safe delivery across all sub-cities in Addis Ababa',
    instagram: 'https://instagram.com/goodnewscake',
    telegram: 'https://t.me/goodnewscake'
  });

  const loadContent = async () => {
    setLoading(true);
    try {
      const [home, about, contact] = await Promise.all([
        getContentSection('homepage'),
        getContentSection('about'),
        getContentSection('contact')
      ]);

      if (home) setHomepageContent(prev => ({ ...prev, ...home }));
      if (about) setAboutContent(prev => ({ ...prev, ...about }));
      if (contact) setContactContent(prev => ({ ...prev, ...contact }));
    } catch (err) {
      console.error('Error loading CMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const handleSaveHomepage = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateContentSection('homepage', homepageContent);
      showNotification('success', 'Homepage content updated successfully!');
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateContentSection('about', aboutContent);
      showNotification('success', 'About Us page content updated successfully!');
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContact = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateContentSection('contact', contactContent);
      showNotification('success', 'Contact info and operating hours updated successfully!');
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Website Content Management (CMS)</h1>
          <p className="text-xs text-gray-500 mt-1">Update public text, banners, contact details, and operating hours dynamically</p>
        </div>
        <button
          onClick={loadContent}
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

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          onClick={() => setActiveTab('homepage')}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'homepage' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Homepage Hero & Banner
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'about' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          About Us & Brand Story
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'contact' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Contact, Hours & WhatsApp
        </button>
      </div>

      {/* TAB 1: HOMEPAGE */}
      {activeTab === 'homepage' && (
        <form onSubmit={handleSaveHomepage} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Top Hero Badge Text</label>
              <input
                type="text"
                value={homepageContent.heroBadge}
                onChange={(e) => setHomepageContent({ ...homepageContent, heroBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Hero Main Heading</label>
              <input
                type="text"
                value={homepageContent.heroTitle}
                onChange={(e) => setHomepageContent({ ...homepageContent, heroTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Hero Subtitle Paragraph</label>
            <textarea
              rows="3"
              value={homepageContent.heroSubtitle}
              onChange={(e) => setHomepageContent({ ...homepageContent, heroSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Primary Button Text & Link</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={homepageContent.primaryCtaText}
                  onChange={(e) => setHomepageContent({ ...homepageContent, primaryCtaText: e.target.value })}
                  placeholder="Button Label"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={homepageContent.primaryCtaLink}
                  onChange={(e) => setHomepageContent({ ...homepageContent, primaryCtaLink: e.target.value })}
                  placeholder="/custom-order"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Secondary Button Text & Link</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={homepageContent.secondaryCtaText}
                  onChange={(e) => setHomepageContent({ ...homepageContent, secondaryCtaText: e.target.value })}
                  placeholder="Button Label"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={homepageContent.secondaryCtaLink}
                  onChange={(e) => setHomepageContent({ ...homepageContent, secondaryCtaLink: e.target.value })}
                  placeholder="/gallery"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="text-right pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 ml-auto"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Homepage Content'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: ABOUT US */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Our Passion (Card 1)</label>
            <input
              type="text"
              value={aboutContent.passionText}
              onChange={(e) => setAboutContent({ ...aboutContent, passionText: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Our Mission (Card 2)</label>
            <input
              type="text"
              value={aboutContent.missionText}
              onChange={(e) => setAboutContent({ ...aboutContent, missionText: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Our Community (Card 3)</label>
            <input
              type="text"
              value={aboutContent.communityText}
              onChange={(e) => setAboutContent({ ...aboutContent, communityText: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Our Story Full Narrative</label>
            <textarea
              rows="5"
              value={aboutContent.storyText}
              onChange={(e) => setAboutContent({ ...aboutContent, storyText: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div className="text-right pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 ml-auto"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save About Us Content'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: CONTACT */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSaveContact} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={contactContent.phone}
                onChange={(e) => setContactContent({ ...contactContent, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Hotline</label>
              <input
                type="text"
                value={contactContent.whatsapp}
                onChange={(e) => setContactContent({ ...contactContent, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={contactContent.email}
                onChange={(e) => setContactContent({ ...contactContent, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Operating Hours Display</label>
              <input
                type="text"
                value={contactContent.operatingHours}
                onChange={(e) => setContactContent({ ...contactContent, operatingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Physical Address</label>
            <input
              type="text"
              value={contactContent.address}
              onChange={(e) => setContactContent({ ...contactContent, address: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Telegram Link</label>
              <input
                type="text"
                value={contactContent.telegram}
                onChange={(e) => setContactContent({ ...contactContent, telegram: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Instagram Link</label>
              <input
                type="text"
                value={contactContent.instagram}
                onChange={(e) => setContactContent({ ...contactContent, instagram: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div className="text-right pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 ml-auto"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Contact Details'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContentManagement;
