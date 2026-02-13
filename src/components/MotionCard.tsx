import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface MotionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function MotionCard({ children, className = "", ...props }: MotionCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }} 
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "rounded-2xl bg-dark-card border border-dark-tertiary p-6 shadow-soft hover:shadow-lift",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}