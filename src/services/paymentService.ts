import { APIResponse, PaymentAPI, apiFactory, createConnectedAPI } from '@/interfaces/api';
import { gsmService } from './gsmService';

// Tipos para diferentes métodos de pagamento
export interface PaymentMethod {
  id: string;
  name: string;
  type: 'mpesa' | 'emola' | 'paypal' | 'card' | 'bitcoin';
  icon: string;
  description: string;
  enabled: boolean;
  config: {
    apiKey?: string;
    merchantId?: string;
    webhookUrl?: string;
    supportedCurrencies: string[];
    minAmount: number;
    maxAmount: number;
    processingFee?: number;
  };
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  method: string;
  userId: string;
  description: string;
  metadata?: Record<string, unknown>;
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
}

// Implementações específicas para cada método de pagamento
class MPesaPaymentService implements PaymentAPI {
  private config: PaymentMethod['config'];

  constructor(config: PaymentMethod['config']) {
    this.config = config;
  }

  async processPayment(amount: number, method: string, userId: string): Promise<APIResponse<{
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
  }>> {
    // Simulação da API M-Pesa (Vodacom)
    // Em produção, isso faria uma chamada real para a API da Vodacom

    const transactionId = `MPESA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simular sucesso (90% de chance)
    const success = Math.random() > 0.1;

    if (success) {
      // Adicionar créditos ao usuário
      gsmService.addCredits(userId, amount, `Depósito M-Pesa: ${transactionId}`);

      return {
        success: true,
        data: {
          transactionId,
          status: 'completed'
        },
        timestamp: new Date().toISOString()
      };
    } else {
      return {
        success: false,
        error: 'Falha no processamento do pagamento M-Pesa',
        timestamp: new Date().toISOString()
      };
    }
  }

  async verifyPayment(transactionId: string): Promise<APIResponse<{
    status: 'pending' | 'completed' | 'failed';
    amount: number;
  }>> {
    // Simulação de verificação
    return {
      success: true,
      data: {
        status: 'completed',
        amount: 500 // Valor fixo para simulação
      },
      timestamp: new Date().toISOString()
    };
  }
}

class EmolaPaymentService implements PaymentAPI {
  private config: PaymentMethod['config'];

  constructor(config: PaymentMethod['config']) {
    this.config = config;
  }

  async processPayment(amount: number, method: string, userId: string): Promise<APIResponse<{
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
  }>> {
    // Simulação da API E-mola (Movitel)
    const transactionId = `EMOLA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await new Promise(resolve => setTimeout(resolve, 1500));

    const success = Math.random() > 0.05; // 95% de sucesso

    if (success) {
      gsmService.addCredits(userId, amount, `Depósito E-mola: ${transactionId}`);

      return {
        success: true,
        data: {
          transactionId,
          status: 'completed'
        },
        timestamp: new Date().toISOString()
      };
    } else {
      return {
        success: false,
        error: 'Pagamento E-mola rejeitado',
        timestamp: new Date().toISOString()
      };
    }
  }

  async verifyPayment(transactionId: string): Promise<APIResponse<{
    status: 'pending' | 'completed' | 'failed';
    amount: number;
  }>> {
    return {
      success: true,
      data: {
        status: 'completed',
        amount: 300
      },
      timestamp: new Date().toISOString()
    };
  }
}

class PayPalPaymentService implements PaymentAPI {
  private config: PaymentMethod['config'];

  constructor(config: PaymentMethod['config']) {
    this.config = config;
  }

  async processPayment(amount: number, method: string, userId: string): Promise<APIResponse<{
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
  }>> {
    // Simulação PayPal
    const transactionId = `PAYPAL-${Date.now()}`;

    // PayPal geralmente requer redirecionamento, mas simulamos como direto
    await new Promise(resolve => setTimeout(resolve, 3000));

    gsmService.addCredits(userId, amount, `Depósito PayPal: ${transactionId}`);

    return {
      success: true,
      data: {
        transactionId,
        status: 'completed'
      },
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
        amount: 1000
      },
      timestamp: new Date().toISOString()
    };
  }
}

class CardPaymentService implements PaymentAPI {
  private config: PaymentMethod['config'];

  constructor(config: PaymentMethod['config']) {
    this.config = config;
  }

