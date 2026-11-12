import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DAY = 86_400_000;

/** Today's date as YYYY-MM-DD in the server's local time. */
export function todayISO(now = new Date()) {
  const z = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${z(now.getMonth() + 1)}-${z(now.getDate())}`;
}

export function addDays(iso: string, days: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return todayISO(d);
}

/** Whole days from today to `iso` (negative when in the past). */
export function daysFromToday(iso: string | null | undefined, today = todayISO()) {
  if (!iso) return null;
  const a = new Date(today + "T00:00:00").getTime();
  const b = new Date(iso.slice(0, 10) + "T00:00:00").getTime();
  return Math.round((b - a) / DAY);
}

export function formatDate(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  if (!iso) return "—";
  const d = new Date(iso.length <= 10 ? iso + "T00:00:00" : iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", opts);
}

export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

export function relativeDays(iso: string | null | undefined) {
  const d = daysFromToday(iso);
  if (d === null) return "—";
  if (d === 0) return "today";
  if (d === 1) return "tomorrow";
  if (d === -1) return "yesterday";
  return d > 0 ? `in ${d} days` : `${-d} days ago`;
}

export function formatMoney(n: number | null | undefined, currency = "GBP", compact = true) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(Number(n));
}

export function formatPercent(n: number | null | undefined, digits = 0) {
  if (n === null || n === undefined) return "—";
  return `${Number(n).toFixed(digits)}%`;
}

export const sum = (xs: number[]) => xs.reduce((a, b) => a + (Number(b) || 0), 0);

export function groupBy<T, K extends string>(xs: T[], key: (x: T) => K) {
  const out = {} as Record<K, T[]>;
  for (const x of xs) (out[key(x)] ||= []).push(x);
  return out;
}

/** Deterministic UUID-shaped id from a string (used for stable demo data). */
export function stableId(seed: string) {
  let h1 = 0xdeadbeef ^ seed.length, h2 = 0x41c6ce57 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    const c = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  const hex = (n: number) => (n >>> 0).toString(16).padStart(8, "0");
  const a = hex(h1), b = hex(h2), c = hex(h1 ^ h2), d = hex(Math.imul(h1, 31) ^ h2);
  return `${a}-${b.slice(0, 4)}-4${b.slice(5, 8)}-${"89ab"[parseInt(c[0], 16) % 4]}${c.slice(1, 4)}-${c.slice(4)}${d}`;
}
