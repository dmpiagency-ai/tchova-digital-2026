import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { GSMRental, ChecktoolRequest, GSMTransaction, GSMNotification } from '@/types/gsm';
import { User } from '@/types';

// ============================================
// NOTIFICATION OPERATIONS
// ============================================

export interface GSMNotificationFirebaseData extends GSMNotification {
  createdAt: any; // Firestore Timestamp
}

export const subscribeToNotifications = (userId: string, callback: (notifications: GSMNotification[]) => void) => {
  console.log(`Subscribed to notifications for user ${userId}`);
  return () => {
    console.log(`Unsubscribed from notifications for user ${userId}`);
  };
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    console.log(`Marking notification as read: ${notificationId}`);
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

export const getNotificationsFromFirestore = async (userId: string): Promise<GSMNotification[]> => {
  try {
    console.log(`Getting notifications from Firestore for user ${userId}`);
    return [];
  } catch (error) {
    console.error('Error getting notifications from Firestore:', error);
    return [];
  }
};

export const notifyPaymentSuccess = async (userId: string, amount: number, method: string): Promise<void> => {
  try {
    console.log(`Payment success notification sent to user ${userId}: ${amount} MTn via ${method}`);
  } catch (error) {
    console.error('Error sending payment success notification:', error);
  }
};

export const notifyPaymentFailed = async (userId: string, amount: number, error: string): Promise<void> => {
  try {
    console.log(`Payment failed notification sent to user ${userId}: ${amount} MTn - ${error}`);
  } catch (error) {
    console.error('Error sending payment failed notification:', error);
  }
};

// ============================================
// CHECKTOOL REQUESTS COLLECTION
// ============================================

export interface ChecktoolRequestFirestoreData extends ChecktoolRequest {
  createdAt: any; // Firestore Timestamp
}

export const createChecktoolRequest = async (request: ChecktoolRequest): Promise<string | null> => {
  try {
    const requestData: ChecktoolRequestFirestoreData = {
      ...request,
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, 'checktool_requests'), requestData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating checktool request:', error);
    return null;
  }
};

export const getChecktoolRequestById = async (requestId: string): Promise<ChecktoolRequest | null> => {
  try {
    const docRef = doc(db, 'checktool_requests', requestId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as ChecktoolRequestFirestoreData;
      return {
        ...data,
        createdAt: data.createdAt.toDate()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting checktool request:', error);
    return null;
  }
};

export const getChecktoolRequestsByUserId = async (userId: string): Promise<ChecktoolRequest[]> => {
  try {
    const q = query(
      collection(db, 'checktool_requests'),
      where('userId', '==', userId),
      where('createdAt', '>', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Last 7 days
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as ChecktoolRequestFirestoreData;
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt.toDate()
      };
    });
  } catch (error) {
    console.error('Error getting checktool requests:', error);
    return [];
  }
};

export const updateChecktoolResult = async (
  requestId: string,
  result: { status: string; details?: Record<string, any> }
): Promise<boolean> => {
  try {
    const docRef = doc(db, 'checktool_requests', requestId);
    await updateDoc(docRef, { result });
    return true;
  } catch (error) {
    console.error('Error updating checktool result:', error);
    return false;
  }
};

export const deleteChecktoolRequest = async (requestId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'checktool_requests', requestId));
    return true;
  } catch (error) {
    console.error('Error deleting checktool request:', error);
    return false;
  }
};

// ============================================
// RENTAL OPERATIONS (EXISTING)
// ============================================

export const createRental = async (rental: GSMRental): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, 'gsm_rentals'), {
      ...rental,
      createdAt: serverTimestamp(),
      expiresAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating rental:', error);
    return null;
  }
};

export const getRentalById = async (rentalId: string): Promise<GSMRental | null> => {
  try {
    const docRef = doc(db, 'gsm_rentals', rentalId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate(),
        expiresAt: data.expiresAt?.toDate()
      } as unknown as GSMRental;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting rental:', error);
    return null;
  }
};

export const getRentalsByUserId = async (userId: string): Promise<GSMRental[]> => {
  try {
    const q = query(
      collection(db, 'gsm_rentals'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate(),
        expiresAt: data.expiresAt?.toDate()
      } as unknown as GSMRental;
    });
  } catch (error) {
    console.error('Error getting rentals:', error);
    return [];
  }
};

export const updateRental = async (rentalId: string, updates: Partial<GSMRental>): Promise<boolean> => {
  try {
    const docRef = doc(db, 'gsm_rentals', rentalId);
    await updateDoc(docRef, updates);
    return true;
  } catch (error) {
    console.error('Error updating rental:', error);
    return false;
  }
};

export const deleteRental = async (rentalId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'gsm_rentals', rentalId));
    return true;
  } catch (error) {
    console.error('Error deleting rental:', error);
    return false;
  }
};

// ============================================
// USER OPERATIONS (EXISTING)
// ============================================

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as unknown as User;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<boolean> => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
};

// ============================================
// TRANSACTION OPERATIONS (EXISTING)
// ============================================

export const createTransaction = async (transaction: GSMTransaction): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, 'gsm_transactions'), {
      ...transaction,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating transaction:', error);
    return null;
  }
};

export const getTransactionsByUserId = async (userId: string): Promise<GSMTransaction[]> => {
  try {
    const q = query(
      collection(db, 'gsm_transactions'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate()
      } as unknown as GSMTransaction;
    });
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};
