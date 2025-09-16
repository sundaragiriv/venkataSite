import { useEffect } from "react";

export default function useSpotlight(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const el = document.documentElement;
    const tgt = document.getElementById("spotlight");
    if (!tgt) return;
    
    const onMove = (e: MouseEvent) => {
      tgt.style.setProperty("--mx", `${e.clientX}px`);
      tgt.style.setProperty("--my", `${e.clientY}px`);
    };
    
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [enabled]);
}