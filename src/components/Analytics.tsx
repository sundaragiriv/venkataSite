import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    clarity: (...args: any[]) => void;
  }
}

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    // Track page views with Google Analytics
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_path: location.pathname + location.search,
      });
    }

    // Track page views with Microsoft Clarity
    if (typeof window.clarity === 'function') {
      window.clarity('set', 'page', location.pathname);
    }
  }, [location]);

  return null;
}

// Custom event tracking functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, parameters);
  }
};

export const trackDownload = (fileName: string) => {
  trackEvent('download', {
    file_name: fileName,
    event_category: 'engagement',
    event_label: fileName
  });
};

export const trackAdClick = (adSlot: string, position: string) => {
  trackEvent('ad_click', {
    ad_slot: adSlot,
    ad_position: position,
    event_category: 'monetization'
  });
};