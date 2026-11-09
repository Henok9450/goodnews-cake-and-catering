import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { seedDatabaseIfEmpty } from '../utils/seedData';

const AuthContext = createContext();

// Default bootstrap admin emails
const DEFAULT_ADMIN_EMAILS = [
  'noahenok9450@gmail.com',
  'henok.birhanu@gmail.com',
  'admin@goodnewscake.com'
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
  const [adminProfile, setAdminProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check admin status in Firestore & bootstrap list
  const verifyAdminRole = async (currentUser) => {
    if (!currentUser || !currentUser.email) {
      setIsAdmin(false);
      setAdminProfile(null);
      return false;
    }

    const email = currentUser.email.toLowerCase();
    const isBootstrapAdmin = DEFAULT_ADMIN_EMAILS.includes(email);

    try {
      // Check admins collection in Firestore
      const adminDocRef = doc(db, 'admins', currentUser.uid);
      const adminDoc = await getDoc(adminDocRef);

      if (adminDoc.exists() && adminDoc.data().isActive !== false) {
        const data = adminDoc.data();
        setIsAdmin(true);
        setAdminProfile({ uid: currentUser.uid, ...data });
        return true;
      } else if (isBootstrapAdmin) {
        // Auto-provision bootstrap admin profile in Firestore
        const newAdminData = {
          email: currentUser.email,
          displayName: currentUser.displayName || 'Administrator',
          role: 'superadmin',
          isActive: true,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        };
        await setDoc(adminDocRef, newAdminData, { merge: true });
        setIsAdmin(true);
        setAdminProfile({ uid: currentUser.uid, ...newAdminData });

        // Auto-seed initial catalog if Firestore is empty
        seedDatabaseIfEmpty().catch(err => console.warn('Seed notice:', err.message));
        return true;
      } else {
        setIsAdmin(false);
        setAdminProfile(null);
        return false;
      }
    } catch (err) {
      console.warn('Admin check error (falling back to bootstrap list):', err.message);
      if (isBootstrapAdmin) {
        setIsAdmin(true);
        setAdminProfile({ uid: currentUser.uid, email, role: 'superadmin' });
        return true;
      }
      setIsAdmin(false);
      setAdminProfile(null);
      return false;
    }
  };

  useEffect(() => {
    // Process Google redirect result if returning from redirect sign-in
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          await verifyAdminRole(result.user);
        }
      })
      .catch((err) => {
        if (err.code !== 'auth/popup-closed-by-user') {
          console.warn('Redirect auth status:', err.message);
        }
      });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await verifyAdminRole(currentUser);
      } else {
        setIsAdmin(false);
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await verifyAdminRole(cred.user);
    return cred.user;
  };

  const loginWithGoogle = async (useRedirect = false) => {
    if (useRedirect) {
      return signInWithRedirect(auth, googleProvider);
    }
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await verifyAdminRole(cred.user);
      return cred.user;
    } catch (popupError) {
      if (
        popupError.code === 'auth/popup-blocked' ||
        popupError.code === 'auth/cancelled-popup-request' ||
        popupError.message?.includes('Cross-Origin-Opener-Policy')
      ) {
        console.warn('Popup interrupted or blocked, redirecting to Google sign in...');
        return signInWithRedirect(auth, googleProvider);
      }
      throw popupError;
    }
  };

  const signup = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
    setAdminProfile(null);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    adminProfile,
    isAdmin,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    resetPassword,
    verifyAdminRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
