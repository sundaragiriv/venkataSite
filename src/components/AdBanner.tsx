import { useEffect } from 'react';

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
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log('AdSense error:', err);
    }
  }, [isProduction]);

  // Don't render anything in development to avoid empty spaces
  if (!isProduction) {
    return (
      <div className={`ad-placeholder ${className}`} style={{ 
        ...style, 
        backgroundColor: '#1a1a1a', 
        border: '2px dashed #00ff41',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        color: '#00ff41',
        minHeight: '60px'
      }}>
        💰 Ad Space (Production Only)
      </div>
    );
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