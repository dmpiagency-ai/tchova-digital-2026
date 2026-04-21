// ============================================
// GSM API SERVICE LAYER
// Abstração completa com switching mock/real via env flag
// VITE_USE_REAL_API=true → chamadas reais
// VITE_USE_REAL_API=false (default) → mock data realista
// ============================================

import { GSMTool, GSMRental, GSMWallet, GSMTransaction, Currency, UserLevel } from '@/types/gsm';
import { GSM_TOOLS } from '@/config/gsmToolsConfig';

// ============================================
// ENVIRONMENT FLAG
// ============================================

const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.tchova.digital';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

// ============================================
// API STATE TYPES
// ============================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ServiceState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
  timestamp: number | null;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

export interface RentToolRequest {
  toolId: string;
  duration: number; // horas
  currency: Currency;
  userId: string;
  paymentMethod?: string;
  paymentReference?: string;
}

export interface RentToolResponse {
  rental: GSMRental;
  credentials: {
    username: string;
    password: string;
    url: string;
    port?: number;
    expiresAt: string;
  };
}

export interface WalletTopupRequest {
  userId: string;
  amount: number;
  currency: Currency;
  paymentMethod: 'mpesa' | 'emola' | 'bank' | 'card';
  paymentReference: string;
}

export interface ToolsFilterParams {
  category?: string;
  search?: string;
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  perPage?: number;
}

// ============================================
// MOCK DATA SIMULATION HELPERS
// ============================================

/** Simula latência de rede realista */
const mockDelay = (msMin = 300, msMax = 900): Promise<void> =>
  new Promise((res) => setTimeout(res, msMin + Math.random() * (msMax - msMin)));

/** Simula falha ocasional (5% de chance) */
const shouldFail = () => Math.random() < 0.05;

/** Gera ID único */
const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/** Gera credenciais mock realistas */
const generateMockCredentials = (tool: GSMTool, duration: number) => {
  const expiresAt = new Date(Date.now() + duration * 3600 * 1000);
  return {
    username: `tchova_${tool.key}_${genId().slice(0, 6)}`,
    password: Math.random().toString(36).slice(2, 12).toUpperCase(),
    url: tool.server?.url || 'https://gsm.tchova.digital',
    port: tool.server?.port,
    expiresAt: expiresAt.toISOString(),
  };
};

// ============================================
// HTTP CLIENT (para modo real)
// ============================================

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
}

const apiRequest = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const token = localStorage.getItem('tchova_auth_token');
  const url = `${API_BASE_URL}/${API_VERSION}${endpoint}`;

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// ============================================
// SERVICE INTERFACE
// ============================================

export interface IGSMApiService {
  getTools(filters?: ToolsFilterParams): Promise<PaginatedResult<GSMTool>>;
  getToolById(toolId: string): Promise<GSMTool>;
  getWallet(userId: string): Promise<GSMWallet>;
  rentTool(request: RentToolRequest): Promise<RentToolResponse>;
  getActiveRentals(userId: string): Promise<GSMRental[]>;
  getRentalHistory(userId: string, page?: number): Promise<PaginatedResult<GSMRental>>;
  cancelRental(rentalId: string, userId: string): Promise<{ success: boolean; refundAmount?: number }>;
  topupWallet(request: WalletTopupRequest): Promise<{ newBalance: number; transactionId: string }>;
  getTransactionHistory(userId: string, page?: number): Promise<PaginatedResult<GSMTransaction>>;
}

// ============================================
// MOCK IMPLEMENTATION
// ============================================

