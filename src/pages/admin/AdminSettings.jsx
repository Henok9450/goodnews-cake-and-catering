import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Database, RefreshCw, KeyRound, Check, AlertCircle, UserPlus, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { seedDatabaseIfEmpty } from '../../utils/seedData';

const AdminSettings = () => {
  const { user, adminProfile, resetPassword } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('manager');
  const [newAdminName, setNewAdminName] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'admins'));
      setAdmins(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    try {
      // Use clean document key based on email
      const docId = newAdminEmail.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
      await setDoc(doc(db, 'admins', docId), {
        email: newAdminEmail.trim().toLowerCase(),
        displayName: newAdminName.trim() || 'Bakery Manager',
        role: newAdminRole,
        isActive: true,
        createdAt: serverTimestamp()
      });

      showNotification('success', `Admin authorization granted to ${newAdminEmail}`);
      setNewAdminEmail('');
      setNewAdminName('');
      await fetchAdmins();
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  const handleRevokeAdmin = async (adminId) => {
    if (!window.confirm('Revoke administrative access for this user?')) return;
    try {
      await deleteDoc(doc(db, 'admins', adminId));
      showNotification('success', 'Admin access revoked.');
      await fetchAdmins();
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  const handleForceSeed = async () => {
    if (!window.confirm('Re-seed initial catalog items? This will ensure all default cakes and catering items are present.')) return;
    setSeeding(true);
    try {
      const res = await seedDatabaseIfEmpty(true);
      showNotification('success', `Database seeded successfully with ${res.productsCount} products!`);
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">System & Security Settings</h1>
        <p className="text-xs text-gray-500 mt-1">Manage administrative team privileges, authentication security, and database maintenance</p>
      </div>

      {notification.message && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
          notification.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Admin Authorization Module */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-gray-900">Authorized Administrators</h2>
          <p className="text-xs text-gray-500 mt-0.5">Users in this list have access to /admin dashboard tools</p>
        </div>

        {/* Add Admin Form */}
        <form onSubmit={handleAddAdmin} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">Admin Email *</label>
            <input
              type="email"
              required
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="manager@goodnewscake.com"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-600 mb-1">Display Name</label>
            <input
              type="text"
              value={newAdminName}
              onChange={(e) => setNewAdminName(e.target.value)}
              placeholder="e.g. Head Baker"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full btn-primary py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Authorize Admin
            </button>
          </div>
        </form>

        {/* Authorized List */}
        <div className="space-y-2">
          {admins.map(admin => (
            <div key={admin.id} className="p-3.5 rounded-xl border border-gray-100 bg-white flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-gray-900">{admin.displayName || 'Administrator'} <span className="font-mono text-gray-400 font-normal">({admin.email})</span></p>
                <span className="text-[10px] bg-primary-50 text-primary-700 font-bold px-2 py-0.5 rounded-full uppercase">
                  {admin.role || 'Admin'}
                </span>
              </div>
              <button
                onClick={() => handleRevokeAdmin(admin.id)}
                className="text-gray-400 hover:text-red-600 p-1.5"
                title="Revoke access"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Database Maintenance & Seeding */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-extrabold text-gray-900">Database & Catalog Maintenance</h2>
          <p className="text-xs text-gray-500 mt-0.5">Ensure all initial website items (cakes, cookies, cupcakes, catering platters) are present in Firestore</p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200">
          <div>
            <h4 className="text-xs font-bold text-gray-900">Re-seed Default Catalog Items</h4>
            <p className="text-[11px] text-gray-500">Injects initial products and services if they were missing or reset.</p>
          </div>
          <button
            onClick={handleForceSeed}
            disabled={seeding}
            className="btn-primary py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap"
          >
            {seeding ? 'Seeding...' : 'Run Seed Initializer'}
          </button>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-3 text-xs text-gray-600">
        <h2 className="text-base font-extrabold text-gray-900 mb-2">Platform Infrastructure</h2>
        <p><strong>Application:</strong> GoodNews Cake & Catering E-Commerce Platform</p>
        <p><strong>Frontend:</strong> React 18 with Tailwind CSS & Lucide Icons</p>
        <p><strong>Backend Services:</strong> Google Cloud Firestore & Firebase Auth (Project ID: <span className="font-mono text-gray-800">goodnews-cake</span>)</p>
        <p><strong>Cloud Media Storage:</strong> Firebase Storage Bucket (<span className="font-mono text-gray-800">goodnews-cake.firebasestorage.app</span>)</p>
        <p><strong>Hosting Platform:</strong> Vercel Global Edge Network</p>
      </div>
    </div>
  );
};

export default AdminSettings;
