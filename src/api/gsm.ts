/**
 * ============================================
 * TCHOVA DIGITAL - GSM SERVICES API
 * ============================================
 * Serviços GSM: desbloqueio, reparação, créditos
 */

import { APIResponse, GSMAPI, GSMTransaction } from './types';

// ============================================
// TYPES
// ============================================

export interface GSMService {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedTime: string;
  category: 'unlock' | 'repair' | 'software' | 'credits';
}

export interface GSMBrand {
  id: string;
  name: string;
  logo: string;
  models: string[];
}

export interface GSMTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  estimatedTime: string;
  requiresIMEI?: boolean;
  requiresModel?: boolean;
}

// ============================================
// GSM SERVICE IMPLEMENTATION
// ============================================

class GSMServiceAPI implements GSMAPI {
  private userBalances: Map<string, number> = new Map();
  private userTransactions: Map<string, GSMTransaction[]> = new Map();
  private services: GSMService[] = [];
  private tools: GSMTool[] = [];

  constructor() {
    this.initializeServices();
    this.initializeTools();
    this.loadPersistedData();
  }

  private initializeServices() {
    this.services = [
      {
        id: 'unlock-basic',
        name: 'Desbloqueio Básico',
        description: 'Desbloqueio de operadora para telemóveis básicos',
        price: 500,
        estimatedTime: '1-2 horas',
        category: 'unlock'
      },
      {
        id: 'unlock-smartphone',
        name: 'Desbloqueio Smartphone',
        description: 'Desbloqueio de operadora para smartphones',
        price: 1000,
        estimatedTime: '2-4 horas',
        category: 'unlock'
      },
      {
        id: 'unlock-iphone',
        name: 'Desbloqueio iPhone',
        description: 'Desbloqueio de operadora para iPhone',
        price: 2500,
        estimatedTime: '24-48 horas',
        category: 'unlock'
      },
      {
        id: 'frp-bypass',
        name: 'Remoção FRP',
        description: 'Remoção de conta Google (FRP) em Android',
        price: 1500,
        estimatedTime: '1-2 horas',
        category: 'software'
      },
      {
        id: 'icloud-unlock',
        name: 'Remoção iCloud',
        description: 'Remoção de conta iCloud em iPhone',
        price: 5000,
        estimatedTime: '3-7 dias',
        category: 'software'
      },
      {
        id: 'screen-repair',
        name: 'Reparação de Ecrã',
        description: 'Substituição de ecrã quebrado',
        price: 2000,
        estimatedTime: '1-3 horas',
        category: 'repair'
      },
      {
        id: 'battery-repair',
        name: 'Substituição de Bateria',
        description: 'Troca de bateria com defeito',
        price: 1500,
        estimatedTime: '30 min - 1 hora',
        category: 'repair'
      }
    ];
  }

  private initializeTools() {
    this.tools = [
      {
        id: 'imei-check',
        name: 'Verificação IMEI',
        description: 'Verificar status do IMEI (bloqueado, roubado, etc.)',
        icon: 'search',
        price: 100,
        estimatedTime: '5 minutos',
        requiresIMEI: true
      },
      {
        id: 'carrier-check',
        name: 'Verificar Operadora',
        description: 'Descobrir a operadora original do telemóvel',
        icon: 'network',
        price: 150,
        estimatedTime: '5 minutos',
        requiresIMEI: true
      },
      {
        id: 'unlock-calculator',
        name: 'Código de Desbloqueio',
        description: 'Calcular código de desbloqueio para telemóveis básicos',
        icon: 'key',
        price: 300,
        estimatedTime: '10 minutos',
        requiresIMEI: true,
        requiresModel: true
      }
    ];
  }

  // ============================================
  // GSMAPI Implementation
  // ============================================

  async getUserBalance(userId: string): Promise<APIResponse<{ balance: number }>> {
    const balance = this.userBalances.get(userId) || 0;
    
    return {
      success: true,
      data: { balance },
      timestamp: new Date().toISOString()
    };
  }