  async processPayment(amount: number, method: string, userId: string): Promise<APIResponse<{
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
  }>> {
    // Simulação Visa/Mastercard
    const transactionId = `CARD-${Date.now()}`;

    await new Promise(resolve => setTimeout(resolve, 2500));

    const success = Math.random() > 0.02; // 98% de sucesso

    if (success) {
      gsmService.addCredits(userId, amount, `Depósito Cartão: ${transactionId}`);

      return {
        success: true,
        data: {
          transactionId,
          status: 'completed'
        },
        timestamp: new Date().toISOString()
      };
    } else {
      return {
        success: false,
        error: 'Cartão rejeitado - verificar dados',
        timestamp: new Date().toISOString()
      };
    }
  }

  async verifyPayment(transactionId: string): Promise<APIResponse<{
    status: 'pending' | 'completed' | 'failed';
    amount: number;
  }>> {
    return {
      success: true,
      data: {
        status: 'completed',
        amount: 750
      },
      timestamp: new Date().toISOString()
    };
  }
}

class BitcoinPaymentService implements PaymentAPI {
  private config: PaymentMethod['config'];

  constructor(config: PaymentMethod['config']) {
    this.config = config;
  }

  async processPayment(amount: number, method: string, userId: string): Promise<APIResponse<{
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
  }>> {
    // Simulação Bitcoin/Crypto
    const transactionId = `BTC-${Date.now()}`;

    // Crypto payments geralmente demoram mais
    await new Promise(resolve => setTimeout(resolve, 5000));

    gsmService.addCredits(userId, amount, `Depósito Bitcoin: ${transactionId}`);

    return {
      success: true,
      data: {
        transactionId,
        status: 'completed'
      },
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
        amount: 2000
      },
      timestamp: new Date().toISOString()
    };
  }
}

// Serviço principal de pagamentos
class PaymentService {
  private paymentMethods: Map<string, PaymentMethod> = new Map();
  private paymentAPIs: Map<string, PaymentAPI> = new Map();
  private transactions: Map<string, PaymentResult> = new Map();

  constructor() {
    this.initializePaymentMethods();
    this.loadPersistedData();
  }

  private initializePaymentMethods() {
    // M-Pesa (Vodacom)
    this.addPaymentMethod({
      id: 'mpesa',
      name: 'M-Pesa',
      type: 'mpesa',
      icon: '💰',
      description: 'Pagamento via M-Pesa (Vodacom)',
      enabled: true,
      config: {
        merchantId: 'TCHOVA001',
        supportedCurrencies: ['MZN'],
        minAmount: 10,
        maxAmount: 50000,
        processingFee: 0
      }
    });

    // E-mola (Movitel)
    this.addPaymentMethod({
      id: 'emola',
      name: 'E-mola',
      type: 'emola',
      icon: '📱',
      description: 'Pagamento via E-mola (Movitel)',
      enabled: true,
      config: {
        merchantId: 'TCHOVA001',
        supportedCurrencies: ['MZN'],
        minAmount: 5,
        maxAmount: 25000,
        processingFee: 0
      }
    });

    // PayPal
    this.addPaymentMethod({
      id: 'paypal',
      name: 'PayPal',
      type: 'paypal',
      icon: '🅿️',
      description: 'Pagamento internacional via PayPal',
      enabled: true,
      config: {
        apiKey: 'PAYPAL_CLIENT_ID',
        supportedCurrencies: ['USD', 'EUR', 'MZN'],
        minAmount: 1,
        maxAmount: 10000,
        processingFee: 2.9
      }
    });

    // Cartão de Crédito
    this.addPaymentMethod({
      id: 'visa',
      name: 'Cartão Visa/Mastercard',
      type: 'card',
      icon: '💳',
      description: 'Pagamento com cartão internacional',
      // Desativado no frontend por segurança/PCI (sem hosted fields no modo atual)
      enabled: false,
      config: {
        apiKey: 'STRIPE_PUBLISHABLE_KEY',
        supportedCurrencies: ['USD', 'EUR', 'MZN'],
        minAmount: 5,
        maxAmount: 5000,
        processingFee: 3.4
      }
    });

    // Bitcoin
    this.addPaymentMethod({
      id: 'bitcoin',
      name: 'Bitcoin/Crypto',
      type: 'bitcoin',
      icon: '₿',
      description: 'Pagamento com criptomoedas',
      enabled: true,
      config: {
        apiKey: 'NOWPAYMENTS_API_KEY',
        supportedCurrencies: ['BTC', 'ETH', 'USDT'],
        minAmount: 0.0001,
        maxAmount: 10,
        processingFee: 1
      }
    });
  }

