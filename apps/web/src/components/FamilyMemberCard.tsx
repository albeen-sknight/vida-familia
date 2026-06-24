interface FamilyMemberCardProps {
  initials: string;
  role: string;
  title: string;
  note: string;
  index: number;
}

export function FamilyMemberCard({ initials, role, title, note, index }: FamilyMemberCardProps) {
  return (
    <article className="family-card">
      <div className={`family-portrait family-portrait-${index + 1}`}><span>{initials}</span><small>0{index + 1}</small></div>
      <p className="eyebrow">{role}</p>
      <h3>{title}</h3>
      <p>{note}</p>
    </article>
  );
}
