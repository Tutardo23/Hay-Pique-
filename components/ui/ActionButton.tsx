import Link from "next/link";
export function ActionButton({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  return <Link href={href} className={`action-btn ${variant}`}>{children}<span aria-hidden="true">→</span></Link>;
}
