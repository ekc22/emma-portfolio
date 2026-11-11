import Link from "next/link";
import type { ReactNode } from "react";

type Props = { href: string; children: ReactNode; className?: string; external?: boolean };

/** Understated text CTA with a drawn underline and a nudging arrow. */
export default function TextLink({ href, children, className = "", external }: Props) {
  const content = (
    <>
      <span>{children}</span>
      <span aria-hidden="true" className="arrow">→</span>
    </>
  );
  if (external || href.startsWith("mailto:") || href.startsWith("#") || href.endsWith(".pdf")) {
    return (
      <a href={href} className={`text-link ${className}`} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={`text-link ${className}`}>
      {content}
    </Link>
  );
}