  private addPaymentMethod(method: PaymentMethod) {
    this.paymentMethods.set(method.id, method);

    // Criar instância da API correspondente
    let api: PaymentAPI;
    switch (method.type) {
      case 'mpesa':
        api = new MPesaPaymentService(method.config);
        break;
      case 'emola':
        api = new EmolaPaymentService(method.config);
        break;
      case 'paypal':
        api = new PayPalPaymentService(method.config);
        break;
      case 'card':
        api = new CardPaymentService(method.config);
        break;
      case 'bitcoin':
        api = new BitcoinPaymentService(method.config);
        break;
      default:
        throw new Error(`Tipo de pagamento não suportado: ${method.type}`);
    }

    this.paymentAPIs.set(method.id, api);
  }

  // Obter métodos de pagamento disponíveis
  getAvailablePaymentMethods(): PaymentMethod[] {
    return Array.from(this.paymentMethods.values()).filter(m => m.enabled);
  }

  // Obter método específico
  getPaymentMethod(methodId: string): PaymentMethod | undefined {
    return this.paymentMethods.get(methodId);
  }

  // Processar pagamento
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    const method = this.paymentMethods.get(request.method);
    if (!method) {
      throw new Error('Método de pagamento não encontrado');
    }

    // Validar limites
    if (request.amount < method.config.minAmount) {
      throw new Error(`Valor mínimo: ${method.config.minAmount} ${request.currency}`);
    }

    if (request.amount > method.config.maxAmount) {
      throw new Error(`Valor máximo: ${method.config.maxAmount} ${request.currency}`);
    }

    const api = this.paymentAPIs.get(request.method);
    if (!api) {
      throw new Error('API de pagamento não configurada');
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
        errorMessage: response.error
      };

      // Salvar transação
      this.transactions.set(result.transactionId, result);
      this.saveTransaction(result);

      return result;
    } catch (error) {
      const result: PaymentResult = {
        transactionId: `TXN-${Date.now()}`,
        status: 'failed',
        amount: request.amount,
        currency: request.currency,
        method: request.method,
        timestamp: new Date(),
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido'
      };

      this.transactions.set(result.transactionId, result);
      this.saveTransaction(result);

      return result;
    }
  }

  // Verificar status do pagamento
  async verifyPayment(transactionId: string): Promise<PaymentResult | null> {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) return null;

    const api = this.paymentAPIs.get(transaction.method);
    if (!api) return transaction;

    try {
      const response = await api.verifyPayment(transactionId);
      if (response.success && response.data) {
        transaction.status = response.data.status;
        this.saveTransaction(transaction);
      }
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
    }

    return transaction;
  }

  // Persistência
  private saveTransaction(transaction: PaymentResult) {
    const transactions = JSON.parse(localStorage.getItem('payment-transactions') || '[]');
    transactions.push({
      ...transaction,
      timestamp: transaction.timestamp.toISOString()
    });
    localStorage.setItem('payment-transactions', JSON.stringify(transactions.slice(-100))); // Últimas 100
  }

  private loadPersistedData() {
    try {
      const transactions = JSON.parse(localStorage.getItem('payment-transactions') || '[]');
      transactions.forEach((t: PaymentResult & { timestamp: string }) => {
        this.transactions.set(t.transactionId, {
          ...t,
          timestamp: new Date(t.timestamp)
        });
      });
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  }

  // Calcular taxas
  calculateFees(amount: number, method: string): { netAmount: number; fee: number } {
    const paymentMethod = this.paymentMethods.get(method);
    if (!paymentMethod?.config.processingFee) {
      return { netAmount: amount, fee: 0 };
    }

    const fee = (amount * paymentMethod.config.processingFee) / 100;
    return {
      netAmount: amount - fee,
      fee
    };
  }
}

// Instância singleton
export const paymentService = new PaymentService();

export default PaymentService;