class GSMMockService implements IGSMApiService {
  async getTools(filters: ToolsFilterParams = {}): Promise<PaginatedResult<GSMTool>> {
    await mockDelay(200, 600);

    let tools = [...GSM_TOOLS];

    if (filters.category && filters.category !== 'all') {
      tools = tools.filter((t) => t.category === filters.category);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      tools = tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    if (filters.available !== undefined) {
      tools = tools.filter((t) => t.available === filters.available);
    }

    const page = filters.page || 1;
    const perPage = filters.perPage || 20;
    const start = (page - 1) * perPage;
    const items = tools.slice(start, start + perPage);

    return { items, total: tools.length, page, perPage, hasMore: start + perPage < tools.length };
  }

  async getToolById(toolId: string): Promise<GSMTool> {
    await mockDelay(100, 300);
    const tool = GSM_TOOLS.find((t) => t.id === toolId || t.key === toolId);
    if (!tool) throw new Error(`Ferramenta "${toolId}" não encontrada`);
    return tool;
  }

  async getWallet(userId: string): Promise<GSMWallet> {
    await mockDelay(200, 500);
    const key = `gsm_wallet_${userId}`;
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);

    // Create default wallet
    const wallet: GSMWallet = {
      userId,
      balance: { usd: 0, mtn: 0 },
      currency: 'MTN',
      level: 'cliente',
      totalRentals: 0,
      totalSpent: { usd: 0, mtn: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    localStorage.setItem(key, JSON.stringify(wallet));
    return wallet;
  }

  async rentTool(request: RentToolRequest): Promise<RentToolResponse> {
    await mockDelay(800, 1800); // Simulate processing time

    if (shouldFail()) throw new Error('Serviço temporariamente indisponível. Tente novamente.');

    const tool = await this.getToolById(request.toolId);
    const credentials = generateMockCredentials(tool, request.duration);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + request.duration * 3600 * 1000);

    const levelPricing = tool.pricing[request.userId ? 'cliente' : 'cliente'];
    const basePrice = levelPricing.usd;

    const rental: GSMRental = {
      id: genId(),
      transactionId: `TXN-${genId().toUpperCase()}`,
      toolId: tool.id,
      toolKey: tool.key,
      toolName: tool.name,
      userId: request.userId,
      userEmail: '',
      userName: '',
      duration: request.duration,
      durationMinutes: request.duration * 60,
      pricing: {
        basePrice: levelPricing,
        discount: 0,
        finalPrice: levelPricing,
        currency: request.currency,
      },
      status: 'active',
      credentials: {
        username: credentials.username,
        password: credentials.password,
        url: credentials.url,
        port: credentials.port,
        expiresAt,
        createdAt: now,
      },
      createdAt: now,
      startedAt: now,
      expiresAt,
    };

    // Persist rental
    const rentalsKey = `gsm_rentals_${request.userId}`;
    const existing = JSON.parse(localStorage.getItem(rentalsKey) || '[]');
    localStorage.setItem(rentalsKey, JSON.stringify([rental, ...existing]));

    return { rental, credentials };
  }

  async getActiveRentals(userId: string): Promise<GSMRental[]> {
    await mockDelay(200, 400);
    const key = `gsm_rentals_${userId}`;
    const rentals: GSMRental[] = JSON.parse(localStorage.getItem(key) || '[]');
    const now = new Date();
    return rentals.filter(
      (r) => r.status === 'active' && new Date(r.expiresAt) > now
    );
  }

  async getRentalHistory(userId: string, page = 1): Promise<PaginatedResult<GSMRental>> {
    await mockDelay(200, 500);
    const key = `gsm_rentals_${userId}`;
    const rentals: GSMRental[] = JSON.parse(localStorage.getItem(key) || '[]');
    const perPage = 10;
    const start = (page - 1) * perPage;
    const items = rentals.slice(start, start + perPage);
    return { items, total: rentals.length, page, perPage, hasMore: start + perPage < rentals.length };
  }

  async cancelRental(rentalId: string, userId: string): Promise<{ success: boolean; refundAmount?: number }> {
    await mockDelay(400, 800);
    const key = `gsm_rentals_${userId}`;
    const rentals: GSMRental[] = JSON.parse(localStorage.getItem(key) || '[]');
    const idx = rentals.findIndex((r) => r.id === rentalId);
    if (idx === -1) throw new Error('Aluguel não encontrado');
    rentals[idx].status = 'cancelled';
    rentals[idx].cancelledAt = new Date();
    localStorage.setItem(key, JSON.stringify(rentals));
    return { success: true, refundAmount: 0 };
  }

  async topupWallet(request: WalletTopupRequest): Promise<{ newBalance: number; transactionId: string }> {
    await mockDelay(1000, 2000);
    if (shouldFail()) throw new Error('Pagamento não processado. Verifique sua referência.');

    const wallet = await this.getWallet(request.userId);
    const addUSD = request.currency === 'USD' ? request.amount : request.amount / 64;
    wallet.balance.usd = (wallet.balance.usd || 0) + addUSD;
    wallet.balance.mtn = wallet.balance.usd * 64;
    wallet.updatedAt = new Date();
    localStorage.setItem(`gsm_wallet_${request.userId}`, JSON.stringify(wallet));

    const txId = `TOP-${genId().toUpperCase()}`;
    return { newBalance: wallet.balance.usd, transactionId: txId };
  }

  async getTransactionHistory(userId: string, page = 1): Promise<PaginatedResult<GSMTransaction>> {
    await mockDelay(200, 500);
    // Return empty list for mock since transactions are stored separately
    return { items: [], total: 0, page, perPage: 10, hasMore: false };
  }
}

// ============================================
// REAL API IMPLEMENTATION  
// ============================================

class GSMRealApiService implements IGSMApiService {
  async getTools(filters: ToolsFilterParams = {}): Promise<PaginatedResult<GSMTool>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v !== undefined && params.set(k, String(v)));
    return apiRequest<PaginatedResult<GSMTool>>(`/gsm/tools?${params}`);
  }

  async getToolById(toolId: string): Promise<GSMTool> {
    return apiRequest<GSMTool>(`/gsm/tools/${toolId}`);
  }

  async getWallet(userId: string): Promise<GSMWallet> {
    return apiRequest<GSMWallet>(`/gsm/wallet/${userId}`);
  }

  async rentTool(request: RentToolRequest): Promise<RentToolResponse> {
    return apiRequest<RentToolResponse>('/gsm/rentals', { method: 'POST', body: request });
  }

  async getActiveRentals(userId: string): Promise<GSMRental[]> {
    return apiRequest<GSMRental[]>(`/gsm/rentals/${userId}/active`);
  }

  async getRentalHistory(userId: string, page = 1): Promise<PaginatedResult<GSMRental>> {
    return apiRequest<PaginatedResult<GSMRental>>(`/gsm/rentals/${userId}/history?page=${page}`);
  }

  async cancelRental(rentalId: string, _userId: string): Promise<{ success: boolean; refundAmount?: number }> {
    return apiRequest(`/gsm/rentals/${rentalId}/cancel`, { method: 'POST' });
  }

  async topupWallet(request: WalletTopupRequest): Promise<{ newBalance: number; transactionId: string }> {
    return apiRequest('/gsm/wallet/topup', { method: 'POST', body: request });
  }

  async getTransactionHistory(userId: string, page = 1): Promise<PaginatedResult<GSMTransaction>> {
    return apiRequest<PaginatedResult<GSMTransaction>>(`/gsm/transactions/${userId}?page=${page}`);
  }
}

// ============================================
// FACTORY - returns correct implementation
// ============================================

export const gsmApiService: IGSMApiService = USE_REAL_API
  ? new GSMRealApiService()
  : new GSMMockService();

export default gsmApiService;
