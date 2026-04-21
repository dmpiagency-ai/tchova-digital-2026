/**
 * ============================================
 * TCHOVA DIGITAL - MOCK BACKEND SERVICE
 * ============================================
 * Simulated backend for development and testing
 * Provides all necessary API endpoints with realistic data
 * Easily replaceable with real backend when available
 */

import { GSMRental, ChecktoolRequest, GSMTransaction, GSMNotification } from '@/types/gsm';
import { User } from '@/types';

// ============================================
// MOCK DATA GENERATION
// ============================================

const generateMockId = (prefix: string = 'MOCK'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

const generateMockPhoneNumber = (operator: 'vodacom' | 'movitel' = 'vodacom'): string => {
  const prefix = operator === 'vodacom' ? '84' : '86';
  const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `258${prefix}${suffix}`;
};

const generateMockEmail = (name: string = 'user'): string => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'tchovadigital.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${name.toLowerCase().replace(/\s+/g, '.')}${Math.floor(Math.random() * 1000)}@${domain}`;
};

// ============================================
// MOCK DATA STORAGE
// ============================================

interface MockData {
  users: Record<string, User>;
  rentals: GSMRental[];
  transactions: GSMTransaction[];
  notifications: GSMNotification[];
  checktoolRequests: ChecktoolRequest[];
}

let mockData: MockData = {
  users: {},
  rentals: [],
  transactions: [],
  notifications: [],
  checktoolRequests: []
};

// Initialize with some sample data
const initializeMockData = () => {
  // Create sample users
  const sampleUsers: User[] = [
    {
      id: 'user_1',
      fullName: 'João Silva',
      email: 'joao.silva@tchovadigital.com',
      phone: generateMockPhoneNumber('vodacom'),
      role: 'client',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-10-27')
    },
    {
      id: 'user_2',
      fullName: 'Maria Santos',
      email: 'maria.santos@tchovadigital.com',
      phone: generateMockPhoneNumber('movitel'),
      role: 'client',
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-10-25')
    },
    {
      id: 'user_3',
      fullName: 'Pedro Costa',
      email: 'pedro.costa@tchovadigital.com',
      phone: generateMockPhoneNumber('vodacom'),
      role: 'client',
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-10-26')
    }
  ];

  sampleUsers.forEach(user => {
    mockData.users[user.id] = user;
  });

  // Create sample transactions
  const sampleTransactions: GSMTransaction[] = [
    {
      id: 'txn_1',
      userId: 'user_1',
      type: 'topup',
      status: 'completed',
      amount: { usd: 50, mtn: 3200 },
      currency: 'MTN',
      paymentMethod: 'mpesa',
      paymentReference: 'MPESA_20241027_123456',
      createdAt: new Date('2024-10-27'),
      completedAt: new Date('2024-10-27'),
      description: 'Adição de créditos via M-Pesa'
    },
    {
      id: 'txn_2',
      userId: 'user_1',
      type: 'rental',
      status: 'completed',
      amount: { usd: 20, mtn: 1280 },
      currency: 'MTN',
      paymentMethod: 'wallet',
      paymentReference: 'RENTAL_20241026_789012',
      createdAt: new Date('2024-10-26'),
      completedAt: new Date('2024-10-26'),
      description: 'Aluguel de Chimera Tool por 2h'
    },
    {
      id: 'txn_3',
      userId: 'user_2',
      type: 'topup',
      status: 'completed',
      amount: { usd: 100, mtn: 6400 },
      currency: 'MTN',
      paymentMethod: 'card',
      paymentReference: 'CARD_20241025_345678',
      createdAt: new Date('2024-10-25'),
      completedAt: new Date('2024-10-25'),
      description: 'Adição de créditos via Cartão Visa'
    }
  ];

  mockData.transactions = sampleTransactions;

  // Create sample rentals
  const sampleRentals: GSMRental[] = [
    {
      id: 'rent_1',
      transactionId: 'txn_2',
      toolId: 'chimera',
      toolKey: 'chimera',
      toolName: 'Chimera Tool',
      userId: 'user_1',
      userEmail: 'joao.silva@tchovadigital.com',
      userName: 'João Silva',
      duration: 2,
      durationMinutes: 120,
      pricing: {
        basePrice: { usd: 25, mtn: 1600 },
        discount: 5,
        finalPrice: { usd: 20, mtn: 1280 },
        currency: 'MTN'
      },
      status: 'active',
      credentials: {
        username: 'CHIMERA_USER_001',
        password: 'ChimeraPass!2024',
        url: 'https://chimera.tchovadigital.com',
        port: 8080,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
        createdAt: new Date()
      },
      createdAt: new Date('2024-10-26'),
      startedAt: new Date('2024-10-26'),
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
    }
  ];

  mockData.rentals = sampleRentals;

  // Create sample notifications
  const sampleNotifications: GSMNotification[] = [
    {
      id: 'notif_1',
      userId: 'user_1',
      type: 'payment_success',
      title: 'Pagamento Recebido',
      message: 'Seu pagamento de 500 MTn foi processado com sucesso!',
      read: false,
      createdAt: new Date('2024-10-27')
    },
    {
      id: 'notif_2',
      userId: 'user_1',
      type: 'rental_created',
      title: 'Aluguel Ativo',
      message: 'Seu aluguel do Chimera Tool está ativo por mais 1 hora.',
      read: false,
      createdAt: new Date('2024-10-26')
    },
    {
      id: 'notif_3',
      userId: 'user_2',
      type: 'credits_added',
      title: 'Desconto Exclusivo',
      message: 'Ganhe 10% de desconto no seu próximo aluguel!',
      read: true,
      createdAt: new Date('2024-10-25')
    }
  ];

  mockData.notifications = sampleNotifications;

  console.log('Mock data initialized successfully');
};

