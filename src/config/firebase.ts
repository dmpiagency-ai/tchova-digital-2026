// Firebase Configuration - Modular and Easy to Connect/Disconnect
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';

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

// 🔌 PLUG-IN: Initialize Firebase (Singleton)
export const app: FirebaseApp = getApps().length === 0 ? initializeApp({ apiKey: "mock-key", projectId: "mock-id", appId: "mock-app" }) : getApps()[0];

// 🔌 PLUG-IN: Authentication Service
export const auth = getAuth(app);

// 🔌 PLUG-IN: Firestore Database
export const db = getFirestore(app);

// 🔌 PLUG-IN: Analytics (only in production and when supported)
export const analytics: Analytics | null = null;

// 🔌 PLUG-IN: Feature Flags
export const firebaseFeatures = {
  auth: false,           // Enable/Disable Authentication
  firestore: false,      // Enable/Disable Database
  analytics: false, // Analytics only in production
  storage: false,       // File storage (not used yet)
  functions: false,     // Cloud Functions (not used yet)
};

// 🔌 PLUG-IN: Service Status
export const getFirebaseStatus = () => ({
  app: 'disconnected',
  auth: 'unavailable',
  db: 'unavailable',
  analytics: 'inactive',
  environment: isProduction ? 'production' : 'development',
  emulator: 'inactive'
});