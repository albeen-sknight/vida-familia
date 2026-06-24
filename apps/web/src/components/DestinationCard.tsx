import { ArrowUpLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";

export function DestinationCard({ country, title, city, description, services, href, action }: { country: "spain" | "argentina"; title: string; city: string; description: string; services: string[]; href: string; action: string }) {
  return (
    <article className={`destination-card destination-${country}`}>
      <div className="destination-map" aria-hidden="true"><span>{country === "spain" ? "ES" : "AR"}</span><i /></div>
      <div className="destination-content">
        <p className="eyebrow">{city}</p>
        <h3>{title}</h3>
        <p>{description}</p>
        <ul>{services.map((service) => <li key={service}><Check size={15} />{service}</li>)}</ul>
        <Link to={href}>{action}<ArrowUpLeft size={18} /></Link>
      </div>
    </article>
  );
}
