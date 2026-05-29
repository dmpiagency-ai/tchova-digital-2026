// 🔌 PLUG-IN SYSTEM: Firebase Analytics Hook
// Easily connect/disconnect Firebase Analytics without breaking code

import { useEffect } from 'react';
import { logEvent, setUserProperties, setUserId } from 'firebase/analytics';
import { isFeatureEnabled } from '@/config/features';
import { analytics } from '@/config/firebase';

// 🔌 PLUG-IN: Analytics Event Types
interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, unknown>;
}

// 🔌 PLUG-IN: Predefined Events for TchovaDigital
export const ANALYTICS_EVENTS = {
  // User Actions
  LOGIN: 'login',
  SIGNUP: 'sign_up',
  LOGOUT: 'logout',

  // Page Views
  PAGE_VIEW: 'page_view',
  SERVICE_VIEW: 'service_view',
  PRICING_VIEW: 'pricing_view',

  // Interactions
  WHATSAPP_CLICK: 'whatsapp_click',
  FORM_SUBMIT: 'form_submit',
  CTA_CLICK: 'cta_click',

  // Conversions
  LEAD_CAPTURE: 'lead_capture',
  PAYMENT_START: 'payment_start',
  PAYMENT_COMPLETE: 'payment_complete',

  // Service Specific
  DESIGN_SERVICE_CLICK: 'design_service_click',
  WEB_SERVICE_CLICK: 'web_service_click',
  MARKETING_SERVICE_CLICK: 'marketing_service_click',
  GSM_SERVICE_CLICK: 'gsm_service_click'
} as const;

// 🔌 PLUG-IN: Analytics Hook Interface
interface UseFirebaseAnalyticsReturn {
  // Event Tracking
  trackEvent: (event: AnalyticsEvent) => void;
  trackPageView: (pageName: string, parameters?: Record<string, unknown>) => void;
  trackServiceView: (serviceName: string) => void;
  trackWhatsAppClick: (source: string, service?: string) => void;
  trackFormSubmit: (formName: string, success: boolean) => void;

  // User Tracking
  setUser: (userId: string, properties?: Record<string, unknown>) => void;
  trackConversion: (conversionType: string, value?: number) => void;

  // E-commerce Tracking
  trackProductView: (product: string, category: string) => void;
  trackPurchase: (transactionId: string, value: number, currency: string) => void;
}

