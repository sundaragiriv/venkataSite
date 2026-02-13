import { useEffect } from 'react';
import { logger } from '../lib/logger';

interface AdBannerProps {
  slot: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function AdBanner({ 
  slot, 
  format = "auto", 
  responsive = true, 
  style = { display: 'block' },
  className = ""
}: AdBannerProps) {
  // Only show ads in production environment
  const isProduction = process.env.NODE_ENV === 'production';
  
  useEffect(() => {
    if (!isProduction) return;
    
    try {
      const windowWithAds = window as unknown as { adsbygoogle?: Array<Record<string, unknown>> };
      if (!windowWithAds.adsbygoogle) {
        windowWithAds.adsbygoogle = [];
      }
      windowWithAds.adsbygoogle.push({});
    } catch (err) {
      logger.error('AdSense error:', err);
    }
  }, [isProduction]);

  // Don't render anything in development
  if (!isProduction) {
    return null;
  }

  const handleAdClick = () => {
    // Track ad clicks for analytics
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'ad_click', {
        ad_slot: slot,
        event_category: 'monetization'
      });
    }
  };

  return (
    <div className={`ad-container ${className}`} onClick={handleAdClick}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-7260328688612412"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
}