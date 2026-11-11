/** Minimal page transition: a soft fade on each route change (disabled for reduced motion). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="motion-safe:animate-page-in">{children}</div>;
}
