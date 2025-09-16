import { motion } from "framer-motion";

const GLYPHS = ["ॐ", "अ", "ऋ", "क", "श", "ह"];

export default function FloatingGlyphs() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return null;
  
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {GLYPHS.map((g, i) => (
        <motion.div 
          key={i}
          className="absolute text-[64px] opacity-[0.06] select-none"
          style={{ left: `${10 + i * 14}%`, top: `${20 + (i % 3) * 18}%` }}
          animate={{ y: [0, -12, 0], rotate: [0, 4, -2, 0] }}
          transition={{ duration: 12 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          {g}
        </motion.div>
      ))}
    </div>
  );
}