// Initialize on module load
initializeMockData();

// ============================================
// MOCK API METHODS
// ============================================

class MockBackendService {
  // ============================================
  // USER OPERATIONS
  // ============================================

  async getUserById(userId: string): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.users[userId] || null);
      }, 300);
    });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const newUser: User = {
      id: generateMockId('USER'),
      fullName: userData.fullName || 'Usuário',
      email: userData.email || generateMockEmail(),
      phone: userData.phone || generateMockPhoneNumber(),
      role: 'client',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockData.users[newUser.id] = newUser;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(newUser);
      }, 500);
    });
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!mockData.users[userId]) {
          resolve(null);
          return;
        }

        mockData.users[userId] = {
          ...mockData.users[userId],
          ...updates,
          updatedAt: new Date()
        };

        resolve(mockData.users[userId]);
      }, 300);
    });
  }

  // ============================================
  // TRANSACTION OPERATIONS
  // ============================================

  async getTransactionsByUserId(userId: string): Promise<GSMTransaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userTransactions = mockData.transactions.filter(txn => txn.userId === userId);
        resolve(userTransactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      }, 400);
    });
  }

  async createTransaction(transaction: Partial<GSMTransaction>): Promise<GSMTransaction> {
    const newTransaction: GSMTransaction = {
      id: generateMockId('TXN'),
      userId: transaction.userId || 'user_1',
      type: transaction.type || 'topup',
      status: transaction.status || 'completed',
      amount: transaction.amount || { usd: 50, mtn: 3200 },
      currency: transaction.currency || 'MTN',
      paymentMethod: transaction.paymentMethod || 'mpesa',
      paymentReference: transaction.paymentReference || generateMockId('PAY'),
      createdAt: transaction.createdAt || new Date(),
      completedAt: transaction.completedAt || new Date(),
      description: transaction.description || 'Transação simulada'
    };

    mockData.transactions.push(newTransaction);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(newTransaction);
      }, 600);
    });
  }

  // ============================================
  // RENTAL OPERATIONS
  // ============================================

  async getRentalsByUserId(userId: string): Promise<GSMRental[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userRentals = mockData.rentals.filter(rental => rental.userId === userId);
        resolve(userRentals.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      }, 500);
    });
  }

  async createRental(rental: Partial<GSMRental>): Promise<GSMRental> {
    const newRental: GSMRental = {
      id: generateMockId('RENT'),
      transactionId: generateMockId('TXN'),
      toolId: rental.toolId || 'chimera',
      toolKey: rental.toolKey || 'chimera',
      toolName: rental.toolName || 'Chimera Tool',
      userId: rental.userId || 'user_1',
      userEmail: rental.userEmail || 'user@tchovadigital.com',
      userName: rental.userName || 'Usuário',
      duration: rental.duration || 2,
      durationMinutes: (rental.duration || 2) * 60,
      pricing: rental.pricing || {
        basePrice: { usd: 25, mtn: 1600 },
        discount: 5,
        finalPrice: { usd: 20, mtn: 1280 },
        currency: 'MTN'
      },
      status: rental.status || 'active',
      credentials: rental.credentials || {
        username: 'CHIMERA_USER_002',
        password: 'ChimeraPass!2024',
        url: 'https://chimera.tchovadigital.com',
        port: 8080,
        expiresAt: new Date(Date.now() + (rental.duration || 2) * 60 * 60 * 1000),
        createdAt: new Date()
      },
      createdAt: rental.createdAt || new Date(),
      startedAt: rental.startedAt || new Date(),
      expiresAt: new Date(Date.now() + (rental.duration || 2) * 60 * 60 * 1000)
    };

    mockData.rentals.push(newRental);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(newRental);
      }, 800);
    });
  }

  async updateRental(rentalId: string, updates: Partial<GSMRental>): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockData.rentals.findIndex(r => r.id === rentalId);
        if (index !== -1) {
          mockData.rentals[index] = {
            ...mockData.rentals[index],
            ...updates
          };
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }

  // ============================================
  // NOTIFICATION OPERATIONS
  // ============================================

  async getNotificationsByUserId(userId: string): Promise<GSMNotification[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userNotifications = mockData.notifications.filter(notif => notif.userId === userId);
        resolve(userNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      }, 300);
    });
  }

  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notification = mockData.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
          resolve(true);
        } else {
          resolve(false);
        }
      }, 200);
    });
  }

  async createNotification(notification: Partial<GSMNotification>): Promise<GSMNotification> {
    const newNotification: GSMNotification = {
      id: generateMockId('NOTIF'),
      userId: notification.userId || 'user_1',
      type: notification.type || 'credits_added',
      title: notification.title || 'Nova Notificação',
      message: notification.message || 'Você tem uma nova notificação',
      read: false,
      createdAt: new Date()
    };

    mockData.notifications.push(newNotification);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(newNotification);
      }, 300);
    });
  }

  // ============================================
  // CHECKTOOL REQUESTS
  // ============================================

  async getChecktoolRequestsByUserId(userId: string): Promise<ChecktoolRequest[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userRequests = mockData.checktoolRequests.filter(req => req.userId === userId);
        resolve(userRequests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      }, 400);
    });
  }

  async createChecktoolRequest(request: Partial<ChecktoolRequest>): Promise<ChecktoolRequest> {
    const newRequest: ChecktoolRequest = {
      id: generateMockId('CHECKTOOL'),
      userId: request.userId || 'user_1',
      toolId: request.toolId || 'chimera',
      inputData: request.inputData || {
        imei: `35${Math.random().toString().substr(2, 14)}`,
        serial: `R5${Math.random().toString().substr(2, 9)}`
      },
      result: request.result || {
        status: 'pending'
      },
      cost: request.cost || 50,
      createdAt: new Date()
    };

    mockData.checktoolRequests.push(newRequest);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(newRequest);
      }, 600);
    });
  }

  async updateChecktoolRequest(requestId: string, updates: Partial<ChecktoolRequest>): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockData.checktoolRequests.findIndex(req => req.id === requestId);
        if (index !== -1) {
          mockData.checktoolRequests[index] = {
            ...mockData.checktoolRequests[index],
            ...updates
          };
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }

  // ============================================
  // PAYMENT OPERATIONS
  // ============================================

  async processPayment(
    userId: string,
    amount: number,
    method: string
  ): Promise<{ success: boolean; transactionId: string; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 95% chance of success
        const success = Math.random() > 0.05;

        if (success) {
          const transactionId = generateMockId('PAY');
          
          // Create transaction
          this.createTransaction({
            userId,
            type: 'topup',
            status: 'completed',
            amount: { usd: amount / 64, mtn: amount },
            currency: 'MTN',
            paymentMethod: method,
            paymentReference: transactionId,
            description: `Adição de créditos via ${method}`
          });

          // Create notification
          this.createNotification({
            userId,
            type: 'payment_success',
            title: 'Pagamento Recebido',
            message: `Seu pagamento de ${amount} MTn foi processado com sucesso!`,
            read: false
          });

          resolve({
            success: true,
            transactionId,
            message: 'Pagamento processado com sucesso!'
          });
        } else {
          resolve({
            success: false,
            transactionId: generateMockId('PAY'),
            message: 'Erro ao processar pagamento. Por favor, tente novamente.'
          });
        }
      }, 2000);
    });
  }

  // ============================================
  // DASHBOARD DATA
  // ============================================

  async getDashboardData(userId: string): Promise<{
    totalRentals: number;
    totalSpent: number;
    activeRentals: number;
    recentTransactions: GSMTransaction[];
    notifications: GSMNotification[];
  }> {
    const rentals = await this.getRentalsByUserId(userId);
    const transactions = await this.getTransactionsByUserId(userId);
    const notifications = await this.getNotificationsByUserId(userId);

    const totalSpent = transactions
      .filter(txn => txn.type === 'rental' && txn.status === 'completed')
      .reduce((sum, txn) => sum + txn.amount.mtn, 0);

    const activeRentals = rentals.filter(rental => 
      rental.status === 'active' && new Date(rental.expiresAt) > new Date()
    ).length;

    const recentTransactions = transactions.slice(0, 5);

    return {
      totalRentals: rentals.length,
      totalSpent,
      activeRentals,
      recentTransactions,
      notifications
    };
  }

  // ============================================
  // STATS AND ANALYTICS
  // ============================================

  async getAnalytics(): Promise<{
    totalUsers: number;
    activeSessions: number;
    totalTransactions: number;
    totalRevenue: number;
  }> {
    const totalTransactions = mockData.transactions.length;
    const totalRevenue = mockData.transactions
      .filter(txn => txn.type === 'rental' || txn.type === 'topup')
      .reduce((sum, txn) => sum + txn.amount.mtn, 0);

    const activeSessions = Object.keys(mockData.users).length;

    return {
      totalUsers: Object.keys(mockData.users).length,
      activeSessions,
      totalTransactions,
      totalRevenue
    };
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const mockBackend = new MockBackendService();
export default MockBackendService;
