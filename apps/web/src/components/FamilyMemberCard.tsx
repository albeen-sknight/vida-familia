import type { CSSProperties } from "react";

type PortraitStyle = CSSProperties & { "--portrait-position"?: string };

interface FamilyMemberCardProps {
  initials: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  role: string;
  title: string;
  note: string;
  focuses: string[];
  index: number;
}

export function FamilyMemberCard({
  image,
  imageAlt,
  imagePosition,
  role,
  title,
  note,
  focuses,
  index,
}: FamilyMemberCardProps) {
  const portraitStyle: PortraitStyle | undefined = imagePosition
    ? { "--portrait-position": imagePosition }
    : undefined;

  return (
    <article className="family-card scene-reveal">
      <div className={`family-portrait family-portrait-${index + 1}`} style={portraitStyle}>
        {image ? (
          <img
            src={image}
            alt={imageAlt || title}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.parentElement?.classList.add("family-portrait-image-failed");
            }}
          />
        ) : (
          <div className="family-portrait-fallback" aria-hidden="true" />
        )}

        <div className="family-portrait-overlay" aria-hidden="true" />
        <small>CHAPTER / 0{index + 1}</small>
        <i aria-hidden="true" />
      </div>

      <div className="family-card-copy">
        <p className="eyebrow">{role}</p>
        <h3>{title}</h3>
        <p>{note}</p>
        <ul>
          {focuses.map((focus) => (
            <li key={focus}>{focus}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}