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
        backgroundColor: '#f1f5f9', 
        border: '2px dashed #cbd5e1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        color: '#64748b',
        minHeight: '60px'
      }}>
        Ad Space (Production Only)
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`}>
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