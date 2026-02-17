/**
 * ============================================
 * TCHOVA DIGITAL - FIREBASE API MODULE
 * ============================================
 * Módulo de integração Firebase com interface padronizada
 * Usa a configuração centralizada de @/config/firebase
 * 
 * Arquitetura: Vercel (Hosting) + Firebase (Backend)
 */

// Re-export everything from the centralized config
export { 
  app, 
  auth, 
  db, 
  analytics, 
  firebaseFeatures, 
  getFirebaseStatus 
} from '@/config/firebase';

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  Firestore
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { APIResponse } from './types';

// ============================================
// FIRESTORE HELPERS
// ============================================

/**
 * Check if Firestore is available
 */
const checkDb = (): Firestore => {
  if (!db) {
    throw new Error('Firebase Firestore not configured');
  }
  return db;
};

/**
 * Get a document by ID
 */
export const getDocument = async <T>(
  collectionName: string, 
  documentId: string
): Promise<APIResponse<T>> => {
  try {
    const database = checkDb();
    const docRef = doc(database, collectionName, documentId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Document not found' },
        timestamp: new Date().toISOString()
      };
    }

    return {
      success: true,
      data: { id: snapshot.id, ...snapshot.data() } as T,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: { 
        code: 'FIRESTORE_ERROR', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Get all documents from a collection
 */
export const getCollection = async <T>(
  collectionName: string,
  constraints?: {
    where?: { field: string; op: WhereFilterOp; value: unknown }[];
    orderBy?: { field: string; direction?: 'asc' | 'desc' };
    limit?: number;
  }
): Promise<APIResponse<T[]>> => {
  try {
    const database = checkDb();
    const collectionRef = collection(database, collectionName);
    
    // Build query with constraints
    const queryConstraints: QueryConstraint[] = [];
    
    if (constraints?.where) {
      constraints.where.forEach(w => {
        queryConstraints.push(where(w.field, w.op, w.value));
      });
    }
    
    if (constraints?.orderBy) {
      queryConstraints.push(
        orderBy(constraints.orderBy.field, constraints.orderBy.direction || 'asc')
      );
    }
    
    if (constraints?.limit) {
      queryConstraints.push(limit(constraints.limit));
    }

    const q = queryConstraints.length > 0 
      ? query(collectionRef, ...queryConstraints)
      : collectionRef;

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];

    return {
      success: true,
      data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: { 
        code: 'FIRESTORE_ERROR', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Create or update a document
 */
export const setDocument = async <T extends Record<string, unknown>>(
  collectionName: string,
  documentId: string,
  data: T,
  merge = false
): Promise<APIResponse<{ id: string }>> => {
  try {
    const database = checkDb();
    const docRef = doc(database, collectionName, documentId);
    await setDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    }, { merge });

    return {
      success: true,
      data: { id: documentId },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: { 
        code: 'FIRESTORE_ERROR', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Delete a document
 */
export const deleteDocument = async (
  collectionName: string,
  documentId: string
): Promise<APIResponse> => {
  try {
    const database = checkDb();
    const docRef = doc(database, collectionName, documentId);
    await deleteDoc(docRef);

    return {
      success: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: { 
        code: 'FIRESTORE_ERROR', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      timestamp: new Date().toISOString()
    };
  }
};

// Type imports for Firestore
import type { WhereFilterOp, QueryConstraint } from 'firebase/firestore';

export default { getDocument, getCollection, setDocument, deleteDocument };
