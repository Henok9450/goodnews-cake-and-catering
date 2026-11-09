import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Route protection wrapper for the Admin Dashboard.
 * Unauthenticated or non-admin visitors are safely redirected to /admin/login.
 */
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-600">Verifying administrator authorization...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    console.warn('⛔ Unauthorized admin access attempt. Redirecting to /admin/login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
