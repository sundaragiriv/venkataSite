import { useState } from "react";

export default function SmartImage({ src, alt, w, h }: { src: string; alt: string; w: number; h: number }) {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div style={{ aspectRatio: `${w}/${h}` }} className={`overflow-hidden rounded-xl bg-black/5 ${loaded ? "" : "animate-pulse"}`}>
      <img 
        src={src} 
        alt={alt} 
        loading="lazy" 
        decoding="async" 
        width={w} 
        height={h}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition duration-500 ${loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"}`}
      />
    </div>
  );
}