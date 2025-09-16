import { motion } from "framer-motion";

export default function MotionCard({ children, className = "", ...props }: any) {
  return (
    <motion.div 
      whileHover={{ y: -4 }} 
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`rounded-2xl bg-white border border-black/10 p-6 shadow-soft hover:shadow-lift ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}