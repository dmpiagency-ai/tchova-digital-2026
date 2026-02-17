/**
 * ============================================
 * TCHOVA DIGITAL - PAYMENT API MODULE
 * ============================================
 * Sistema de pagamentos unificado para Moçambique
 * Suporta: M-Pesa, E-mola, PayPal, Cartão, Bitcoin
 */

import { APIResponse, PaymentAPI, PaymentConfig } from './types';

// ============================================
// TYPES
// ============================================

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'mpesa' | 'emola' | 'paypal' | 'card' | 'bitcoin';
  icon: string;
  description: string;
  enabled: boolean;
  config: PaymentConfig;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  method: string;
  userId: string;
  description: string;
  metadata?: Record<string, unknown>;
  phoneNumber?: string; // For M-Pesa/E-mola
}

export interface PaymentResult {
  transactionId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  method: string;
  timestamp: Date;
  confirmationCode?: string;
  errorMessage?: string;
  paymentUrl?: string; // For redirect-based payments
}

// ============================================
// PAYMENT PROVIDERS
// ============================================

/**
 * M-Pesa Payment Provider (Vodacom Moçambique)
 */
class MPesaProvider implements PaymentAPI {
  private config: PaymentConfig;
  private apiKey: string;

  constructor(config: PaymentConfig) {
    this.config = config;
    this.apiKey = import.meta.env.VITE_MPESA_API_KEY || '';
  }

