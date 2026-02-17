/**
 * ============================================
 * TCHOVA DIGITAL - CONSOLIDATED CONFIGURATION
 * ============================================
 * Configuração centralizada para todas as APIs e serviços
 * Um único arquivo para gerir todas as credenciais e configurações
 */

// ============================================
// ENVIRONMENT DETECTION
// ============================================

export const environment = {
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  mode: import.meta.env.MODE,
  baseUrl: import.meta.env.BASE_URL
};

// ============================================
// APP CONFIGURATION
// ============================================

export const appConfig = {
  name: import.meta.env.VITE_APP_NAME || 'TchovaDigital',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  url: import.meta.env.VITE_APP_URL || 'https://tchovadigital.com'
};

// ============================================
// FIREBASE CONFIGURATION
// ============================================

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
  useEmulator: import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true'
};

export const isFirebaseConfigured = (): boolean => {
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId);
};

// ============================================
// WHATSAPP CONFIGURATION
// ============================================

export const whatsappConfig = {
  number: import.meta.env.VITE_WHATSAPP_NUMBER || '258879097249',
  defaultMessage: 'Olá! Gostaria de saber mais sobre os serviços da TchovaDigital.',
  businessName: 'TchovaDigital'
};

// ============================================
// PAYMENT CONFIGURATION
// ============================================

export const paymentConfig = {
  // M-Pesa (Vodacom Moçambique)
  mpesa: {
    enabled: true,
    shortcode: import.meta.env.VITE_MPESA_SHORTCODE || '',
    passkey: import.meta.env.VITE_MPESA_PASSKEY || '',
    consumerKey: import.meta.env.VITE_MPESA_CONSUMER_KEY || '',
    consumerSecret: import.meta.env.VITE_MPESA_CONSUMER_SECRET || '',
    apiKey: import.meta.env.VITE_MPESA_API_KEY || ''
  },

  // E-mola (Movitel)
  emola: {
    enabled: true,
    merchantId: import.meta.env.VITE_EMOLA_MERCHANT_ID || '',
    apiKey: import.meta.env.VITE_EMOLA_API_KEY || ''
  },

  // PayPal
  paypal: {
    enabled: true,
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_PAYPAL_CLIENT_SECRET || '',
    sandbox: import.meta.env.VITE_PAYPAL_SANDBOX !== 'false'
  },

  // Stripe (Cards)
  stripe: {
    enabled: true,
    publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
    secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || ''
  },

  // Crypto (NowPayments)
  crypto: {
    enabled: true,
    apiKey: import.meta.env.VITE_NOWPAYMENTS_API_KEY || ''
  }
};

// ============================================
// AI PROVIDERS CONFIGURATION
// ============================================

export const aiConfig = {
  // OpenAI
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    organization: import.meta.env.VITE_OPENAI_ORG_ID || '',
    defaultModel: (import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo') as 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo'
  },

  // Anthropic (Claude)
  anthropic: {
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
    defaultModel: (import.meta.env.VITE_ANTHROPIC_MODEL || 'claude-3-haiku') as 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku'
  },

  // Google AI
  google: {
    apiKey: import.meta.env.VITE_GOOGLE_AI_KEY || '',
    defaultModel: (import.meta.env.VITE_GOOGLE_AI_MODEL || 'gemini-pro') as 'gemini-pro' | 'gemini-ultra'
  },

  // Local AI (Ollama)
  local: {
    baseUrl: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434',
    defaultModel: import.meta.env.VITE_OLLAMA_MODEL || 'llama2'
  }
};

export const getAIProvider = (): 'openai' | 'anthropic' | 'google' | 'local' => {
  if (aiConfig.openai.apiKey) return 'openai';
  if (aiConfig.anthropic.apiKey) return 'anthropic';
  if (aiConfig.google.apiKey) return 'google';
  return 'local';
};

// ============================================
// ANALYTICS CONFIGURATION
// ============================================

export const analyticsConfig = {
  googleAnalyticsId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  facebookPixelId: import.meta.env.VITE_FB_PIXEL_ID || '',
  enableTracking: environment.isProduction && !import.meta.env.VITE_DISABLE_ANALYTICS,
  debugMode: import.meta.env.VITE_ANALYTICS_DEBUG === 'true'
};

// ============================================
// API ENDPOINTS
// ============================================