  async getUserTransactions(userId: string): Promise<APIResponse<{ transactions: GSMTransaction[] }>> {
    const transactions = this.userTransactions.get(userId) || [];
    
    return {
      success: true,
      data: { transactions },
      timestamp: new Date().toISOString()
    };
  }

  async addCredits(userId: string, amount: number, description: string): Promise<APIResponse<{
    newBalance: number;
    transactionId: string;
  }>> {
    const currentBalance = this.userBalances.get(userId) || 0;
    const newBalance = currentBalance + amount;
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Update balance
    this.userBalances.set(userId, newBalance);

    // Add transaction
    const transaction: GSMTransaction = {
      id: transactionId,
      amount,
      type: 'credit',
      description,
      timestamp: new Date().toISOString()
    };

    const userTxns = this.userTransactions.get(userId) || [];
    userTxns.push(transaction);
    this.userTransactions.set(userId, userTxns);

    // Persist
    this.persistData();

    return {
      success: true,
      data: { newBalance, transactionId },
      timestamp: new Date().toISOString()
    };
  }

  async purchaseService(userId: string, serviceId: string): Promise<APIResponse<{
    success: boolean;
    message: string;
    remainingBalance: number;
  }>> {
    const service = this.services.find(s => s.id === serviceId);
    if (!service) {
      return {
        success: false,
        error: { code: 'SERVICE_NOT_FOUND', message: 'Serviço não encontrado' },
        timestamp: new Date().toISOString()
      };
    }

    const currentBalance = this.userBalances.get(userId) || 0;
    
    if (currentBalance < service.price) {
      return {
        success: false,
        error: { 
          code: 'INSUFFICIENT_BALANCE', 
          message: `Saldo insuficiente. Necessário: ${service.price} MZN, Disponível: ${currentBalance} MZN` 
        },
        timestamp: new Date().toISOString()
      };
    }

    // Deduct balance
    const newBalance = currentBalance - service.price;
    this.userBalances.set(userId, newBalance);

    // Add transaction
    const transaction: GSMTransaction = {
      id: `TXN-${Date.now()}`,
      amount: -service.price,
      type: 'debit',
      description: `Serviço: ${service.name}`,
      timestamp: new Date().toISOString()
    };

    const userTxns = this.userTransactions.get(userId) || [];
    userTxns.push(transaction);
    this.userTransactions.set(userId, userTxns);

    // Persist
    this.persistData();

    return {
      success: true,
      data: {
        success: true,
        message: `Serviço "${service.name}" adquirido com sucesso`,
        remainingBalance: newBalance
      },
      timestamp: new Date().toISOString()
    };
  }

  // ============================================
  // Additional Methods
  // ============================================

  /**
   * Get all available services
   */
  getServices(): GSMService[] {
    return [...this.services];
  }

  /**
   * Get all available tools
   */
  getTools(): GSMTool[] {
    return [...this.tools];
  }

  /**
   * Get service by ID
   */
  getService(serviceId: string): GSMService | undefined {
    return this.services.find(s => s.id === serviceId);
  }

  /**
   * Get tool by ID
   */
  getTool(toolId: string): GSMTool | undefined {
    return this.tools.find(t => t.id === toolId);
  }

  // ============================================
  // Persistence
  // ============================================

  private persistData() {
    try {
      const data = {
        balances: Object.fromEntries(this.userBalances),
        transactions: Object.fromEntries(
          Array.from(this.userTransactions.entries()).map(([k, v]) => [k, v])
        )
      };
      localStorage.setItem('gsm-data', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to persist GSM data:', error);
    }
  }

  private loadPersistedData() {
    try {
      const data = JSON.parse(localStorage.getItem('gsm-data') || '{}');
      
      if (data.balances) {
        Object.entries(data.balances).forEach(([userId, balance]) => {
          this.userBalances.set(userId, balance as number);
        });
      }

      if (data.transactions) {
        Object.entries(data.transactions).forEach(([userId, txns]) => {
          this.userTransactions.set(userId, txns as GSMTransaction[]);
        });
      }
    } catch (error) {
      console.error('Failed to load GSM data:', error);
    }
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const gsmService = new GSMServiceAPI();
export default GSMServiceAPI;