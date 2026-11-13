import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseServiceKey, supabaseUrl } from "../env";

/**
 * Service-role client. Bypasses row-level security, so it is used only for
 * account administration (inviting users, creating memberships) after the
 * caller's own role has been checked.
 */
export function supabaseAdmin() {
  const key = supabaseServiceKey();
  if (!supabaseUrl || !key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set, so users cannot be invited.");
  return createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
