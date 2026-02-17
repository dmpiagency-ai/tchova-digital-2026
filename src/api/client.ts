/**
 * ============================================
 * TCHOVA DIGITAL - API CLIENT
 * ============================================
 * Cliente HTTP padronizado para todas as integrações
 * Com suporte a retry, timeout, e error handling
 */

import { APIResponse, APIRequest, APIClient, APIError } from './types';

// ============================================
// DEFAULT API CLIENT IMPLEMENTATION
// ============================================

export class DefaultAPIClient implements APIClient {
  baseURL: string;
  defaultHeaders: Record<string, string>;
  timeout: number;
  private retryAttempts: number;
  private retryDelay: number;

  constructor(
    baseURL: string, 
    defaultHeaders: Record<string, string> = {}, 
    timeout = 10000,
    retryAttempts = 3,
    retryDelay = 1000
  ) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...defaultHeaders
    };
    this.timeout = timeout;
    this.retryAttempts = retryAttempts;
    this.retryDelay = retryDelay;
  }

  /**
   * Core request method with retry logic
   */
  private async request<T>(endpoint: string, options: RequestInit, attempt = 1): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.defaultHeaders,
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        const error = await this.parseError(response);
        
        // Retry on 5xx errors
        if (response.status >= 500 && attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt);
          return this.request<T>(endpoint, options, attempt + 1);
        }

        return {
          success: false,
          error,
          timestamp: new Date().toISOString()
        };
      }

      // Parse successful response
      const data = await response.json();

      return {
        success: true,
        data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Handle network errors
      const apiError = this.handleError(error);
      
      // Retry on network errors
      if (apiError.retryable && attempt < this.retryAttempts) {
        await this.delay(this.retryDelay * attempt);
        return this.request<T>(endpoint, options, attempt + 1);
      }

      return {
        success: false,
        error: apiError,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Parse HTTP error response
   */
  private async parseError(response: Response): Promise<APIError> {
    let message = `HTTP ${response.status}: ${response.statusText}`;
    let details: Record<string, string> | undefined;

    try {
      const body = await response.json();
      if (body.message) message = body.message;
      if (body.errors) details = body.errors;
    } catch {
      // Ignore JSON parse errors
    }

    return {
      code: `HTTP_${response.status}`,
      message,
      details,
      retryable: response.status >= 500 || response.status === 429
    };
  }

  /**
   * Handle network/unknown errors
   */
  private handleError(error: unknown): APIError {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          code: 'TIMEOUT',
          message: 'Request timed out',
          retryable: true
        };
      }

      if (error.message.includes('fetch')) {
        return {
          code: 'NETWORK_ERROR',
          message: 'Network error - please check your connection',
          retryable: true
        };
      }

      return {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        retryable: false
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
      retryable: false
    };
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============================================
  // HTTP METHODS
  // ============================================

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<APIResponse<T>> {
    const url = params 
      ? `${endpoint}?${new URLSearchParams(params as Record<string, string>)}` 
      : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }
}

// ============================================
// API FACTORY
// ============================================

export class APIFactory {
  private clients: Map<string, APIClient> = new Map();

  /**
   * Create and register a new API client
   */
  createClient(
    name: string, 
    baseURL: string, 
    headers?: Record<string, string>,
    options?: { timeout?: number; retryAttempts?: number }
  ): APIClient {
    const client = new DefaultAPIClient(
      baseURL, 
      headers, 
      options?.timeout,
      options?.retryAttempts
    );
    this.clients.set(name, client);
    return client;
  }

  /**
   * Get an existing client by name
   */
  getClient(name: string): APIClient | undefined {
    return this.clients.get(name);
  }

  /**
   * Remove a client
   */
  removeClient(name: string): boolean {
    return this.clients.delete(name);
  }

  /**
   * List all registered clients
   */
  listClients(): string[] {
    return Array.from(this.clients.keys());
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const apiFactory = new APIFactory();

// ============================================
// HELPER FUNCTION
// ============================================

/**
 * Create a connected API with a single call
 */
export const createConnectedAPI = <T>(
  clientName: string,
  baseURL: string,
  apiCreator: (client: APIClient) => T,
  headers?: Record<string, string>
): T => {
  const client = apiFactory.createClient(clientName, baseURL, headers);
  return apiCreator(client);
};