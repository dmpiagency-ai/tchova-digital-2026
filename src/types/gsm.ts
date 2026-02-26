// ============================================
// GSM RENTAL SYSTEM - TYPES
// Sistema de aluguel de ferramentas GSM
// ============================================

// ============================================
// CURRENCY TYPES
// ============================================

export type Currency = 'USD' | 'MTN';

export interface ExchangeRate {
  code: Currency;
  symbol: string;
  name: string;
  rate: number; // Taxa para USD (1 USD = X MTN)
}

export const EXCHANGE_RATES: Record<Currency, ExchangeRate> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'Dólar Americano',
    rate: 1
  },
  MTN: {
    code: 'MTN',
    symbol: 'MTn',
    name: 'Metical Moçambicano',
    rate: parseFloat(import.meta.env.VITE_EXCHANGE_RATE || '64')
  }
};

// ============================================
// USER LEVEL TYPES
// ============================================

export type UserLevel = 'cliente' | 'vip' | 'revenda';

export interface LevelPricing {
  level: UserLevel;
  name: string;
  discount: number; // Porcentagem de desconto
  benefits: string[];
  color: string;
}

export const USER_LEVELS: Record<UserLevel, LevelPricing> = {
  cliente: {
    level: 'cliente',
    name: 'Cliente',
    discount: 0,
    benefits: ['Acesso a todas as ferramentas', 'Suporte por email'],
    color: 'from-gray-500 to-gray-600'
  },
  vip: {
    level: 'vip',
    name: 'VIP',
    discount: 15,
    benefits: ['15% de desconto em todas as ferramentas', 'Prioridade no suporte', 'Acesso antecipado a novidades'],
    color: 'from-amber-500 to-amber-600'
  },
  revenda: {
    level: 'revenda',
    name: 'Revenda',
    discount: 30,
    benefits: ['30% de desconto', 'API dedicada', 'Suporte prioritário 24/7', 'Relatórios avançados'],
    color: 'from-purple-500 to-purple-600'
  }
};

// ============================================
// TOOL TYPES
// ============================================

export type ToolCategory = 'instant' | 'teamviewer' | 'server' | 'box';

export interface ToolPricing {
  usd: number;
  mtn: number;
}

export interface GSMTool {
  id: string;
  key: string; // URL-friendly key
  name: string;
  description: string;
  shortDescription: string;
  category: ToolCategory;
  pricing: {
    cliente: ToolPricing;
    vip: ToolPricing;
    revenda: ToolPricing;
  };
  duration: {
    min: number; // horas
    max: number; // horas
    options: number[]; // [1, 2, 4, 6, 8, 12, 24]
  };
  features: string[];
  icon: string;
  color: string;
  gradient: string;
  popular: boolean;
  available: boolean;
  slots: {
    total: number;
    occupied: number;
  };
  server: {
    url: string;
    port?: number;
    protocol: 'http' | 'https' | 'rdp';
  };
  tags: string[];
  rating: number;
  reviewCount: number;
}

// ============================================
// RENTAL TYPES
// ============================================

export type RentalStatus = 'pending' | 'active' | 'expired' | 'cancelled' | 'refunded';

export interface RentalCredentials {
  username: string;
  password: string;
  url: string;
  port?: number;
  expiresAt: Date;
  createdAt: Date;
}

export interface GSMRental {
  id: string;
  transactionId: string;
  toolId: string;
  toolKey: string;
  toolName: string;
  userId: string;
  userEmail: string;
  userName: string;
  
  // Duração e Preço
  duration: number; // horas
  durationMinutes: number;
  pricing: {
    basePrice: ToolPricing;
    discount: number;
    finalPrice: ToolPricing;
    currency: Currency;
  };
  
  // Status
  status: RentalStatus;
  
  // Credenciais
  credentials: RentalCredentials;
  
  // Timestamps
  createdAt: Date;
  startedAt?: Date;
  expiresAt: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  
  // Metadados
  ipAddress?: string;
  userAgent?: string;
  notes?: string;
}

// ============================================
// TRANSACTION TYPES
// ============================================

export type TransactionType = 'rental' | 'topup' | 'refund' | 'bonus';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface GSMTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  
  // Valores
  amount: ToolPricing; // USD e MTN
  currency: Currency;
  
  // Relacionamentos
  rentalId?: string;
  paymentMethod?: string;
  paymentReference?: string;
  
  // Timestamps
  createdAt: Date;
  completedAt?: Date;
  
  // Metadados
  description: string;
  metadata?: Record<string, unknown>;
}

// ============================================
// WALLET TYPES
// ============================================

export interface GSMWallet {
  userId: string;
  balance: ToolPricing; // Saldo em USD e MTN
  currency: Currency;
  level: UserLevel;
  
  // Estatísticas
  totalSpent: ToolPricing;
  totalRentals: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// CHECKOUT TYPES
// ============================================

export interface CheckoutItem {
  tool: GSMTool;
  duration: number;
  pricing: {
    basePrice: ToolPricing;
    discount: number;
    finalPrice: ToolPricing;
    currency: Currency;
  };
}

export interface CheckoutSession {
  id: string;
  userId: string;
  items: CheckoutItem[];
  total: ToolPricing;
  currency: Currency;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  expiresAt: Date;
}

// ============================================
// API TYPES
// ============================================

export interface GSMApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface GSMApiConfig {
  apiKey: string;
  apiSecret?: string;
  permissions: string[];
  rateLimit: {
    perMinute: number;
    perHour: number;
    perDay: number;
  };
  createdAt: Date;
  expiresAt?: Date;
}