export const apiEndpoints = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.tchovadigital.com',
  paymentUrl: import.meta.env.VITE_PAYMENT_API_URL || 'https://payment.tchovadigital.com',
  timeout: 10000,
  retries: 3
};

// ============================================
// GSM SERVICES CONFIGURATION
// ============================================

export const gsmConfig = {
  siteUrl: import.meta.env.VITE_GSM_SITE_URL || 'https://gsm.tchova.digital',
  toolsReferralUrl: import.meta.env.VITE_GSM_TOOLS_REFERRAL_URL || 'https://4youtechservice.com/',
  enabled: import.meta.env.VITE_ENABLE_GSM_FEATURES !== 'false'
};

// ============================================
// FEATURE FLAGS
// ============================================

export const features = {
  enableLogin: import.meta.env.VITE_ENABLE_LOGIN !== 'false',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
  enablePayments: import.meta.env.VITE_ENABLE_PAYMENTS !== 'false',
  enableAdmin: import.meta.env.VITE_ENABLE_ADMIN === 'true',
  enableGSM: import.meta.env.VITE_ENABLE_GSM_FEATURES !== 'false',
  enableAI: import.meta.env.VITE_ENABLE_AI !== 'false'
};

// ============================================
// VALIDATION
// ============================================

export interface ConfigValidation {
  valid: boolean;
  issues: string[];
  warnings: string[];
}

export const validateConfig = (): ConfigValidation => {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check Firebase in production
  if (environment.isProduction && !isFirebaseConfigured()) {
    issues.push('Firebase não configurado para produção');
  }

  // Check WhatsApp
  if (!whatsappConfig.number) {
    warnings.push('Número do WhatsApp não configurado');
  }

  // Check payments
  if (features.enablePayments) {
    if (!paymentConfig.mpesa.apiKey && !paymentConfig.emola.apiKey) {
      warnings.push('Pagamentos móveis (M-Pesa/E-mola) não configurados - usando modo demo');
    }
  }

  // Check AI
  if (features.enableAI && !aiConfig.openai.apiKey && !aiConfig.anthropic.apiKey && !aiConfig.google.apiKey) {
    warnings.push('Nenhum provedor de IA configurado - usando modo demo');
  }

  // Check analytics in production
  if (environment.isProduction && !analyticsConfig.googleAnalyticsId) {
    warnings.push('Google Analytics não configurado para produção');
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings
  };
};

// ============================================
// STATUS HELPERS
// ============================================

export const getConfigStatus = () => {
  const validation = validateConfig();

  return {
    environment: environment.mode,
    firebase: isFirebaseConfigured() ? 'configured' : 'missing',
    whatsapp: whatsappConfig.number ? 'configured' : 'missing',
    payments: {
      mpesa: paymentConfig.mpesa.apiKey ? 'configured' : 'demo',
      emola: paymentConfig.emola.apiKey ? 'configured' : 'demo',
      paypal: paymentConfig.paypal.clientId ? 'configured' : 'demo',
      stripe: paymentConfig.stripe.publicKey ? 'configured' : 'demo'
    },
    ai: {
      provider: getAIProvider(),
      configured: !!(aiConfig.openai.apiKey || aiConfig.anthropic.apiKey || aiConfig.google.apiKey)
    },
    analytics: analyticsConfig.googleAnalyticsId ? 'configured' : 'missing',
    features,
    validation
  };
};

// ============================================
// DEBUG HELPER
// ============================================

export const logConfigStatus = (): void => {
  if (!environment.isDevelopment) return;

  const status = getConfigStatus();

  console.group('🔧 TchovaDigital Configuration');
  console.log('Environment:', status.environment);
  console.log('Firebase:', status.firebase);
  console.log('WhatsApp:', status.whatsapp);
  console.log('Payments:', status.payments);
  console.log('AI:', status.ai);
  console.log('Analytics:', status.analytics);
  console.log('Features:', status.features);

  if (status.validation.warnings.length > 0) {
    console.warn('Warnings:', status.validation.warnings);
  }

  if (status.validation.issues.length > 0) {
    console.error('Issues:', status.validation.issues);
  }

  console.groupEnd();
};

export default {
  environment,
  appConfig,
  firebaseConfig,
  whatsappConfig,
  paymentConfig,
  aiConfig,
  analyticsConfig,
  apiEndpoints,
  gsmConfig,
  features,
  validateConfig,
  getConfigStatus,
  logConfigStatus
};