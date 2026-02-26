/**
 * ============================================
 * GSM FIREBASE SERVICE
 * ============================================
 * Serviço Firebase para persistência e notificações em tempo real
 * Substitui localStorage por Firestore
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import {
  GSMWallet,
  GSMRental,
  GSMTransaction,
  Currency,
  UserLevel
} from '@/types/gsm';

// ============================================
// TYPES
// ============================================

export interface GSMNotification {
  id: string;
  userId: string;
  type: 'payment_success' | 'payment_failed' | 'rental_created' | 'rental_expiring' | 'rental_expired' | 'credits_added' | 'low_balance';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export interface GSMFirestoreData {
  wallets: GSMWallet;
  rentals: GSMRental[];
  transactions: GSMTransaction[];
  notifications: GSMNotification[];
}

// ============================================
// COLLECTIONS
// ============================================

const WALLETS_COLLECTION = 'gsm_wallets';
const RENTALS_COLLECTION = 'gsm_rentals';
const TRANSACTIONS_COLLECTION = 'gsm_transactions';
const NOTIFICATIONS_COLLECTION = 'gsm_notifications';

// ============================================
// WALLET OPERATIONS
// ============================================

/**
 * Obtém a carteira do usuário do Firestore
 */
export const getWalletFromFirestore = async (userId: string): Promise<GSMWallet | null> => {
  try {
    const docRef = doc(db, WALLETS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as GSMWallet;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting wallet from Firestore:', error);
    return null;
  }
};

/**
 * Cria ou atualiza a carteira no Firestore
 */
export const saveWalletToFirestore = async (wallet: GSMWallet): Promise<boolean> => {
  try {
    const docRef = doc(db, WALLETS_COLLECTION, wallet.userId);
    await setDoc(docRef, {
      ...wallet,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error saving wallet to Firestore:', error);
    return false;
  }
};

/**
 * Subscribe to wallet changes in real-time
 */
export const subscribeToWallet = (
  userId: string,
  callback: (wallet: GSMWallet | null) => void
): Unsubscribe => {
  const docRef = doc(db, WALLETS_COLLECTION, userId);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      const wallet: GSMWallet = {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as GSMWallet;
      callback(wallet);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Wallet subscription error:', error);
    callback(null);
  });
};

// ============================================
// RENTAL OPERATIONS
// ============================================

/**
 * Obtém todos os aluguéis do usuário
 */
export const getRentalsFromFirestore = async (userId: string): Promise<GSMRental[]> => {
  try {
    const rentalsRef = collection(db, RENTALS_COLLECTION);
    const q = query(
      rentalsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        expiresAt: data.expiresAt?.toDate() || new Date()
      } as unknown as GSMRental;
    });
  } catch (error) {
    console.error('Error getting rentals from Firestore:', error);
    return [];
  }
};

/**
 * Cria um novo aluguel no Firestore
 */
export const saveRentalToFirestore = async (rental: GSMRental): Promise<string | null> => {
  try {
    const docRef = doc(collection(db, RENTALS_COLLECTION));
    const rentalId = docRef.id;
    
    await setDoc(docRef, {
      ...rental,
      id: rentalId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(rental.expiresAt)
    });
    
    return rentalId;
  } catch (error) {
    console.error('Error saving rental to Firestore:', error);
    return null;
  }
};

/**
 * Atualiza status do aluguel
 */
export const updateRentalStatus = async (
  rentalId: string,
  status: GSMRental['status']
): Promise<boolean> => {
  try {
    const docRef = doc(db, RENTALS_COLLECTION, rentalId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating rental status:', error);
    return false;
  }
};

/**
 * Subscribe to rentals changes in real-time
 */
export const subscribeToRentals = (
  userId: string,
  callback: (rentals: GSMRental[]) => void
): Unsubscribe => {
  const rentalsRef = collection(db, RENTALS_COLLECTION);
  const q = query(
    rentalsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const rentals = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        expiresAt: data.expiresAt?.toDate() || new Date()
      } as unknown as GSMRental;
    });
    
    callback(rentals);
  }, (error) => {
    console.error('Rentals subscription error:', error);
    callback([]);
  });
};

