// Firebase Configuration - Modular and Easy to Connect/Disconnect
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase Configuration Object
// 🔌 PLUG-IN: Replace with your Firebase project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ABCDEFGHIJ"
};

// Environment Detection
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;
const useEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';

// Initialize Firebase App (Singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// 🔌 PLUG-IN: Authentication Service
export const auth = getAuth(app);

// 🔌 PLUG-IN: Firestore Database
export const db = getFirestore(app);

// 🔌 PLUG-IN: Analytics (only in production and when supported)
export const analytics = isProduction ? await isSupported().then(supported =>
  supported ? getAnalytics(app) : null
).catch(() => null) : null;

// 🔌 PLUG-IN: Emulator Setup (Development Only)
if (isDevelopment && useEmulator) {
  try {
    // Auth Emulator
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });

    // Firestore Emulator
    connectFirestoreEmulator(db, 'localhost', 8080);

    console.log('🔥 Firebase Emulators Connected');
  } catch (error) {
    console.warn('Firebase Emulators not available:', error);
  }
}

// 🔌 PLUG-IN: Feature Flags
export const firebaseFeatures = {
  auth: true,           // Enable/Disable Authentication
  firestore: true,      // Enable/Disable Database
  analytics: isProduction, // Analytics only in production
  storage: false,       // File storage (not used yet)
  functions: false,     // Cloud Functions (not used yet)
};

// 🔌 PLUG-IN: Service Status
export const getFirebaseStatus = () => ({
  app: app ? 'connected' : 'disconnected',
  auth: auth ? 'ready' : 'unavailable',
  db: db ? 'ready' : 'unavailable',
  analytics: analytics ? 'active' : 'inactive',
  environment: isProduction ? 'production' : 'development',
  emulator: useEmulator ? 'active' : 'inactive'
});

export default app;