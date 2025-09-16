import { motion, type HTMLMotionProps } from "framer-motion";

export const FadeIn = (p: HTMLMotionProps<"div">) => (
  <motion.div 
    initial={{ opacity: 0, y: 12 }} 
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "0px 0px -80px 0px" }} 
    transition={{ duration: 0.45 }} 
    {...p}
  />
);

export default FadeIn;