// ============================================
// TRANSACTION OPERATIONS
// ============================================

/**
 * Obtém transações do usuário
 */
export const getTransactionsFromFirestore = async (userId: string): Promise<GSMTransaction[]> => {
  try {
    const txRef = collection(db, TRANSACTIONS_COLLECTION);
    const q = query(
      txRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date()
      } as GSMTransaction;
    });
  } catch (error) {
    console.error('Error getting transactions from Firestore:', error);
    return [];
  }
};

/**
 * Salva uma nova transação
 */
export const saveTransactionToFirestore = async (transaction: GSMTransaction): Promise<string | null> => {
  try {
    const docRef = doc(collection(db, TRANSACTIONS_COLLECTION));
    const txId = docRef.id;
    
    await setDoc(docRef, {
      ...transaction,
      id: txId,
      createdAt: serverTimestamp()
    });
    
    return txId;
  } catch (error) {
    console.error('Error saving transaction to Firestore:', error);
    return null;
  }
};

/**
 * Subscribe to transactions changes in real-time
 */
export const subscribeToTransactions = (
  userId: string,
  callback: (transactions: GSMTransaction[]) => void
): Unsubscribe => {
  const txRef = collection(db, TRANSACTIONS_COLLECTION);
  const q = query(
    txRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const transactions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date()
      } as GSMTransaction;
    });
    
    callback(transactions);
  }, (error) => {
    console.error('Transactions subscription error:', error);
    callback([]);
  });
};

// ============================================
// NOTIFICATION OPERATIONS
// ============================================

/**
 * Cria uma nova notificação
 */
export const createNotification = async (
  userId: string,
  type: GSMNotification['type'],
  title: string,
  message: string,
  data?: Record<string, any>
): Promise<string | null> => {
  try {
    const docRef = doc(collection(db, NOTIFICATIONS_COLLECTION));
    const notificationId = docRef.id;
    
    await setDoc(docRef, {
      id: notificationId,
      userId,
      type,
      title,
      message,
      data: data || {},
      read: false,
      createdAt: serverTimestamp()
    });
    
    return notificationId;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

/**
 * Obtém notificações do usuário
 */
export const getNotificationsFromFirestore = async (userId: string): Promise<GSMNotification[]> => {
  try {
    const notifRef = collection(db, NOTIFICATIONS_COLLECTION);
    const q = query(
      notifRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date()
      } as GSMNotification;
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

/**
 * Marca notificação como lida
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(docRef, { read: true });
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Subscribe to notifications in real-time
 */
export const subscribeToNotifications = (
  userId: string,
  callback: (notifications: GSMNotification[]) => void
): Unsubscribe => {
  const notifRef = collection(db, NOTIFICATIONS_COLLECTION);
  const q = query(
    notifRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const notifications = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date()
      } as GSMNotification;
    });
    
    callback(notifications);
  }, (error) => {
    console.error('Notifications subscription error:', error);
    callback([]);
  });
};

// ============================================
// MIGRATION HELPERS
// ============================================

/**
 * Migra dados do localStorage para Firestore
 */
export const migrateFromLocalStorage = async (userId: string): Promise<boolean> => {
  try {
    // Migrar carteira
    const localWallet = localStorage.getItem(`gsm_wallet_${userId}`);
    if (localWallet) {
      const wallet = JSON.parse(localWallet);
      await saveWalletToFirestore(wallet);
    }
    
    // Migrar aluguéis
    const localRentals = localStorage.getItem(`gsm_rentals_${userId}`);
    if (localRentals) {
      const rentals = JSON.parse(localRentals);
      for (const rental of rentals) {
        await saveRentalToFirestore(rental);
      }
    }
    
    // Migrar transações
    const localTransactions = localStorage.getItem(`gsm_transactions_${userId}`);
    if (localTransactions) {
      const transactions = JSON.parse(localTransactions);
      for (const tx of transactions) {
        await saveTransactionToFirestore(tx);
      }
    }
    
    console.log('Migration completed successfully');
    return true;
  } catch (error) {
    console.error('Migration error:', error);
    return false;
  }
};

