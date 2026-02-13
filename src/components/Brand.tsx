import { motion } from "framer-motion";

const iconSizes = { sm: 28, md: 34, lg: 42 };
const textSizes = { sm: "text-base", md: "text-lg", lg: "text-xl" };

function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer hexagonal frame */}
      <path
        d="M20 2L36 11V29L20 38L4 29V11L20 2Z"
        stroke="#00ff41"
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
      />
      {/* Inner V + S monogram paths */}
      <path
        d="M12 12L20 28L28 12"
        stroke="#00ff41"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Subtle circuit node dots */}
      <circle cx="12" cy="12" r="1.5" fill="#00ff41" opacity="0.6" />
      <circle cx="28" cy="12" r="1.5" fill="#00ff41" opacity="0.6" />
      <circle cx="20" cy="28" r="1.5" fill="#00ff41" />
    </svg>
  );
}

export function BrandLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <motion.div
      className="flex items-center gap-2.5"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <LogoMark size={iconSizes[size]} />
      <span className={`${textSizes[size]} font-sans font-semibold tracking-tight`}>
        <span className="text-white">venkata</span>
        <span className="text-[#00ff41]">.</span>
      </span>
    </motion.div>
  );
}

export function BrandTagline() {
  return (
    <div className="text-sm text-muted font-medium font-mono">
      SAP CX Architect &bull; AI Pioneer &bull; Vedic Wisdom
    </div>
  );
}

export function BrandMark() {
  return <LogoMark size={32} />;
}