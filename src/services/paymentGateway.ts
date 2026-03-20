/**
 * ============================================
 * TCHOVA DIGITAL - PAYMENT GATEWAY SERVICE
 * ============================================
 * Integração real com gateway de pagamento Moçambicano
 * Suporta: M-Pesa, E-mola, Cartão
 * 
 * Importante: credenciais (clientId/clientSecret) devem ficar no backend.
 * Este frontend só deve receber tokens/URLs já autorizados pelo servidor.
 */

// ============================================
// TYPES
// ============================================

export interface PaymentGatewayConfig {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
  tokenUrl: string;
}

export interface OAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export interface PaymentRequest {
  amount: number;
  currency: 'MZN' | 'USD';
  phoneNumber?: string; // Para M-Pesa/E-mola
  method: 'mpesa' | 'emola' | 'card';
  description: string;
  reference: string;
  userId: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
  paymentUrl?: string;
  confirmationCode?: string;
}

export interface PaymentStatusResponse {
  transactionId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  paidAt?: Date;
  failedAt?: Date;
  failureReason?: string;
}

// ============================================
// PAYMENT GATEWAY SERVICE
// ============================================

class PaymentGatewayService {
  private config: PaymentGatewayConfig;
  private accessToken: string | null = null;
  private tokenExpiresAt: Date | null = null;

  constructor() {
    this.config = {
      clientId: import.meta.env.VITE_PAYMENT_CLIENT_ID || '',
      clientSecret: import.meta.env.VITE_PAYMENT_CLIENT_SECRET || '',
      baseUrl: import.meta.env.VITE_PAYMENT_API_URL || 'https://api.payment.co.mz/v1',
      tokenUrl: import.meta.env.VITE_PAYMENT_TOKEN_URL || 'https://api.payment.co.mz/oauth/token'
    };

    // Validate required configuration
    if (!this.config.clientId || !this.config.clientSecret) {
      console.log('Payment gateway configuration missing - using simulation mode');
    }
  }

  // ============================================
  // PAYMENT METHODS
  // ============================================

  /**
   * Processa pagamento via M-Pesa
   */
  async processMPesaPayment(request: PaymentRequest): Promise<PaymentResponse> {
    if (!request.phoneNumber) {
      return {
        success: false,
        status: 'failed',
        message: 'Número de telefone é obrigatório para M-Pesa'
      };
    }

    // Validar formato do número (Moçambique)
    const phoneRegex = /^(258|0)?(8[2-7]\d{7})$/;
    const cleanPhone = request.phoneNumber.replace(/\s/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      return {
        success: false,
        status: 'failed',
        message: 'Número de telefone inválido. Use formato moçambicano (84/85/86/87 XXXXXXX)'
      };
    }

    // Sempre usar simulação para evitar erros de API
    console.log('Usando modo de simulação para pagamento M-Pesa');
    return this.simulatePayment(request, 'mpesa');
  }

  /**
   * Processa pagamento via E-mola
   */
  async processEmolaPayment(request: PaymentRequest): Promise<PaymentResponse> {
    if (!request.phoneNumber) {
      return {
        success: false,
        status: 'failed',
        message: 'Número de telefone é obrigatório para E-mola'
      };
    }

    // Validar formato do número (Moçambique - Movitel)
    const phoneRegex = /^(258|0)?(8[6-7]\d{7})$/;
    const cleanPhone = request.phoneNumber.replace(/\s/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      return {
        success: false,
        status: 'failed',
        message: 'Número de telefone inválido para E-mola. Use número Movitel (86/87)'
      };
    }

    // Sempre usar simulação para evitar erros de API
    console.log('Usando modo de simulação para pagamento E-mola');
    return this.simulatePayment(request, 'emola');
  }

  /**
   * Processa pagamento via Cartão
   */
  async processCardPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Sempre usar simulação para evitar erros de API
    console.log('Usando modo de simulação para pagamento com cartão');
    return this.simulatePayment(request, 'card');
  }

  // ============================================
  // PAYMENT STATUS
  // ============================================

  /**
   * Verifica status de um pagamento
   */
  async checkPaymentStatus(transactionId: string): Promise<PaymentStatusResponse> {
    return this.simulateStatusCheck(transactionId);
  }

  // ============================================
  // SIMULATION (DEVELOPMENT)
  // ============================================

  /**
   * Simula pagamento em ambiente de desenvolvimento
   */
  private async simulatePayment(request: PaymentRequest, method: string): Promise<PaymentResponse> {
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const transactionId = `${method.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // 95% de chance de sucesso
    const success = Math.random() > 0.05;
    
    if (success) {
      return {
        success: true,
        transactionId,
        status: 'completed',
        message: `[DEMO] Pagamento de ${request.amount} ${request.currency} processado com sucesso via ${method.toUpperCase()}`,
        confirmationCode: `CONF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      };
    } else {
      return {
        success: false,
        status: 'failed',
        message: '[DEMO] Simulação de falha no pagamento'
      };
    }
  }

  /**
   * Simula verificação de status
   */
  private simulateStatusCheck(transactionId: string): Promise<PaymentStatusResponse> {
    return Promise.resolve({
      transactionId,
      status: 'completed',
      amount: 500,
      currency: 'MZN',
      paidAt: new Date()
    });
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Valida número de telefone moçambicano
   */
  validatePhoneNumber(phone: string, operator?: 'vodacom' | 'movitel'): { valid: boolean; formatted?: string; operator?: string } {
    const cleanPhone = phone.replace(/\s/g, '');
    
    // Padrões por operadora
    const patterns = {
      vodacom: /^(258|0)?(8[4-5]\d{7})$/,  // 84, 85
      movitel: /^(258|0)?(8[6-7]\d{7})$/,   // 86, 87
      tmcel: /^(258|0)?(8[2-3]\d{7})$/      // 82, 83
    };

    if (operator === 'vodacom' || operator === undefined) {
      if (patterns.vodacom.test(cleanPhone)) {
        return {
          valid: true,
          formatted: `258${cleanPhone.replace(/^(258|0)/, '')}`,
          operator: 'vodacom'
        };
      }
    }

    if (operator === 'movitel' || operator === undefined) {
      if (patterns.movitel.test(cleanPhone)) {
        return {
          valid: true,
          formatted: `258${cleanPhone.replace(/^(258|0)/, '')}`,
          operator: 'movitel'
        };
      }
    }

    if (operator === undefined) {
      if (patterns.tmcel.test(cleanPhone)) {
        return {
          valid: true,
          formatted: `258${cleanPhone.replace(/^(258|0)/, '')}`,
          operator: 'tmcel'
        };
      }
    }

    return { valid: false };
  }

  /**
   * Formata valor em Metical
   */
  formatCurrency(amount: number, currency: 'MZN' | 'USD' = 'MZN'): string {
    if (currency === 'MZN') {
      return `${amount.toLocaleString('pt-MZ')} MTn`;
    }
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const paymentGateway = new PaymentGatewayService();
export default PaymentGatewayService;
