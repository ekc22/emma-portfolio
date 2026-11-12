"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "../env";
import { DEMO_COOKIE } from "../auth/session";
import { loadDb, resetDemoDb } from "../data/local-store";
import { supabaseServer } from "../supabase/server";
import { requireSession } from "../auth/session";
import { isAdmin } from "../auth/permissions";

export async function signInDemo(formData: FormData) {
  if (isSupabaseConfigured()) redirect("/login");
  const personId = String(formData.get("person") ?? "");
  if (!loadDb().memberships.some((m) => m.person_id === personId)) redirect("/login?error=unknown");
  (await cookies()).set(DEMO_COOKIE, personId, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14 });
  redirect("/");
}

export async function signInWithPassword(_: unknown, formData: FormData): Promise<{ error?: string }> {
  const sb = await supabaseServer();
  const { error } = await sb.auth.signInWithPassword({ email: String(formData.get("email") ?? ""), password: String(formData.get("password") ?? "") });
  if (error) return { error: error.message };
  redirect("/");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const sb = await supabaseServer();
    await sb.auth.signOut();
  } else {
    (await cookies()).delete(DEMO_COOKIE);
  }
  redirect("/login");
}

/** Demo mode only: restore the fictional dataset. */
export async function resetDemo() {
  const s = await requireSession();
  if (s.mode !== "demo" || !isAdmin(s.role)) return;
  resetDemoDb();
  redirect("/");
}
