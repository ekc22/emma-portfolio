import "server-only";
import fs from "node:fs";
import path from "node:path";
import { site } from "@/content/site";

/** True only when the CV PDF actually exists in /public. Evaluated at build time. */
export function hasCv(): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", site.cv.path));
  } catch {
    return false;
  }
}
