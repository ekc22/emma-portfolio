/**
 * One-time setup on a fresh Supabase project: creates the organisation, your
 * person record and your owner login.
 *
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *   npm run setup:owner -- --org "Your Company" --name "Emma Clark" --email you@example.com [--title "CEO"] [--app-url https://cos.example.com]
 *
 * You receive an invite email to set your password. Run it after the migrations.
 */
import { createClient } from "@supabase/supabase-js";

function arg(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const org = arg("org"), name = arg("name"), email = arg("email")?.toLowerCase();
  const appUrl = (arg("app-url") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  if (!org || !name || !email) throw new Error('Usage: npm run setup:owner -- --org "Company" --name "Your Name" --email you@example.com');

  const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  const orgId = crypto.randomUUID();
  const { error: e1 } = await sb.from("organisations").insert({ id: orgId, organisation_id: orgId, name: org, currency: "GBP" });
  if (e1) throw new Error(`Creating the organisation failed: ${e1.message}`);

  const { data: person, error: e2 } = await sb.from("users").insert({ organisation_id: orgId, full_name: name, email, title: arg("title") ?? null }).select("id").single();
  if (e2) throw new Error(`Creating your person record failed: ${e2.message}`);

  const invited = await sb.auth.admin.inviteUserByEmail(email, { redirectTo: `${appUrl}/auth/confirm?next=/auth/set-password` });
  let userId = invited.data?.user?.id;
  if (!userId) {
    const { data } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
    userId = data?.users.find((u) => u.email?.toLowerCase() === email)?.id;
  }
  if (!userId) throw new Error(`Creating the login failed: ${invited.error?.message ?? "unknown error"}`);

  const { error: e3 } = await sb.from("memberships").insert({ auth_user_id: userId, person_id: person.id, organisation_id: orgId, role: "owner" });
  if (e3) throw new Error(`Granting owner access failed: ${e3.message}`);

  console.log(`Done. ${org} is set up and ${email} is its owner.`);
  console.log(invited.data?.user ? "Check your inbox for the invite to set your password." : "That email already had a login; sign in with it.");
  console.log(`Organisation id: ${orgId}`);
}

main().catch((e) => { console.error(e.message ?? e); process.exit(1); });
