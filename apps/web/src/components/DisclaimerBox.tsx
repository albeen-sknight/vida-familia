import { Info } from "lucide-react";

export function DisclaimerBox({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <aside className={`disclaimer ${compact ? "disclaimer-compact" : ""}`}>
      <Info aria-hidden="true" size={20} />
      <div>{children}</div>
    </aside>
  );
}
