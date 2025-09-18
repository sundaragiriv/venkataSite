import { motion } from "framer-motion";

export function BrandLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl", 
    lg: "text-2xl"
  };
  
  return (
    <motion.div 
      className={`font-bold ${sizes[size]} bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent`}
      whileHover={{ scale: 1.02 }}
    >
      Venkata<span className="text-vedic">.</span>
    </motion.div>
  );
}

export function BrandTagline() {
  return (
    <div className="text-sm text-slate-600 font-medium">
      SAP CX Architect • AI Pioneer • Vedic Wisdom
    </div>
  );
}

export function BrandMark() {
  return (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
      <span className="text-white font-bold text-sm">V</span>
    </div>
  );
}