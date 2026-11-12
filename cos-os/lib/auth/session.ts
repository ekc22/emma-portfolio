import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "../env";
import type { Role, Session } from "../types";
import { loadDb } from "../data/local-store";
import { supabaseServer } from "../supabase/server";

export const DEMO_COOKIE = "cos_demo_user";

/** The signed-in user, their organisation and role. Cached per request. */
export const getSession = cache(async (): Promise<Session | null> => {
  if (isSupabaseConfigured()) {
    const sb = await supabaseServer();
    const { data: auth } = await sb.auth.getUser();
    if (!auth.user) return null;
    const { data: m } = await sb
      .from("memberships")
      .select("organisation_id, role, person_id, organisations(name)")
      .eq("auth_user_id", auth.user.id)
      .limit(1)
      .maybeSingle();
    if (!m) return null;
    let name = auth.user.email ?? "User";
    if (m.person_id) {
      const { data: p } = await sb.from("users").select("full_name").eq("id", m.person_id).maybeSingle();
      if (p?.full_name) name = p.full_name;
    }
    const org = m.organisations as unknown as { name: string } | null;
    return {
      mode: "supabase",
      authUserId: auth.user.id,
      personId: m.person_id ?? null,
      name,
      email: auth.user.email ?? null,
      orgId: m.organisation_id,
      orgName: org?.name ?? "Workspace",
      role: m.role as Role,
    };
  }

  const jar = await cookies();
  const personId = jar.get(DEMO_COOKIE)?.value;
  if (!personId) return null;
  const db = loadDb();
  const m = db.memberships.find((x) => x.person_id === personId);
  if (!m) return null;
  const person = db.tables.users.find((u) => u.id === personId);
  const org = db.tables.organisations.find((o) => o.id === m.organisation_id);
  return {
    mode: "demo",
    authUserId: m.auth_user_id,
    personId,
    name: person?.full_name ?? "Demo user",
    email: person?.email ?? null,
    orgId: m.organisation_id,
    orgName: org?.name ?? "Demo workspace",
    role: m.role as Role,
  };
});

export async function requireSession(): Promise<Session> {
  const s = await getSession();
  if (!s) redirect("/login");
  return s;
}
