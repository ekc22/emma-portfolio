"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "../auth/session";
import { isAdmin, ROLES } from "../auth/permissions";
import { canInviteUsers, isSupabaseConfigured, siteUrl } from "../env";
import { getStore } from "../data";
import { removeDemoMembership, upsertDemoMembership } from "../data/local-store";
import { supabaseAdmin } from "../supabase/admin";
import { supabaseServer } from "../supabase/server";
import { writeAudit } from "../audit";
import type { Role } from "../types";

export type MemberResult = { ok: true; message?: string } | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Gives a person in the workspace a login with a role.
 * Supabase: sends an invite email (the person sets their own password).
 * Demo: grants the role immediately; the person appears on the sign-in screen.
 */
export async function inviteMember(personId: string, email: string, role: Role): Promise<MemberResult> {
  const session = await requireSession();
  if (!isAdmin(session.role)) return { ok: false, error: "Only owners and admins can give people access." };
  if (!ROLES.includes(role)) return { ok: false, error: "Choose a role." };
  if (role === "owner" && session.role !== "owner") return { ok: false, error: "Only an owner can add another owner." };
  const store = await getStore(session);
  const person = await store.get("users", personId);
  if (!person) return { ok: false, error: "Person not found." };

  if (!isSupabaseConfigured()) {
    upsertDemoMembership({ person_id: personId, organisation_id: session.orgId, role });
    await writeAudit(store, session, { action: "create", table: "users", recordId: personId, summary: `Gave ${person.full_name} ${role} access` });
    revalidatePath("/", "layout");
    return { ok: true, message: `${person.full_name} can now sign in as ${role} (demo).` };
  }

  const address = email.trim().toLowerCase();
  if (!EMAIL.test(address)) return { ok: false, error: "Enter a valid email address." };
  if (!canInviteUsers()) return { ok: false, error: "Inviting needs SUPABASE_SERVICE_ROLE_KEY on the server. See the README." };
  const admin = supabaseAdmin();

  let authUserId: string | null = null;
  const invited = await admin.auth.admin.inviteUserByEmail(address, { redirectTo: `${siteUrl()}/auth/confirm?next=/auth/set-password` });
  if (invited.data?.user) authUserId = invited.data.user.id;
  else {
    // Already has an account (perhaps in another workspace): find it and add access.
    for (let page = 1; page <= 20 && !authUserId; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) return { ok: false, error: error.message };
      authUserId = data.users.find((u) => u.email?.toLowerCase() === address)?.id ?? null;
      if (data.users.length < 200) break;
    }
    if (!authUserId) return { ok: false, error: invited.error?.message ?? "The invite could not be sent." };
  }

  const { error } = await admin.from("memberships").upsert(
    { auth_user_id: authUserId, person_id: personId, organisation_id: session.orgId, role },
    { onConflict: "auth_user_id,organisation_id" },
  );
  if (error) return { ok: false, error: error.message };
  if (!person.email) await store.update("users", personId, { email: address });
  await writeAudit(store, session, { action: "create", table: "users", recordId: personId, summary: `Invited ${person.full_name} (${address}) as ${role}` });
  revalidatePath("/", "layout");
  return { ok: true, message: invited.data?.user ? `Invite sent to ${address}.` : `${address} already had an account; access added.` };
}

export async function changeRole(membershipId: string, role: Role): Promise<MemberResult> {
  const session = await requireSession();
  if (!isAdmin(session.role)) return { ok: false, error: "Only owners and admins can change roles." };
  if (!ROLES.includes(role)) return { ok: false, error: "Choose a role." };
  if (role === "owner" && session.role !== "owner") return { ok: false, error: "Only an owner can make someone an owner." };
  if (!isSupabaseConfigured()) {
    if (membershipId === session.personId && role !== session.role) return { ok: false, error: "You can't change your own role." };
    upsertDemoMembership({ person_id: membershipId, organisation_id: session.orgId, role });
  } else {
    const sb = await supabaseServer();
    const { data: m } = await sb.from("memberships").select("auth_user_id, role").eq("id", membershipId).maybeSingle();
    if (!m) return { ok: false, error: "Access record not found." };
    if (m.auth_user_id === session.authUserId) return { ok: false, error: "You can't change your own role." };
    if (m.role === "owner" && session.role !== "owner") return { ok: false, error: "Only an owner can change another owner." };
    const { error } = await sb.from("memberships").update({ role }).eq("id", membershipId);
    if (error) return { ok: false, error: error.message };
  }
  const store = await getStore(session);
  await writeAudit(store, session, { action: "update", table: "users", recordId: membershipId, summary: `Changed a member's role to ${role}` });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function revokeAccess(membershipId: string): Promise<MemberResult> {
  const session = await requireSession();
  if (!isAdmin(session.role)) return { ok: false, error: "Only owners and admins can remove access." };
  if (!isSupabaseConfigured()) {
    if (membershipId === session.personId) return { ok: false, error: "You can't remove your own access." };
    removeDemoMembership(membershipId, session.orgId);
  } else {
    const sb = await supabaseServer();
    const { data: m } = await sb.from("memberships").select("auth_user_id, role").eq("id", membershipId).maybeSingle();
    if (!m) return { ok: false, error: "Access record not found." };
    if (m.auth_user_id === session.authUserId) return { ok: false, error: "You can't remove your own access." };
    if (m.role === "owner" && session.role !== "owner") return { ok: false, error: "Only an owner can remove another owner." };
    const { error } = await sb.from("memberships").delete().eq("id", membershipId);
    if (error) return { ok: false, error: error.message };
  }
  const store = await getStore(session);
  await writeAudit(store, session, { action: "delete", table: "users", recordId: membershipId, summary: "Removed a member's access" });
  revalidatePath("/", "layout");
  return { ok: true };
}