// 🔌 PLUG-IN: Analytics Hook Implementation
export const useFirebaseAnalytics = (): UseFirebaseAnalyticsReturn => {
  const analyticsEnabled = isFeatureEnabled('analytics') && !!analytics;

  // 🔌 PLUG-IN: Generic Event Tracker
  const trackEvent = ({ name, parameters = {} }: AnalyticsEvent) => {
    if (!analyticsEnabled || !analytics) {
      console.log('📊 Analytics Event (disabled):', name, parameters);
      return;
    }

    try {
      logEvent(analytics, name, parameters);
    } catch (error) {
      console.error('Analytics event error:', error);
    }
  };

  // 🔌 PLUG-IN: Page View Tracking
  const trackPageView = (pageName: string, parameters: Record<string, unknown> = {}) => {
    trackEvent({
      name: ANALYTICS_EVENTS.PAGE_VIEW,
      parameters: {
        page_title: pageName,
        page_location: window.location.href,
        ...parameters
      }
    });
  };

  // 🔌 PLUG-IN: Service View Tracking
  const trackServiceView = (serviceName: string) => {
    trackEvent({
      name: ANALYTICS_EVENTS.SERVICE_VIEW,
      parameters: {
        service_name: serviceName,
        service_category: getServiceCategory(serviceName)
      }
    });
  };

  // 🔌 PLUG-IN: WhatsApp Click Tracking
  const trackWhatsAppClick = (source: string, service?: string) => {
    trackEvent({
      name: ANALYTICS_EVENTS.WHATSAPP_CLICK,
      parameters: {
        click_source: source,
        service_name: service || 'general',
        whatsapp_number: process.env.VITE_WHATSAPP_NUMBER
      }
    });
  };

  // 🔌 PLUG-IN: Form Submit Tracking
  const trackFormSubmit = (formName: string, success: boolean) => {
    trackEvent({
      name: ANALYTICS_EVENTS.FORM_SUBMIT,
      parameters: {
        form_name: formName,
        form_success: success,
        form_category: getFormCategory(formName)
      }
    });
  };

  // 🔌 PLUG-IN: User Identification
  const setUser = (userId: string, properties: Record<string, unknown> = {}) => {
    if (!analyticsEnabled || !analytics) {
      console.log('👤 User Set (disabled):', userId, properties);
      return;
    }

    try {
      setUserId(analytics, userId);
      if (Object.keys(properties).length > 0) {
        setUserProperties(analytics, properties);
      }
    } catch (error) {
      console.error('Analytics user set error:', error);
    }
  };

  // 🔌 PLUG-IN: Conversion Tracking
  const trackConversion = (conversionType: string, value?: number) => {
    trackEvent({
      name: 'conversion',
      parameters: {
        conversion_type: conversionType,
        value: value || 0,
        currency: 'MZN'
      }
    });
  };

  // 🔌 PLUG-IN: E-commerce Product View
  const trackProductView = (product: string, category: string) => {
    trackEvent({
      name: 'view_item',
      parameters: {
        items: [{
          item_name: product,
          item_category: category
        }]
      }
    });
  };

  // 🔌 PLUG-IN: E-commerce Purchase
  const trackPurchase = (transactionId: string, value: number, currency: string) => {
    trackEvent({
      name: 'purchase',
      parameters: {
        transaction_id: transactionId,
        value: value,
        currency: currency,
        items: [{
          item_name: 'service_package',
          quantity: 1
        }]
      }
    });
  };

  // 🔌 PLUG-IN: Auto-track page views
  useEffect(() => {
    if (!analyticsEnabled || !analytics) return;

    const trackCurrentPage = () => {
      const pageName = document.title || window.location.pathname;
      trackPageView(pageName);
    };

    // Track initial page load
    trackCurrentPage();

    // Track page changes (for SPAs)
    const handleLocationChange = () => {
      setTimeout(trackCurrentPage, 100);
    };

    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [analyticsEnabled, analytics]);

  return {
    trackEvent,
    trackPageView,
    trackServiceView,
    trackWhatsAppClick,
    trackFormSubmit,
    setUser,
    trackConversion,
    trackProductView,
    trackPurchase
  };
};

// 🔌 PLUG-IN: Unified Analytics Hook - Always call both hooks internally to satisfy React rules
// This hook decides at runtime which implementation to use based on feature flag
export const useAnalytics = (): UseFirebaseAnalyticsReturn => {
  const analyticsEnabled = isFeatureEnabled('analytics');
  
  // Always call both hooks to satisfy React Hooks rules
  const firebaseAnalytics = useFirebaseAnalytics();
  const mockAnalytics = useMockAnalytics();
  
  // Return the appropriate implementation based on feature flag
  return analyticsEnabled ? firebaseAnalytics : mockAnalytics;
};

// 🔌 PLUG-IN: Mock Analytics for Development
// This hook is always called to satisfy React Hooks rules, but only used when analytics is disabled
export const useMockAnalytics = (): UseFirebaseAnalyticsReturn => {
  const trackEvent = ({ name, parameters = {} }: AnalyticsEvent) => {
    console.log('📊 Mock Analytics Event:', name, parameters);
  };

  const trackPageView = (pageName: string, parameters: Record<string, unknown> = {}) => {
    console.log('📄 Mock Page View:', pageName, parameters);
  };

  const trackServiceView = (serviceName: string) => {
    console.log('🔧 Mock Service View:', serviceName);
  };

  const trackWhatsAppClick = (source: string, service?: string) => {
    console.log('💬 Mock WhatsApp Click:', { source, service });
  };

  const trackFormSubmit = (formName: string, success: boolean) => {
    console.log('📝 Mock Form Submit:', { formName, success });
  };

  const setUser = (userId: string, properties: Record<string, unknown> = {}) => {
    console.log('👤 Mock User Set:', userId, properties);
  };

  const trackConversion = (conversionType: string, value?: number) => {
    console.log('🎯 Mock Conversion:', { conversionType, value });
  };

  const trackProductView = (product: string, category: string) => {
    console.log('🛍️ Mock Product View:', { product, category });
  };

  const trackPurchase = (transactionId: string, value: number, currency: string) => {
    console.log('💰 Mock Purchase:', { transactionId, value, currency });
  };

  return {
    trackEvent,
    trackPageView,
    trackServiceView,
    trackWhatsAppClick,
    trackFormSubmit,
    setUser,
    trackConversion,
    trackProductView,
    trackPurchase
  };
};

// 🔌 PLUG-IN: Helper Functions
const getServiceCategory = (serviceName: string): string => {
  const categories: Record<string, string> = {
    'Design': 'design',
    'Web': 'web',
    'Marketing': 'marketing',
    'GSM': 'gsm',
    'Audiovisual': 'audiovisual'
  };

  return categories[serviceName] || 'general';
};

const getFormCategory = (formName: string): string => {
  const categories: Record<string, string> = {
    'contact': 'contact',
    'newsletter': 'newsletter',
    'lead': 'lead_capture',
    'payment': 'payment'
  };

  return categories[formName] || 'general';
};