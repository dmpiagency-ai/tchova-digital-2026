// Environment configuration with validation
// SECURITY NOTE: Never store passwords or sensitive credentials in frontend environment variables!
export const env = {
  // WhatsApp
  WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER || '258879097249',

  // GSM URLs
  GSM_SITE_URL: import.meta.env.VITE_GSM_SITE_URL || 'https://gsm.tchova.digital',
  GSM_TOOLS_REFERRAL_URL: import.meta.env.VITE_GSM_TOOLS_REFERRAL_URL || 'https://4youtechservice.com/',

  // App Info
  APP_NAME: import.meta.env.VITE_APP_NAME || 'TchovaDigital',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // API URLs (backend integration)
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.tchova.digital',
  PAYMENT_API_URL: import.meta.env.VITE_PAYMENT_API_URL || 'https://payment.tchova.digital',

  // Admin Configuration
  ADMIN_PASSWORD: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123',

  // Feature Flags
  ENABLE_GSM_FEATURES: import.meta.env.VITE_ENABLE_GSM_FEATURES === 'true',
  ENABLE_PAYMENT_FEATURES: import.meta.env.VITE_ENABLE_PAYMENT_FEATURES === 'true',
  ENABLE_ADMIN_PANEL: import.meta.env.VITE_ENABLE_ADMIN_PANEL === 'true',

  // Development helpers
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Validation function to ensure required environment variables are set
export const validateEnvironment = (): void => {
  const requiredVars: Array<keyof typeof env> = [
    'WHATSAPP_NUMBER',
    'GSM_SITE_URL',
    'API_BASE_URL',
    'PAYMENT_API_URL'
  ];

  const missingVars = requiredVars.filter(varName => !env[varName]);

  if (missingVars.length > 0 && env.isDevelopment) {
    console.warn('Missing environment variables:', missingVars);
    console.warn('Please check your .env file and ensure all required variables are set.');
  }

  // Security warnings for production
  if (env.isProduction) {
    if (env.API_BASE_URL.includes('localhost') || env.API_BASE_URL.includes('127.0.0.1')) {
      console.error('SECURITY WARNING: API URL points to localhost in production!');
    }

    // Warn if admin panel is enabled in production without proper backend auth
    if (env.ENABLE_ADMIN_PANEL) {
      console.warn('WARNING: Admin panel should use backend authentication in production!');
    }
  }
};

// Initialize validation
validateEnvironment();