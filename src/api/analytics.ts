/**
 * ============================================
 * TCHOVA DIGITAL - ANALYTICS API
 * ============================================
 * Sistema de tracking e analytics
 */

import { APIResponse, AnalyticsEvent } from './types';

// ============================================
// TYPES
// ============================================

interface TrackingEvent {
  name: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: Date;
  parameters?: Record<string, unknown>;
}

interface PageView {
  path: string;
  title: string;
  referrer?: string;
  timestamp: Date;
  userId?: string;
}

interface ConversionEvent {
  type: string;
  value?: number;
  currency?: string;
  timestamp: Date;
}

// ============================================
// ANALYTICS SERVICE
// ============================================

class AnalyticsService {
  private events: TrackingEvent[] = [];
  private pageViews: PageView[] = [];
  private conversions: ConversionEvent[] = [];
  private isProduction: boolean;
  private debugMode: boolean;
  private userId?: string;
  private sessionId: string;

  constructor() {
    this.isProduction = import.meta.env.PROD;
    this.debugMode = import.meta.env.VITE_ANALYTICS_DEBUG === 'true';
    this.sessionId = this.generateSessionId();
    this.loadPersistedData();
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // ============================================
  // CORE TRACKING
  // ============================================

  /**
   * Track a custom event
   */
  async trackEvent(event: {
    name: string;
    category?: string;
    label?: string;
    value?: number;
    parameters?: Record<string, unknown>;
  }): Promise<APIResponse> {
    const trackingEvent: TrackingEvent = {
      name: event.name,
      category: event.category || 'general',
      label: event.label,
      value: event.value,
      timestamp: new Date(),
      parameters: {
        ...event.parameters,
        sessionId: this.sessionId,
        userId: this.userId,
        url: window.location.href,
        path: window.location.pathname
      }
    };

    this.events.push(trackingEvent);
    this.persistData();

    // Log in debug mode
    if (this.debugMode) {
      console.log('📊 Event tracked:', trackingEvent);
    }

    // Send to analytics providers
    this.sendToProviders(trackingEvent);

    return {
      success: true,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Track a page view
   */
  async trackPageView(page: string, userId?: string): Promise<APIResponse> {
    const pageView: PageView = {
      path: page,
      title: document.title,
      referrer: document.referrer,
      timestamp: new Date(),
      userId: userId || this.userId
    };

    this.pageViews.push(pageView);
    this.persistData();

    if (this.debugMode) {
      console.log('📄 Page view tracked:', pageView);
    }

    // Send to providers
    this.sendPageViewToProviders(pageView);

    return {
      success: true,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Track a conversion
   */
  async trackConversion(type: string, value?: number, currency = 'MZN'): Promise<APIResponse> {
    const conversion: ConversionEvent = {
      type,
      value,
      currency,
      timestamp: new Date()
    };

    this.conversions.push(conversion);
    this.persistData();

    if (this.debugMode) {
      console.log('💰 Conversion tracked:', conversion);
    }

    // Track as event too
    await this.trackEvent({
      name: 'conversion',
      category: 'business',
      label: type,
      value,
      parameters: { currency }
    });

    return {
      success: true,
      timestamp: new Date().toISOString()
    };
  }

  // ============================================
  // SPECIALIZED TRACKING
  // ============================================

  /**
   * Track WhatsApp click
   */
  trackWhatsAppClick(source: string, service?: string): void {
    this.trackEvent({
      name: 'whatsapp_click',
      category: 'engagement',
      label: source,
      parameters: {
        service,
        source
      }
    });
  }

  /**
   * Track service view
   */
  trackServiceView(serviceName: string): void {
    this.trackEvent({
      name: 'service_view',
      category: 'engagement',
      label: serviceName,
      parameters: {
        serviceName
      }
    });
  }

  /**
   * Track purchase
   */
  trackPurchase(transactionId: string, value: number, currency = 'MZN'): void {
    this.trackEvent({
      name: 'purchase',
      category: 'ecommerce',
      value,
      parameters: {
        transactionId,
        currency
      }
    });

    this.trackConversion('purchase', value, currency);
  }

  /**
   * Track form submission
   */
  trackFormSubmission(formName: string, success: boolean): void {
    this.trackEvent({
      name: 'form_submission',
      category: 'engagement',
      label: formName,
      parameters: {
        success
      }
    });
  }

  /**
   * Track error
   */
  trackError(errorType: string, errorMessage: string, fatal = false): void {
    this.trackEvent({
      name: 'error',
      category: 'technical',
      label: errorType,
      parameters: {
        errorMessage,
        fatal
      }
    });
  }

  // ============================================
  // USER MANAGEMENT
  // ============================================

  /**
   * Set user ID for tracking
   */
  setUserId(userId: string | undefined): void {
    this.userId = userId;
    
    if (this.debugMode) {
      console.log('👤 User ID set:', userId);
    }
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  // ============================================
  // REPORTING
  // ============================================

  /**
   * Get analytics report
   */
  async getAnalyticsReport(dateRange: { start: string; end: string }): Promise<APIResponse<{
    pageViews: number;
    events: AnalyticsEvent[];
  }>> {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    const filteredPageViews = this.pageViews.filter(
      pv => pv.timestamp >= startDate && pv.timestamp <= endDate
    );

    const filteredEvents = this.events.filter(
      e => e.timestamp >= startDate && e.timestamp <= endDate
    );

    // Aggregate events
    const eventCounts: Record<string, AnalyticsEvent> = {};
    filteredEvents.forEach(event => {
      if (!eventCounts[event.name]) {
        eventCounts[event.name] = {
          event: event.name,
          count: 0,
          parameters: event.parameters
        };
      }
      eventCounts[event.name].count++;
    });

    return {
      success: true,
      data: {
        pageViews: filteredPageViews.length,
        events: Object.values(eventCounts)
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get conversion summary
   */
  getConversionSummary(): {
    total: number;
    byType: Record<string, number>;
    totalValue: number;
  } {
    const byType: Record<string, number> = {};
    let totalValue = 0;

    this.conversions.forEach(conv => {
      byType[conv.type] = (byType[conv.type] || 0) + 1;
      if (conv.value) totalValue += conv.value;
    });

    return {
      total: this.conversions.length,
      byType,
      totalValue
    };
  }

  // ============================================
  // PROVIDER INTEGRATION
  // ============================================

  private sendToProviders(event: TrackingEvent): void {
    // Google Analytics 4
    if (this.isProduction && typeof window !== 'undefined' && (window as any).gtag) {
      try {
        (window as any).gtag('event', event.name, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
          ...event.parameters
        });
      } catch (error) {
        console.error('GA tracking error:', error);
      }
    }

    // Facebook Pixel
    if (this.isProduction && typeof window !== 'undefined' && (window as any).fbq) {
      try {
        (window as any).fbq('trackCustom', event.name, event.parameters);
      } catch (error) {
        console.error('FB Pixel tracking error:', error);
      }
    }
  }

  private sendPageViewToProviders(pageView: PageView): void {
    // Google Analytics 4
    if (this.isProduction && typeof window !== 'undefined' && (window as any).gtag) {
      try {
        (window as any).gtag('event', 'page_view', {
          page_path: pageView.path,
          page_title: pageView.title,
          page_referrer: pageView.referrer
        });
      } catch (error) {
        console.error('GA page view error:', error);
      }
    }
  }

  // ============================================
  // PERSISTENCE
  // ============================================

  private persistData(): void {
    try {
      // Keep only last 1000 events
      const events = this.events.slice(-1000);
      const pageViews = this.pageViews.slice(-500);
      const conversions = this.conversions.slice(-100);

      localStorage.setItem('analytics-data', JSON.stringify({
        events,
        pageViews,
        conversions,
        sessionId: this.sessionId
      }));
    } catch (error) {
      console.error('Failed to persist analytics data:', error);
    }
  }

  private loadPersistedData(): void {
    try {
      const data = JSON.parse(localStorage.getItem('analytics-data') || '{}');

      if (data.events) {
        this.events = data.events.map((e: TrackingEvent) => ({
          ...e,
          timestamp: new Date(e.timestamp)
        }));
      }

      if (data.pageViews) {
        this.pageViews = data.pageViews.map((pv: PageView) => ({
          ...pv,
          timestamp: new Date(pv.timestamp)
        }));
      }

      if (data.conversions) {
        this.conversions = data.conversions.map((c: ConversionEvent) => ({
          ...c,
          timestamp: new Date(c.timestamp)
        }));
      }

      if (data.sessionId) {
        this.sessionId = data.sessionId;
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    }
  }

  /**
   * Clear all analytics data
   */
  clearData(): void {
    this.events = [];
    this.pageViews = [];
    this.conversions = [];
    this.sessionId = this.generateSessionId();
    localStorage.removeItem('analytics-data');
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const analyticsService = new AnalyticsService();

// Convenience exports
export const trackEvent = (event: Parameters<typeof analyticsService.trackEvent>[0]) => 
  analyticsService.trackEvent(event);

export const trackPageView = (page: string, userId?: string) => 
  analyticsService.trackPageView(page, userId);

export const trackConversion = (type: string, value?: number) => 
  analyticsService.trackConversion(type, value);

export const trackWhatsAppClick = (source: string, service?: string) => 
  analyticsService.trackWhatsAppClick(source, service);

export const trackServiceView = (serviceName: string) => 
  analyticsService.trackServiceView(serviceName);

export default AnalyticsService;