import type { LucideIcon } from "lucide-react";

export function TrustBadge({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="trust-badge">
      <span className="trust-icon"><Icon size={19} aria-hidden="true" /></span>
      <div><strong>{title}</strong><p>{text}</p></div>
    </div>
  );
}
