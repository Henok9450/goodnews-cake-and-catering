import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * A wrapper component that redirects to home if the user is not an admin.
 * Helps prevent unauthorized access to the bakery management pages.
 */
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    console.warn('⛔ Unauthorized access attempt to Admin Area');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
