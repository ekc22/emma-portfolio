export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Production mode: Supabase Auth + Postgres with row-level security. */
export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey);

/** Claude is available when an API key (or other SDK credential) is set. */
export const isClaudeConfigured = () =>
  Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);

export const claudeModel = () => process.env.ANTHROPIC_MODEL || "claude-opus-5-5";

/** Server-only key for inviting users. Never expose to the browser. */
export const supabaseServiceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
export const canInviteUsers = () => Boolean(isSupabaseConfigured() && supabaseServiceKey());

/** Public address of the app, used in invite and password-reset links. */
export const siteUrl = () => (process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")).replace(/\/$/, "");
