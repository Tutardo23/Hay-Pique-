export function SectionHeading({ label, title, copy, className = "" }: { label: string; title: React.ReactNode; copy?: string; className?: string }) {
  return (
    <div className={className}>
      <div className="section-label">{label}</div>
      <h2 className="section-title">{title}</h2>
      {copy ? <p className="section-copy">{copy}</p> : null}
    </div>
  );
}