  async processPayment(amount: number, method: string, userId: string): Promise<APIResponse<{
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
  }>> {
    const transactionId = `MPESA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // TODO: Implement real M-Pesa API call
    // Documentation: https://developer.vodacom.co.za/
    
    // Simulated response for development
    const isDemo = !this.apiKey || import.meta.env.DEV;
    
    if (isDemo) {
      // Demo mode - simulate success
      await this.simulateDelay(2000);
      
      return {
        success: true,
        data: {
          transactionId,
          status: 'completed'
        },
        timestamp: new Date().toISOString()
      };
    }

    // Production implementation would go here
    return {
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'M-Pesa API integration pending' },
      timestamp: new Date().toISOString()
    };
  }

  async verifyPayment(transactionId: string): Promise<APIResponse<{
    status: 'pending' | 'completed' | 'failed';
    amount: number;
  }>> {
    // TODO: Implement real verification
    return {
      success: true,
      data: {
        status: 'completed',
        amount: 0
      },
      timestamp: new Date().toISOString()
    };
  }

  async refundPayment(transactionId: string, amount?: number): Promise<APIResponse<{
    refundId: string;
    status: 'pending' | 'completed' | 'failed';
  }>> {
    // TODO: Implement refund
    return {
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Refund not implemented' },
      timestamp: new Date().toISOString()
    };
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * E-mola Payment Provider (Movitel)
 */
class EmolaProvider implements PaymentAPI {
  private config: PaymentConfig;
  private apiKey: string;

  constructor(config: PaymentConfig) {
    this.config = config;
    this.apiKey = import.meta.env.VITE_EMOLA_API_KEY || '';
  }

  async processPayment(amount: number, method: string, userId: string): Promise<APIResponse<{
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
  }>> {
    const transactionId = `EMOLA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const isDemo = !this.apiKey || import.meta.env.DEV;

    if (isDemo) {
      await this.simulateDelay(1500);
      
      return {
        success: true,
        data: {
          transactionId,
          status: 'completed'
        },
        timestamp: new Date().toISOString()
      };
    }

    return {
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'E-mola API integration pending' },
      timestamp: new Date().toISOString()
    };
  }

  async verifyPayment(transactionId: string): Promise<APIResponse<{
    status: 'pending' | 'completed' | 'failed';
    amount: number;
  }>> {
    return {
      success: true,
      data: {
        status: 'completed',
        amount: 0
      },
      timestamp: new Date().toISOString()
    };
  }

  async refundPayment(transactionId: string, amount?: number): Promise<APIResponse<{
    refundId: string;
    status: 'pending' | 'completed' | 'failed';
  }>> {
    return {
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Refund not implemented' },
      timestamp: new Date().toISOString()
    };
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Card Payment Provider (Stripe/PayStack)
 */
class CardProvider implements PaymentAPI {
  private config: PaymentConfig;
  private stripeKey: string;

  constructor(config: PaymentConfig) {
    this.config = config;
    this.stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
  }

  async processPayment(amount: number, method: string, userId: string): Promise<APIResponse<{
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
  }>> {
    const transactionId = `CARD-${Date.now()}`;

    const isDemo = !this.stripeKey || import.meta.env.DEV;

    if (isDemo) {
      await this.simulateDelay(2500);
      
      return {
        success: true,
        data: {
          transactionId,
          status: 'completed'
        },
        timestamp: new Date().toISOString()
      };
    }

    // TODO: Integrate Stripe.js
    return {
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Stripe integration pending' },
      timestamp: new Date().toISOString()
    };
  }

  async verifyPayment(transactionId: string): Promise<APIResponse<{
    status: 'pending' | 'completed' | 'failed';
    amount: number;
  }>> {
    return {
      success: true,
      data: {
        status: 'completed',
        amount: 0
      },
      timestamp: new Date().toISOString()
    };
  }

  async refundPayment(transactionId: string, amount?: number): Promise<APIResponse<{
    refundId: string;
    status: 'pending' | 'completed' | 'failed';
  }>> {
    return {
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Refund not implemented' },
      timestamp: new Date().toISOString()
    };
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * PayPal Payment Provider
 */
class PayPalProvider implements PaymentAPI {
  private config: PaymentConfig;
  private clientId: string;

  constructor(config: PaymentConfig) {
    this.config = config;
    this.clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';
  }

  async processPayment(amount: number, method: string, userId: string): Promise<APIResponse<{
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
  }>> {
    const transactionId = `PAYPAL-${Date.now()}`;

    const isDemo = !this.clientId || import.meta.env.DEV;

    if (isDemo) {
      await this.simulateDelay(3000);
      
      return {
        success: true,
        data: {
          transactionId,
          status: 'completed'
        },
        timestamp: new Date().toISOString()
      };
    }

    return {
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'PayPal integration pending' },
      timestamp: new Date().toISOString()
    };
  }

  async verifyPayment(transactionId: string): Promise<APIResponse<{
    status: 'pending' | 'completed' | 'failed';
    amount: number;
  }>> {
    return {
      success: true,
      data: {
        status: 'completed',
        amount: 0
      },
      timestamp: new Date().toISOString()
    };
  }

  async refundPayment(transactionId: string, amount?: number): Promise<APIResponse<{
    refundId: string;
    status: 'pending' | 'completed' | 'failed';
  }>> {
    return {
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Refund not implemented' },
      timestamp: new Date().toISOString()
    };
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Bitcoin/Crypto Payment Provider
 */
class CryptoProvider implements PaymentAPI {
  private config: PaymentConfig;
  private apiKey: string;

  constructor(config: PaymentConfig) {
    this.config = config;
    this.apiKey = import.meta.env.VITE_NOWPAYMENTS_API_KEY || '';
  }

  async processPayment(amount: number, method: string, userId: string): Promise<APIResponse<{
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
  }>> {
    const transactionId = `CRYPTO-${Date.now()}`;

    const isDemo = !this.apiKey || import.meta.env.DEV;

    if (isDemo) {
      await this.simulateDelay(5000);
      
      return {
        success: true,
        data: {
          transactionId,
          status: 'pending' // Crypto payments are usually pending
        },
        timestamp: new Date().toISOString()
      };
    }

    return {
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Crypto integration pending' },
      timestamp: new Date().toISOString()
    };
  }

  async verifyPayment(transactionId: string): Promise<APIResponse<{
    status: 'pending' | 'completed' | 'failed';
    amount: number;
  }>> {
    return {
      success: true,
      data: {
        status: 'pending',
        amount: 0
      },
      timestamp: new Date().toISOString()
    };
  }

  async refundPayment(transactionId: string, amount?: number): Promise<APIResponse<{
    refundId: string;
    status: 'pending' | 'completed' | 'failed';
  }>> {
    return {
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Crypto refund not supported' },
      timestamp: new Date().toISOString()
    };
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================
// PAYMENT SERVICE
// ============================================

class PaymentService {
  private paymentMethods: Map<string, PaymentMethod> = new Map();
  private paymentAPIs: Map<string, PaymentAPI> = new Map();
  private transactions: Map<string, PaymentResult> = new Map();

  constructor() {
    this.initializePaymentMethods();
    this.loadPersistedTransactions();
  }

  private initializePaymentMethods() {
    // M-Pesa (Vodacom)
    this.registerPaymentMethod({
      id: 'mpesa',
      name: 'M-Pesa',
      type: 'mpesa',
      icon: 'mobile-money',
      description: 'Pagamento via M-Pesa (Vodacom)',
      enabled: true,
      config: {
        merchantId: import.meta.env.VITE_MPESA_SHORTCODE || 'TCHOVA001',
        supportedCurrencies: ['MZN'],
        minAmount: 10,
        maxAmount: 50000,
        processingFee: 0
      }
    });

    // E-mola (Movitel)
    this.registerPaymentMethod({
      id: 'emola',
      name: 'E-mola',
      type: 'emola',
      icon: 'mobile-money',
      description: 'Pagamento via E-mola (Movitel)',
      enabled: true,
      config: {
        merchantId: import.meta.env.VITE_EMOLA_MERCHANT_ID || 'TCHOVA001',
        supportedCurrencies: ['MZN'],
        minAmount: 5,
        maxAmount: 25000,
        processingFee: 0
      }
    });

    // PayPal
    this.registerPaymentMethod({
      id: 'paypal',
      name: 'PayPal',
      type: 'paypal',
      icon: 'wallet',
      description: 'Pagamento internacional via PayPal',
      enabled: true,
      config: {
        apiKey: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        supportedCurrencies: ['USD', 'EUR', 'MZN'],
        minAmount: 1,
        maxAmount: 10000,
        processingFee: 2.9
      }
    });

    // Card (Visa/Mastercard)
    this.registerPaymentMethod({
      id: 'card',
      name: 'Cartão Visa/Mastercard',
      type: 'card',
      icon: 'credit-card',
      description: 'Pagamento com cartão internacional',
      enabled: true,
      config: {
        apiKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
        supportedCurrencies: ['USD', 'EUR', 'MZN'],
        minAmount: 5,
        maxAmount: 5000,
        processingFee: 3.4
      }
    });

    // Bitcoin/Crypto
    this.registerPaymentMethod({
      id: 'bitcoin',
      name: 'Bitcoin/Crypto',
      type: 'bitcoin',
      icon: 'bitcoin',
      description: 'Pagamento com criptomoedas',
      enabled: true,
      config: {
        apiKey: import.meta.env.VITE_NOWPAYMENTS_API_KEY,
        supportedCurrencies: ['BTC', 'ETH', 'USDT'],
        minAmount: 0.0001,
        maxAmount: 10,
        processingFee: 1
      }
    });
  }

  private registerPaymentMethod(method: PaymentMethod) {
    this.paymentMethods.set(method.id, method);

    // Create provider instance
    let provider: PaymentAPI;
    switch (method.type) {
      case 'mpesa':
        provider = new MPesaProvider(method.config);
        break;
      case 'emola':
        provider = new EmolaProvider(method.config);
        break;
      case 'paypal':
        provider = new PayPalProvider(method.config);
        break;
      case 'card':
        provider = new CardProvider(method.config);
        break;
      case 'bitcoin':
        provider = new CryptoProvider(method.config);
        break;
      default:
        throw new Error(`Unknown payment type: ${method.type}`);
    }

    this.paymentAPIs.set(method.id, provider);
  }

  // ============================================
  // PUBLIC API
  // ============================================

  /**
   * Get all available payment methods
   */
  getAvailablePaymentMethods(): PaymentMethod[] {
    return Array.from(this.paymentMethods.values()).filter(m => m.enabled);
  }

  /**
   * Get a specific payment method
   */
  getPaymentMethod(methodId: string): PaymentMethod | undefined {
    return this.paymentMethods.get(methodId);
  }

  /**
   * Process a payment
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    const method = this.paymentMethods.get(request.method);
    if (!method) {
      throw new Error(`Payment method not found: ${request.method}`);
    }

    // Validate limits
    if (request.amount < method.config.minAmount) {
      throw new Error(`Minimum amount: ${method.config.minAmount} ${request.currency}`);
    }

    if (request.amount > method.config.maxAmount) {
      throw new Error(`Maximum amount: ${method.config.maxAmount} ${request.currency}`);
    }

    const api = this.paymentAPIs.get(request.method);
    if (!api) {
      throw new Error(`Payment API not configured: ${request.method}`);
    }

    try {
      const response = await api.processPayment(request.amount, request.method, request.userId);

      const result: PaymentResult = {
        transactionId: response.data?.transactionId || `TXN-${Date.now()}`,
        status: response.data?.status || 'failed',
        amount: request.amount,
        currency: request.currency,
        method: request.method,
        timestamp: new Date(),
        errorMessage: response.error?.message
      };

      // Save transaction
      this.transactions.set(result.transactionId, result);
      this.persistTransaction(result);

      return result;
    } catch (error) {
      const result: PaymentResult = {
        transactionId: `TXN-${Date.now()}`,
        status: 'failed',
        amount: request.amount,
        currency: request.currency,
        method: request.method,
        timestamp: new Date(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };

      this.transactions.set(result.transactionId, result);
      this.persistTransaction(result);

      return result;
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(transactionId: string): Promise<PaymentResult | null> {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) return null;

    const api = this.paymentAPIs.get(transaction.method);
    if (!api) return transaction;

    try {
      const response = await api.verifyPayment(transactionId);
      if (response.success && response.data) {
        transaction.status = response.data.status;
        this.persistTransaction(transaction);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
    }

    return transaction;
  }

  /**
   * Calculate fees for a payment
   */
  calculateFees(amount: number, methodId: string): { netAmount: number; fee: number; percentage: number } {
    const method = this.paymentMethods.get(methodId);
    if (!method?.config.processingFee) {
      return { netAmount: amount, fee: 0, percentage: 0 };
    }

    const fee = (amount * method.config.processingFee) / 100;
    return {
      netAmount: amount - fee,
      fee,
      percentage: method.config.processingFee
    };
  }

  /**
   * Get transaction history
   */
  getTransactionHistory(userId?: string): PaymentResult[] {
    const transactions = Array.from(this.transactions.values());
    if (userId) {
      // TODO: Filter by userId when we have that data stored
      return transactions;
    }
    return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // ============================================
  // PERSISTENCE
  // ============================================

  private persistTransaction(transaction: PaymentResult) {
    try {
      const transactions = JSON.parse(localStorage.getItem('payment-transactions') || '[]');
      transactions.push({
        ...transaction,
        timestamp: transaction.timestamp.toISOString()
      });
      // Keep last 100 transactions
      localStorage.setItem('payment-transactions', JSON.stringify(transactions.slice(-100)));
    } catch (error) {
      console.error('Failed to persist transaction:', error);
    }
  }

  private loadPersistedTransactions() {
    try {
      const transactions = JSON.parse(localStorage.getItem('payment-transactions') || '[]');
      transactions.forEach((t: PaymentResult & { timestamp: string }) => {
        this.transactions.set(t.transactionId, {
          ...t,
          timestamp: new Date(t.timestamp)
        });
      });
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const paymentService = new PaymentService();
export default PaymentService;