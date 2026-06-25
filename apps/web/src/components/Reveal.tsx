import type { ReactNode } from "react";

export function Reveal({ children, className = "", variant = "up" }: { children: ReactNode; className?: string; variant?: "up" | "left" | "right" | "scale" | "fade" }) {
  return <div className={`reveal-on-scroll reveal-${variant} ${className}`.trim()}>{children}</div>;
}
