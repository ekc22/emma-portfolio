export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Production mode: Supabase Auth + Postgres with row-level security. */
export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey);

/** Claude is available when an API key (or other SDK credential) is set. */
export const isClaudeConfigured = () =>
  Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);

export const claudeModel = () => process.env.ANTHROPIC_MODEL || "claude-opus-5-5";
