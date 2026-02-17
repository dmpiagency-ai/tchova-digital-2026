/**
 * ============================================
 * TCHOVA DIGITAL - CENTRALIZED API REGISTRY
 * ============================================
 * Ponto único de entrada para todas as integrações de API
 * Arquitetura plug-and-play para fácil conexão/desconexão de serviços
 */

// ============================================
// TYPES
// ============================================

export type { 
  APIResponse, 
  APIRequest, 
  APIClient as APIClientInterface,
  PaymentAPI,
  GSMAPI,
  AnalyticsAPI,
  NotificationAPI,
  PluginAPI,
  APIError,
  AIModel, 
  AIRequest, 
  AIResponse,
  AIProvider,
  AIAgentConfig
} from './types';

// ============================================
// CORE API CLIENTS
// ============================================

export { DefaultAPIClient as APIClient, APIFactory, apiFactory, createConnectedAPI } from './client';

// ============================================
// FIREBASE INTEGRATION
// ============================================

export { 
  auth, 
  db, 
  analytics,
  app,
  firebaseFeatures,
  getFirebaseStatus,
  getDocument,
  getCollection,
  setDocument,
  deleteDocument
} from './firebase';

// ============================================
// PAYMENT SERVICES
// ============================================

export { paymentService } from './payments';
export type { 
  PaymentMethod, 
  PaymentRequest, 
  PaymentResult 
} from './payments';

// ============================================
// AI AGENT INTEGRATION
// ============================================

export { aiAgent, AIAgentService } from './ai-agent';

// ============================================
// GSM SERVICES
// ============================================

export { gsmService } from './gsm';
export type { GSMService, GSMBrand, GSMTool } from './gsm';

// ============================================
// ANALYTICS & TRACKING
// ============================================

export { 
  analyticsService,
  trackEvent, 
  trackPageView, 
  trackConversion,
  trackWhatsAppClick,
  trackServiceView
} from './analytics';

// ============================================
// CONFIGURATION STATUS
// ============================================

import { getFirebaseStatus } from './firebase';
import { paymentService } from './payments';
import { aiAgent } from './ai-agent';
import type { PaymentMethod } from './payments';

/**
 * Get overall API status
 */
export const getAPIStatus = () => {
  const methods = paymentService.getAvailablePaymentMethods();
  return {
    firebase: getFirebaseStatus(),
    payments: {
      methods: methods.length,
      enabled: methods.map((m: PaymentMethod) => m.id)
    },
    ai: {
      configured: aiAgent.isConfigured(),
      provider: aiAgent.getProvider()
    },
    timestamp: new Date().toISOString()
  };
};

/**
 * Check if all services are ready
 */
export const isAPIReady = (): boolean => {
  const status = getAPIStatus();
  return status.firebase.configured || status.ai.configured;
};

// ============================================
// INITIALIZATION HELPER
// ============================================

/**
 * Initialize all API services
 * Call this early in the app lifecycle
 */
export const initializeAPIs = async (): Promise<void> => {
  // Firebase initializes automatically on import
  
  // Log status in development
  if (import.meta.env.DEV) {
    const methods = paymentService.getAvailablePaymentMethods();
    console.group('🔌 API Status');
    console.log('Firebase:', getFirebaseStatus());
    console.log('Payments:', methods.map((m: PaymentMethod) => m.name));
    console.log('AI Agent:', aiAgent.getProvider(), aiAgent.isConfigured() ? '(configured)' : '(demo mode)');
    console.groupEnd();
  }
};

export default {
  getAPIStatus,
  isAPIReady,
  initializeAPIs
};
