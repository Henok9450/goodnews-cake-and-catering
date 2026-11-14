// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBJZv36IWdPTuNam6sPesYuuj4TOe4MnH4",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "goodnews-cake.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "goodnews-cake",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "goodnews-cake.firebasestorage.app",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "482359439198",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:482359439198:web:13625365a220ad105ee9cf",
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-0MN8XCQTKB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional)
let analytics = null;
if (typeof window !== 'undefined') {
    try {
        analytics = getAnalytics(app);
    } catch (e) {
        // Analytics not supported in all environments
    }
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Storage
const storage = getStorage(app);

export { app, analytics, db, auth, googleProvider, storage };
