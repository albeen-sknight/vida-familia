import { Check } from "lucide-react";

export function PackageCard({ name, tier, description, features, featured = false }: { name: string; tier: string; description: string; features: string[]; featured?: boolean }) {
  return (
    <article className={`package-card ${featured ? "package-featured" : ""}`}>
      <p className="package-tier">{tier}</p>
      <h3>{name}</h3>
      <p>{description}</p>
      <ul>{features.map((feature) => <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>)}</ul>
    </article>
  );
}
