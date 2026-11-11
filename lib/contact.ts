import { site } from "@/content/site";

/** Returns a mailto: link, or null while no email address has been configured. */
export function mailto(subject: string = site.contact.subjects.general): string | null {
  const email = site.contact.email.trim();
  if (!email) return null;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
