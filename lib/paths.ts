/** Prefix a /public file path with the deploy base path (e.g. /emma-portfolio on GitHub Pages). */
export function withBase(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return path.startsWith("/") ? `${base}${path}` : path;
}
