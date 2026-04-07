import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const AuthContext = createContext();

// List of emails authorized as Bakery Managers/Admins
const ADMIN_EMAILS = [
  'noahenok9450@gmail.com',
  'henok.birhanu@gmail.com'
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // For now, we'll use a simple auth context
  // Firebase integration will be added later
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signup: (email, password) => {
      return createUserWithEmailAndPassword(auth, email, password);
    },
    login: (email, password) => {
      return signInWithEmailAndPassword(auth, email, password);
    },
    loginWithGoogle: () => {
      return signInWithPopup(auth, googleProvider);
    },
    logout: () => {
      return signOut(auth);
    },
    isAdmin: user ? ADMIN_EMAILS.includes(user.email) : false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
