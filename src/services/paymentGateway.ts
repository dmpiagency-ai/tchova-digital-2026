/**
 * ============================================
 * TCHOVA DIGITAL - PAYMENT GATEWAY SERVICE
 * ============================================
 * Integração real com gateway de pagamento Moçambicano
 * Suporta: M-Pesa, E-mola, Cartão
 * 
 * Credenciais OAuth:
 * Client ID: a11a34fb-ba32-489f-a6bf-6698bb5a0cc7
 * Secret: C7tFjxVgoiyZttNjsnpDHan64XNkrHfINvj9a1TR
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
      console.error('Payment gateway configuration missing - please check your environment variables');
    }
  }

  // ============================================
  // AUTHENTICATION
  // ============================================

  /**
   * Obtém token de acesso OAuth2
   */
  private async getAccessToken(): Promise<string> {
    // Verificar se token ainda é válido
    if (this.accessToken && this.tokenExpiresAt && new Date() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      const response = await fetch(this.config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.config.clientId}:${this.config.clientSecret}`)}`
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          scope: 'payments'
        }).toString()
      });

      if (!response.ok) {
        throw new Error(`OAuth error: ${response.status}`);
      }

      const data: OAuthToken = await response.json();
      
      this.accessToken = data.access_token;
      // Token expira em 1 hora menos 5 minutos para margem de segurança
      this.tokenExpiresAt = new Date(Date.now() + (data.expires_in - 300) * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      // Fallback para modo demo em desenvolvimento
      if (import.meta.env.DEV) {
        return this.getDemoToken();
      }
      throw error;
    }
  }

  /**
   * Token demo para desenvolvimento
   */
  private getDemoToken(): string {
    this.accessToken = 'demo_token_' + Date.now();
    this.tokenExpiresAt = new Date(Date.now() + 3600000);
    return this.accessToken;
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

    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`${this.config.baseUrl}/payments/mpesa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: request.amount,
          currency: request.currency,
          phone_number: cleanPhone.startsWith('258') ? cleanPhone : `258${cleanPhone.replace(/^0/, '')}`,
          reference: request.reference,
          description: request.description,
          callback_url: `${window.location.origin}/api/payment/callback`
        })
      });

      if (!response.ok) {
        // Em desenvolvimento, simular sucesso
        if (import.meta.env.DEV) {
          return this.simulatePayment(request, 'mpesa');
        }
        
        const error = await response.json();
        return {
          success: false,
          status: 'failed',
          message: error.message || 'Erro ao processar pagamento M-Pesa'
        };
      }

      const data = await response.json();
      
      return {
        success: true,
        transactionId: data.transaction_id || data.id,
        status: 'pending', // M-Pesa requer confirmação do usuário
        message: 'Pagamento iniciado. Verifique seu telefone e confirme a transação.',
        confirmationCode: data.confirmation_code
      };
    } catch (error) {
      // Fallback para demo em desenvolvimento
      if (import.meta.env.DEV) {
        return this.simulatePayment(request, 'mpesa');
      }
      
      return {
        success: false,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Erro de conexão'
      };
    }
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

    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`${this.config.baseUrl}/payments/emola`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: request.amount,
          currency: request.currency,
          phone_number: cleanPhone.startsWith('258') ? cleanPhone : `258${cleanPhone.replace(/^0/, '')}`,
          reference: request.reference,
          description: request.description,
          callback_url: `${window.location.origin}/api/payment/callback`
        })
      });

      if (!response.ok) {
        if (import.meta.env.DEV) {
          return this.simulatePayment(request, 'emola');
        }
        
        const error = await response.json();
        return {
          success: false,
          status: 'failed',
          message: error.message || 'Erro ao processar pagamento E-mola'
        };
      }

      const data = await response.json();
      
      return {
        success: true,
        transactionId: data.transaction_id || data.id,
        status: 'pending',
        message: 'Pagamento iniciado. Verifique seu telefone e confirme a transação.',
        confirmationCode: data.confirmation_code
      };
    } catch (error) {
      if (import.meta.env.DEV) {
        return this.simulatePayment(request, 'emola');
      }
      
      return {
        success: false,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Erro de conexão'
      };
    }
  }

  /**
   * Processa pagamento via Cartão
   */
  async processCardPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`${this.config.baseUrl}/payments/card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: request.amount,
          currency: request.currency,
          reference: request.reference,
          description: request.description,
          callback_url: `${window.location.origin}/api/payment/callback`,
          return_url: `${window.location.origin}/payment/success`
        })
      });

      if (!response.ok) {
        if (import.meta.env.DEV) {
          return this.simulatePayment(request, 'card');
        }
        
        const error = await response.json();
        return {
          success: false,
          status: 'failed',
          message: error.message || 'Erro ao processar pagamento'
        };
      }

      const data = await response.json();
      
      return {
        success: true,
        transactionId: data.transaction_id || data.id,
        status: 'pending',
        message: 'Redirecionando para página de pagamento...',
        paymentUrl: data.payment_url || data.redirect_url
      };
    } catch (error) {
      if (import.meta.env.DEV) {
        return this.simulatePayment(request, 'card');
      }
      
      return {
        success: false,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Erro de conexão'
      };
    }
  }

  // ============================================
  // PAYMENT STATUS
  // ============================================

  /**
   * Verifica status de um pagamento
   */
  async checkPaymentStatus(transactionId: string): Promise<PaymentStatusResponse> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`${this.config.baseUrl}/payments/${transactionId}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Fallback para demo
        if (import.meta.env.DEV) {
          return this.simulateStatusCheck(transactionId);
        }
        
        throw new Error(`Status check failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        transactionId: data.transaction_id || data.id,
        status: data.status,
        amount: data.amount,
        currency: data.currency,
        paidAt: data.paid_at ? new Date(data.paid_at) : undefined,
        failedAt: data.failed_at ? new Date(data.failed_at) : undefined,
        failureReason: data.failure_reason
      };
    } catch (error) {
      if (import.meta.env.DEV) {
        return this.simulateStatusCheck(transactionId);
      }
      
      throw error;
    }
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
