import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, Timestamp, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection, query, where, orderBy, limit, QueryConstraint, onSnapshot } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFunctions } from 'firebase/functions';

// 🔌 PLUG-IN: Centralized Firebase Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// 🔌 PLUG-IN: Initialize Firebase (Singleton)
let app: FirebaseApp;

const isConfigValid = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined';

if (!getApps().length) {
  if (isConfigValid) {
    app = initializeApp(firebaseConfig);
  } else {
    console.warn('Firebase configuration is missing or invalid. Authentication features will be disabled.');
    // Initialize with an empty app to avoid total bundle crash
    app = initializeApp({ apiKey: "mock-key", projectId: "mock-id", appId: "mock-app" });
  }
} else {
  app = getApps()[0];
}

// 🔌 PLUG-IN: Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Analytics Loader (Safe)
export const analytics = typeof window !== 'undefined' ? (async () => {
  if (await isSupported()) return getAnalytics(app);
  return null;
})() : null;

// 🔌 PLUG-IN: Feature Flags
export const firebaseFeatures = {
  auth: true,
  firestore: true,
  analytics: import.meta.env.PROD,
  storage: false,
  functions: true,
};

// 🔌 PLUG-IN: Service Status
export const getFirebaseStatus = () => ({
  app: !!app,
  auth: !!auth,
  db: !!db,
  analytics: !!analytics,
  environment: import.meta.env.MODE,
  configured: !!import.meta.env.VITE_FIREBASE_API_KEY
});

/**
 * 🛠️ UNIFIED DATA HELPERS
 * Functions that simplify Firestore interactions with APIResponse support
 */

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  timestamp: string;
}

export const getDocument = async <T>(collPath: string, docId: string): Promise<APIResponse<T>> => {
  try {
    const docRef = doc(db, collPath, docId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Document not found' }, timestamp: new Date().toISOString() };
    }
    return { success: true, data: { id: docSnap.id, ...docSnap.data() } as T, timestamp: new Date().toISOString() };
  } catch (error: any) {
    return { success: false, error: { code: 'FIRESTORE_ERROR', message: error.message }, timestamp: new Date().toISOString() };
  }
};

export const getCollection = async <T>(collPath: string, constraints: any[] = []): Promise<APIResponse<T[]>> => {
  try {
    const q = query(collection(db, collPath), ...constraints);
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
    return { success: true, data, timestamp: new Date().toISOString() };
  } catch (error: any) {
    return { success: false, error: { code: 'FIRESTORE_ERROR', message: error.message }, timestamp: new Date().toISOString() };
  }
};

export const setDocument = async (collPath: string, docId: string, data: any, merge = true): Promise<APIResponse<{ id: string }>> => {
  try {
    const docRef = doc(db, collPath, docId);
    await setDoc(docRef, { ...data, updatedAt: Timestamp.now() }, { merge });
    return { success: true, data: { id: docId }, timestamp: new Date().toISOString() };
  } catch (error: any) {
    return { success: false, error: { code: 'FIRESTORE_ERROR', message: error.message }, timestamp: new Date().toISOString() };
  }
};

export const deleteDocument = async (collPath: string, docId: string): Promise<APIResponse<void>> => {
  try {
    const docRef = doc(db, collPath, docId);
    await deleteDoc(docRef);
    return { success: true, timestamp: new Date().toISOString() };
  } catch (error: any) {
    return { success: false, error: { code: 'FIRESTORE_ERROR', message: error.message }, timestamp: new Date().toISOString() };
  }
};

// Export singleton app
export { app };
export default { app, auth, db, analytics, getDocument, getCollection, setDocument };
