// 🔌 PLUG-IN SYSTEM: Basic Analytics Hook
// Simple analytics system ready for Firebase/Google Analytics integration

import React, { useCallback } from 'react';

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, unknown>;
}

// Extended analytics event with metadata
interface AnalyticsEventWithMetadata extends AnalyticsEvent {
  timestamp: string;
  sessionId: string;
  userAgent: string;
  url: string;
}

// Google Analytics gtag function type
type GtagFunction = (
  command: 'event' | 'config' | 'set',
  eventNameOrTarget: string,
  params?: Record<string, unknown>
) => void;

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: GtagFunction;
  }
}

// Mock analytics for development - ready to be replaced with real analytics
class AnalyticsService {
  private events: AnalyticsEventWithMetadata[] = [];
  private isEnabled = true;

  // Track any user interaction
  track(event: AnalyticsEvent): void {
    if (!this.isEnabled) return;

    // Add timestamp
    const eventWithTimestamp = {
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.events.push(eventWithTimestamp);
    console.log('📊 Analytics Event:', eventWithTimestamp);

    // Future: Send to Firebase/Google Analytics
    this.sendToAnalytics(eventWithTimestamp);
  }

  // Track page views
  trackPageView(page: string): void {
    this.track({
      action: 'page_view',
      category: 'navigation',
      label: page
    });
  }

  // Track button clicks
  trackButtonClick(buttonName: string, context?: string): void {
    this.track({
      action: 'button_click',
      category: 'interaction',
      label: buttonName,
      customParameters: { context }
    });
  }

  // Track WhatsApp interactions
  trackWhatsAppClick(context: string, message?: string): void {
    this.track({
      action: 'whatsapp_click',
      category: 'conversion',
      label: context,
      customParameters: {
        message: message?.substring(0, 100), // Truncate for privacy
        hasMessage: !!message
      }
    });
  }

  // Track form interactions
  trackFormInteraction(formName: string, action: 'start' | 'submit' | 'error', field?: string): void {
    this.track({
      action: `form_${action}`,
      category: 'form',
      label: formName,
      customParameters: { field }
    });
  }

  // Track service views
  trackServiceView(serviceName: string): void {
    this.track({
      action: 'service_view',
      category: 'engagement',
      label: serviceName
    });
  }

  // Track pricing interactions
  trackPricingInteraction(planName: string, action: 'view' | 'click' | 'purchase'): void {
    this.track({
      action: `pricing_${action}`,
      category: 'conversion',
      label: planName
    });
  }

  // Get session ID
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // Send to analytics service (Firebase/Google Analytics)
  private sendToAnalytics(event: AnalyticsEventWithMetadata): void {
    // Future Firebase integration
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_map: event.customParameters
      });
    }

    // Future Firebase Analytics integration
    // if (analytics) {
    //   logEvent(analytics, event.action, {
    //     ...event.customParameters,
    //     category: event.category,
    //     label: event.label,
    //     value: event.value
    //   });
    // }
  }

  // Get stored events (for debugging)
  getEvents(): AnalyticsEventWithMetadata[] {
    return [...this.events];
  }

  // Clear events (for testing)
  clearEvents(): void {
    this.events = [];
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

// Global analytics instance
export const analytics = new AnalyticsService();

// React hook for analytics
export const useAnalytics = () => {
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    analytics.track(event);
  }, []);

  const trackPageView = useCallback((page: string) => {
    analytics.trackPageView(page);
  }, []);

  const trackButtonClick = useCallback((buttonName: string, context?: string) => {
    analytics.trackButtonClick(buttonName, context);
  }, []);

  const trackWhatsAppClick = useCallback((context: string, message?: string) => {
    analytics.trackWhatsAppClick(context, message);
  }, []);

  const trackFormInteraction = useCallback((formName: string, action: 'start' | 'submit' | 'error', field?: string) => {
    analytics.trackFormInteraction(formName, action, field);
  }, []);

  const trackServiceView = useCallback((serviceName: string) => {
    analytics.trackServiceView(serviceName);
  }, []);

  const trackPricingInteraction = useCallback((planName: string, action: 'view' | 'click' | 'purchase') => {
    analytics.trackPricingInteraction(planName, action);
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackButtonClick,
    trackWhatsAppClick,
    trackFormInteraction,
    trackServiceView,
    trackPricingInteraction,
    getEvents: () => analytics.getEvents(),
    clearEvents: () => analytics.clearEvents(),
    setEnabled: (enabled: boolean) => analytics.setEnabled(enabled)
  };
};

// Auto-track page views
export const usePageTracking = (pageName?: string) => {
  const { trackPageView } = useAnalytics();

  React.useEffect(() => {
    const page = pageName || window.location.pathname;
    trackPageView(page);
  }, [pageName, trackPageView]);
};

// Auto-track component visibility
export const useVisibilityTracking = (componentName: string, threshold = 0.5) => {
  const { trackEvent } = useAnalytics();

  React.useEffect(() => {
    const element = document.querySelector(`[data-track="${componentName}"]`);
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackEvent({
              action: 'component_visible',
              category: 'engagement',
              label: componentName,
              customParameters: { threshold }
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [componentName, threshold, trackEvent]);
};