/**
 * Global type definitions
 */

export interface WindowWithAnalytics extends Window {
  gtag?: (...args: unknown[]) => void;
  clarity?: (...args: unknown[]) => void;
  adsbygoogle?: Array<Record<string, unknown>>;
}

export interface AnalyticsEvent {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: unknown;
}


