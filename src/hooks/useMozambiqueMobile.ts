// 🔌 PLUG-IN SYSTEM: Mozambique Mobile Optimization Hook
// Specialized mobile optimizations for Mozambican users

import { useState, useEffect } from 'react';

// Network Information API interface
interface NetworkInformation {
  effectiveType?: string;
  downlink?: number;
  addEventListener(type: 'change', listener: () => void): void;
  removeEventListener(type: 'change', listener: () => void): void;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

export interface MobileDeviceInfo {
  isMobile: boolean;
  isSlowConnection: boolean;
  prefersWhatsApp: boolean;
  screenSize: 'small' | 'medium' | 'large';
  connectionType: 'fast' | 'slow' | 'unknown';
  touchEnabled: boolean;
}

export const useMozambiqueMobile = (): MobileDeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<MobileDeviceInfo>({
    isMobile: false,
    isSlowConnection: false,
    prefersWhatsApp: true, // Default for Mozambique
    screenSize: 'large',
    connectionType: 'unknown',
    touchEnabled: false
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Detect mobile devices (common in Mozambique)
      const isMobile = width < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // Screen size classification
      let screenSize: 'small' | 'medium' | 'large' = 'large';
      if (width < 480) screenSize = 'small';
      else if (width < 768) screenSize = 'medium';

      // Detect slow connections (common in Mozambique)
      const nav = navigator as NavigatorWithConnection;
      const connection = nav.connection ||
                        nav.mozConnection ||
                        nav.webkitConnection;

      let isSlowConnection = false;
      let connectionType: 'fast' | 'slow' | 'unknown' = 'unknown';

      if (connection) {
        const effectiveType = connection.effectiveType;
        const downlink = connection.downlink ?? 10; // Default to fast if unknown

        // Consider slow if 2G, slow 3G, or very low bandwidth
        isSlowConnection = effectiveType === 'slow-2g' ||
                          effectiveType === '2g' ||
                          (effectiveType === '3g' && downlink < 1) ||
                          downlink < 0.5;

        connectionType = isSlowConnection ? 'slow' : 'fast';
      } else {
        // Fallback: assume potentially slow in Mozambique
        isSlowConnection = width < 768; // Mobile devices likely have slower connections
        connectionType = isSlowConnection ? 'slow' : 'fast';
      }

      // Touch detection
      const touchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // WhatsApp preference (very high in Mozambique)
      const prefersWhatsApp = true; // Always prefer WhatsApp for Mozambican market

      setDeviceInfo({
        isMobile,
        isSlowConnection,
        prefersWhatsApp,
        screenSize,
        connectionType,
        touchEnabled
      });
    };

    updateDeviceInfo();

    // Listen for changes
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    // Listen for connection changes
    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection ||
                      nav.mozConnection ||
                      nav.webkitConnection;

    if (connection) {
      const handleConnectionChange = () => updateDeviceInfo();
      connection.addEventListener('change', handleConnectionChange);

      return () => {
        window.removeEventListener('resize', updateDeviceInfo);
        window.removeEventListener('orientationchange', updateDeviceInfo);
        connection.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
};

// Hook for conditional rendering based on connection speed
export const useConnectionAware = () => {
  const { isSlowConnection, connectionType } = useMozambiqueMobile();

  const shouldReduceAnimations = isSlowConnection;
  const shouldLazyLoadImages = isSlowConnection;
  const shouldSimplifyUI = isSlowConnection && connectionType === 'slow';

  return {
    shouldReduceAnimations,
    shouldLazyLoadImages,
    shouldSimplifyUI,
    connectionType
  };
};

// Hook for WhatsApp optimization
export const useWhatsAppOptimization = () => {
  const { prefersWhatsApp, isMobile } = useMozambiqueMobile();

  // Pre-load WhatsApp if user prefers it
  useEffect(() => {
    if (prefersWhatsApp && isMobile) {
      // Pre-connect to WhatsApp (helps with slower connections)
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = 'https://wa.me';
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [prefersWhatsApp, isMobile]);

  return {
    prefersWhatsApp,
    shouldPrioritizeWhatsApp: prefersWhatsApp && isMobile
  };
};

// Hook for touch-friendly interactions
export const useTouchFriendly = () => {
  const { touchEnabled, screenSize } = useMozambiqueMobile();

  const minTouchTarget = touchEnabled ? 44 : 32; // Minimum touch target size
  const optimalButtonSize = screenSize === 'small' ? 48 : screenSize === 'medium' ? 44 : 40;

  return {
    touchEnabled,
    minTouchTarget,
    optimalButtonSize,
    shouldUseLargeButtons: screenSize === 'small' || touchEnabled
  };
};