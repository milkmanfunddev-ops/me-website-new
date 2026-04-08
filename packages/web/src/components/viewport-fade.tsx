import { useRef, useEffect, useState, type ReactNode } from "react";

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
  // Start visible (SSR-safe) — hide only after client mount
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-80px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Before hydration: fully visible. After: animate in.
  const shouldHide = mounted && !isVisible;

  return (
    <div
      ref={ref}
      className={className}
      style={
        shouldHide
          ? {
              opacity: 0,
              transform: "translateY(24px)",
              transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
            }
          : mounted
            ? {
                opacity: 1,
                transform: "translateY(0)",
                transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
              }
            : undefined
      }
    >
      {children}
    </div>
  );
}
