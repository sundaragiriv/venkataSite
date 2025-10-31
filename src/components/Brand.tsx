import { motion } from "framer-motion";

export function BrandLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl", 
    lg: "text-2xl"
  };
  
  return (
    <motion.div 
      className={`font-bold ${sizes[size]} font-sans`}
      whileHover={{ scale: 1.02 }}
    >
      <span className="text-accent">Venkata</span><span className="text-white">.</span>
    </motion.div>
  );
}

export function BrandTagline() {
  return (
    <div className="text-sm text-secondary font-medium">
      SAP CX Architect • SAP AI Expert • Joule Integration • Vedic Leadership
    </div>
  );
}

export function BrandMark() {
  return (
    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
      <span className="text-black font-bold text-sm">V</span>
    </div>
  );
}