// ============================================
// NOTIFICATION HELPERS
// ============================================

/**
 * Notificação de pagamento bem-sucedido
 */
export const notifyPaymentSuccess = async (
  userId: string,
  amount: number,
  method: string
): Promise<void> => {
  await createNotification(
    userId,
    'payment_success',
    'Pagamento Confirmado! 💰',
    `Seu pagamento de ${amount.toLocaleString()} MTn via ${method.toUpperCase()} foi processado com sucesso.`,
    { amount, method }
  );
};

/**
 * Notificação de pagamento falhou
 */
export const notifyPaymentFailed = async (
  userId: string,
  amount: number,
  reason?: string
): Promise<void> => {
  await createNotification(
    userId,
    'payment_failed',
    'Pagamento Falhou ❌',
    `Não foi possível processar seu pagamento de ${amount.toLocaleString()} MTn. ${reason || 'Tente novamente.'}`,
    { amount, reason }
  );
};

/**
 * Notificação de aluguel criado
 */
export const notifyRentalCreated = async (
  userId: string,
  toolName: string,
  duration: number
): Promise<void> => {
  await createNotification(
    userId,
    'rental_created',
    'Aluguel Ativado! 🎉',
    `${toolName} foi ativado por ${duration} hora(s). Acesse suas credenciais no painel.`,
    { toolName, duration }
  );
};

/**
 * Notificação de aluguel expirando
 */
export const notifyRentalExpiring = async (
  userId: string,
  toolName: string,
  minutesLeft: number
): Promise<void> => {
  await createNotification(
    userId,
    'rental_expiring',
    'Aluguel Expirando ⏰',
    `${toolName} expira em ${minutesLeft} minutos. Renove agora para continuar usando.`,
    { toolName, minutesLeft }
  );
};

/**
 * Notificação de aluguel expirado
 */
export const notifyRentalExpired = async (
  userId: string,
  toolName: string
): Promise<void> => {
  await createNotification(
    userId,
    'rental_expired',
    'Aluguel Expirado ⌛',
    `Seu aluguel de ${toolName} expirou. Alugue novamente quando precisar.`,
    { toolName }
  );
};

/**
 * Notificação de saldo baixo
 */
export const notifyLowBalance = async (
  userId: string,
  currentBalance: number
): Promise<void> => {
  await createNotification(
    userId,
    'low_balance',
    'Saldo Baixo ⚠️',
    `Seu saldo está baixo (${currentBalance.toLocaleString()} MTn). Adicione créditos para continuar alugando.`,
    { currentBalance }
  );
};

// ============================================
// EXPORT DEFAULT
// ============================================

export default {
  // Wallet
  getWalletFromFirestore,
  saveWalletToFirestore,
  subscribeToWallet,
  
  // Rentals
  getRentalsFromFirestore,
  saveRentalToFirestore,
  updateRentalStatus,
  subscribeToRentals,
  
  // Transactions
  getTransactionsFromFirestore,
  saveTransactionToFirestore,
  subscribeToTransactions,
  
  // Notifications
  createNotification,
  getNotificationsFromFirestore,
  markNotificationAsRead,
  subscribeToNotifications,
  
  // Notification Helpers
  notifyPaymentSuccess,
  notifyPaymentFailed,
  notifyRentalCreated,
  notifyRentalExpiring,
  notifyRentalExpired,
  notifyLowBalance,
  
  // Migration
  migrateFromLocalStorage
};
