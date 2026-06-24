interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  inverse?: boolean;
}

export function SectionHeading({ eyebrow, title, description, align = "start", inverse = false }: SectionHeadingProps) {
  return (
    <div className={`section-heading ${align === "center" ? "text-center mx-auto" : ""} ${inverse ? "text-white" : "text-navy"}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <p className={inverse ? "text-white/70" : "text-charcoal/70"}>{description}</p> : null}
    </div>
  );
}
