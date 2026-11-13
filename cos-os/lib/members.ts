import "server-only";
import { isSupabaseConfigured } from "./env";
import { listDemoMemberships } from "./data/local-store";
import { supabaseServer } from "./supabase/server";
import type { Role, Session } from "./types";

export interface Access { id: string; personId: string | null; authUserId: string; role: Role; email?: string | null }

/** Who can sign in to this workspace. Admins see everyone; others only themselves (RLS). */
export async function listAccess(session: Session): Promise<Access[]> {
  if (!isSupabaseConfigured()) {
    return listDemoMemberships(session.orgId).map((m) => ({ id: m.person_id, personId: m.person_id, authUserId: m.auth_user_id, role: m.role as Role }));
  }
  const sb = await supabaseServer();
  const { data, error } = await sb.from("memberships").select("id, person_id, auth_user_id, role").eq("organisation_id", session.orgId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((m) => ({ id: m.id, personId: m.person_id, authUserId: m.auth_user_id, role: m.role as Role }));
}
