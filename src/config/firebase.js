// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
console.log('🔥 Initializing Firebase app...');
const app = initializeApp(firebaseConfig);
console.log('✅ Firebase app initialized successfully');

// Initialize Analytics (optional)
let analytics = null;
if (typeof window !== 'undefined') {
    console.log('📊 Initializing Firebase Analytics...');
    analytics = getAnalytics(app);
    console.log('✅ Firebase Analytics initialized successfully');
}

// Initialize Firestore
console.log('🗄️ Initializing Firestore...');
const db = getFirestore(app);
console.log('✅ Firestore initialized successfully');

// Initialize Auth
console.log('🔐 Initializing Firebase Auth...');
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
console.log('✅ Firebase Auth initialized successfully');

export { app, analytics, db, auth, googleProvider };
