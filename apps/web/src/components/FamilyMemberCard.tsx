interface FamilyMemberCardProps {
  initials: string;
  role: string;
  title: string;
  note: string;
  focuses: string[];
  index: number;
}

export function FamilyMemberCard({ initials, role, title, note, focuses, index }: FamilyMemberCardProps) {
  return (
    <article className="family-card scene-reveal">
      <div className={`family-portrait family-portrait-${index + 1}`}>
        <span>{initials}</span>
        <small>CHAPTER / 0{index + 1}</small>
        <i aria-hidden="true" />
      </div>
      <div className="family-card-copy">
        <p className="eyebrow">{role}</p>
        <h3>{title}</h3>
        <p>{note}</p>
        <ul>{focuses.map((focus) => <li key={focus}>{focus}</li>)}</ul>
      </div>
    </article>
  );
}
