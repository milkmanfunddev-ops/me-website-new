import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";

interface ViewportFadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ViewportFade({
  children,
  className,
  delay = 0,
}: ViewportFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
