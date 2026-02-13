import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { WindowWithAnalytics, AnalyticsEvent } from '../lib/types';

const windowWithAnalytics = window as unknown as WindowWithAnalytics;

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    // Track page views with Google Analytics
    if (typeof windowWithAnalytics.gtag === 'function') {
      windowWithAnalytics.gtag('config', 'G-XXXXXXXXXX', {
        page_path: location.pathname + location.search,
      });
    }

    // Track page views with Microsoft Clarity
    if (typeof windowWithAnalytics.clarity === 'function') {
      windowWithAnalytics.clarity('set', 'page', location.pathname);
    }
  }, [location]);

  return null;
}

// Custom event tracking functions
export const trackEvent = (eventName: string, parameters?: AnalyticsEvent): void => {
  if (typeof windowWithAnalytics.gtag === 'function') {
    windowWithAnalytics.gtag('event', eventName, parameters);
  }
};

export const trackDownload = (fileName: string): void => {
  trackEvent('download', {
    file_name: fileName,
    event_category: 'engagement',
    event_label: fileName
  });
};

export const trackAdClick = (adSlot: string, position: string): void => {
  trackEvent('ad_click', {
    ad_slot: adSlot,
    ad_position: position,
    event_category: 'monetization'
  });
};