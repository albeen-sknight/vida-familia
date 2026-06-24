import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export function ServiceCard({ index, title, text, href }: { index: string; title: string; text: string; href: string }) {
  return (
    <article className="service-card">
      <div className="service-index">{index}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <Link to={href} aria-label={title}><ArrowUpRight size={18} aria-hidden="true" /></Link>
    </article>
  );
}
