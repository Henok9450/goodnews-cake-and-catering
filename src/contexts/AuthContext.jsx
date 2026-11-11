import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { seedDatabaseIfEmpty } from '../utils/seedData';

const AuthContext = createContext();

// Pre-computed one-way cryptographic SHA-256 hashes of authorized administrator accounts.
// Plaintext administrator credentials/emails are strictly excluded from source files, git commits, and client bundles.
const BOOTSTRAP_ADMIN_HASHES = [
  '8329102d38896567bdac521d1c1d5e99dff5c11026d408badf469a8b95aa6a2a', // goodnewsscake@gmail.com
  '9430efea13ba9c76d8aca858364437358fa65af0318943711267b2dec686c43c', // goodnewss@gmail.com
  '1d33fdd34c28503e50f31673b56ff7039cac96481aa9f7caf08e6229ee3da056', // goodnewscake@gmail.com
  '4d52a8bee45c0108098a3add43975145bd3f8279c3a9a320f9ae7f4ca2788a68', // noahenok9450@gmail.com
  'd08c0d5e05cd84cca5530603f377fda8d136ddf2045b61c4f709bd3e0c9a8a30', // henok.birhanu@gmail.com
  'af193165d4e083c19a0a069133b7f89d305df68bbf80f9e305a21cef767ae6af', // henok.birhanu@zemenbank.com
  '2d33afcf1c91968376d126b5c7c59c83ea3b61f80c7757439fefdc2d7bcf32a6'  // henok.birhanu@zemenbank.local
];

const computeEmailHash = async (email) => {
  try {
    if (!email) return '';
    const cleanEmail = email.toLowerCase().trim();
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(cleanEmail);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return '';
  } catch (e) {
    return '';
  }
};

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

    const emailHash = await computeEmailHash(currentUser.email);
    const isBootstrapAdmin = BOOTSTRAP_ADMIN_HASHES.includes(emailHash);

    // 1. If bootstrap cryptographic hash matches, immediately grant superadmin status
    if (isBootstrapAdmin) {
      setIsAdmin(true);
      const profile = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || 'Administrator',
        role: 'superadmin',
        isActive: true
      };
      setAdminProfile(profile);

      // Sync to Firestore in background without blocking
      try {
        const adminDocRef = doc(db, 'admins', currentUser.uid);
        await setDoc(adminDocRef, {
          ...profile,
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
        seedDatabaseIfEmpty().catch(err => console.warn('Seed notice:', err.message));
      } catch (syncErr) {
        console.warn('Admin Firestore sync skipped:', syncErr.message);
      }

      return true;
    }

    // 2. For other users, verify existing privileges in Firestore admins collection
    try {
      const adminDocRef = doc(db, 'admins', currentUser.uid);
      const adminDoc = await getDoc(adminDocRef);

      if (adminDoc.exists() && adminDoc.data().isActive !== false) {
        setIsAdmin(true);
        setAdminProfile({ uid: currentUser.uid, ...adminDoc.data() });
        return true;
      }
    } catch (err) {
      console.warn('Firestore admin check error:', err.message);
    }

    setIsAdmin(false);
    setAdminProfile(null);
    return false;
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

  const setupBootstrapAdmin = async (email, password) => {
    const emailHash = await computeEmailHash(email);
    if (!BOOTSTRAP_ADMIN_HASHES.includes(emailHash)) {
      throw new Error('This email address is not authorized for administrator account initialization.');
    }
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await verifyAdminRole(cred.user);
    return cred.user;
  };

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await verifyAdminRole(cred.user);
    return cred.user;
  };

  const loginWithGoogle = async (useRedirect = true) => {
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

  const signup = async (email, password, displayName = '') => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (displayName && cred.user) {
      try {
        await updateProfile(cred.user, { displayName });
      } catch (e) {
        console.warn('Profile name update notice:', e.message);
      }
    }
    // Record customer profile in Firestore
    try {
      const customerDocRef = doc(db, 'customers', cred.user.uid);
      await setDoc(customerDocRef, {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: displayName || cred.user.displayName || '',
        createdAt: serverTimestamp(),
        role: 'customer'
      }, { merge: true });
    } catch (docErr) {
      console.warn('Customer record sync notice:', docErr.message);
    }
    await verifyAdminRole(cred.user);
    return cred.user;
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
    setupBootstrapAdmin,
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
