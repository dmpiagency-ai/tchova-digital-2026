/**
 * ============================================
 * TCHOVA DIGITAL - API TYPES
 * ============================================
 * Tipos padronizados para todas as integrações de API
 */

// ============================================
// BASE API TYPES
// ============================================

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: APIError;
  message?: string;
  timestamp: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, string>;
  retryable?: boolean;
}

export interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

// ============================================
// API CLIENT INTERFACE
// ============================================

export interface APIClient {
  baseURL: string;
  defaultHeaders: Record<string, string>;
  timeout: number;

  get<T>(endpoint: string, params?: Record<string, unknown>): Promise<APIResponse<T>>;
  post<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>>;
  put<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>>;
  delete<T>(endpoint: string): Promise<APIResponse<T>>;
  patch<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>>;
}

// ============================================
// PAYMENT API TYPES
// ============================================

export interface PaymentAPI {
  processPayment(amount: number, method: string, userId: string): Promise<APIResponse<{
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
  }>>;
  verifyPayment(transactionId: string): Promise<APIResponse<{
    status: 'pending' | 'completed' | 'failed';
    amount: number;
  }>>;
  refundPayment(transactionId: string, amount?: number): Promise<APIResponse<{
    refundId: string;
    status: 'pending' | 'completed' | 'failed';
  }>>;
}

export interface PaymentConfig {
  apiKey?: string;
  merchantId?: string;
  webhookUrl?: string;
  supportedCurrencies: string[];
  minAmount: number;
  maxAmount: number;
  processingFee?: number;
}

// ============================================
// GSM API TYPES
// ============================================

export interface GSMAPI {
  getUserBalance(userId: string): Promise<APIResponse<{ balance: number }>>;
  getUserTransactions(userId: string): Promise<APIResponse<{
    transactions: GSMTransaction[];
  }>>;
  addCredits(userId: string, amount: number, description: string): Promise<APIResponse<{
    newBalance: number;
    transactionId: string;
  }>>;
  purchaseService(userId: string, serviceId: string): Promise<APIResponse<{
    success: boolean;
    message: string;
    remainingBalance: number;
  }>>;
}

export interface GSMTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  timestamp: string;
}

// ============================================
// ANALYTICS API TYPES
// ============================================

export interface AnalyticsAPI {
  trackEvent(event: string, data: Record<string, unknown>): Promise<APIResponse>;
  trackPageView(page: string, userId?: string): Promise<APIResponse>;
  getAnalyticsReport(dateRange: { start: string; end: string }): Promise<APIResponse<{
    pageViews: number;
    events: AnalyticsEvent[];
  }>>;
}

export interface AnalyticsEvent {
  event: string;
  count: number;
  parameters?: Record<string, unknown>;
}

// ============================================
// NOTIFICATION API TYPES
// ============================================

export interface NotificationAPI {
  sendNotification(userId: string, notification: NotificationPayload): Promise<APIResponse>;
  getUserNotifications(userId: string): Promise<APIResponse<{
    notifications: Notification[];
  }>>;
  markAsRead(notificationId: string): Promise<APIResponse>;
}

export interface NotificationPayload {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  actionUrl?: string;
}

export interface Notification extends NotificationPayload {
  id: string;
  read: boolean;
  timestamp: string;
}

// ============================================
// PLUGIN API TYPES
// ============================================

export interface PluginAPI {
  loadPlugin(pluginId: string): Promise<APIResponse<{
    plugin: PluginInfo;
  }>>;
  executePluginHook(pluginId: string, hook: string, data: unknown): Promise<APIResponse>;
  getAvailablePlugins(): Promise<APIResponse<{
    plugins: PluginInfo[];
  }>>;
}

export interface PluginInfo {
  id: string;
  name: string;
  version: string;
  description?: string;
  config: Record<string, unknown>;
  enabled: boolean;
}

// ============================================
// AI AGENT TYPES
// ============================================

export type AIModel = 
  | 'gpt-4' 
  | 'gpt-4-turbo' 
  | 'gpt-3.5-turbo' 
  | 'claude-3-opus' 
  | 'claude-3-sonnet' 
  | 'claude-3-haiku'
  | 'gemini-pro'
  | 'gemini-ultra'
  | 'llama2'
  | 'mistral'
  | 'codellama'
  | 'demo';

export type AIProvider = 'openai' | 'anthropic' | 'google' | 'local';

export interface AIRequest {
  prompt: string;
  model?: AIModel;
  maxTokens?: number;
  temperature?: number;
  context?: Record<string, unknown>;
  systemPrompt?: string;
}

export interface AIResponse {
  content: string;
  model: AIModel;
  provider: AIProvider;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: 'stop' | 'length' | 'content_filter' | 'error';
}

export interface AIAgentConfig {
  provider: AIProvider;
  apiKey?: string;
  model: AIModel;
  maxTokens: number;
  temperature: number;
  systemPrompt?: string;
}

// ============================================
// WEBHOOK TYPES
// ============================================

export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: Record<string, unknown>;
  signature?: string;
}

export interface WebhookConfig {
  url: string;
  secret?: string;
  events: string[];
  active: boolean;
}