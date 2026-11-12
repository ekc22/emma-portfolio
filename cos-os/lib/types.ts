import type { TableName } from "./schema";

/** A stored record. Columns beyond the base ones are described in lib/schema.ts. */
export type Row = {
  id: string;
  organisation_id: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
};

export type Role = "owner" | "admin" | "executive" | "member" | "viewer";

export interface Session {
  mode: "demo" | "supabase";
  /** Auth identity (Supabase auth user id, or the demo person's id). */
  authUserId: string;
  /** The person record in `users`, when linked. */
  personId: string | null;
  name: string;
  email: string | null;
  orgId: string;
  orgName: string;
  role: Role;
}

export type Lookups = Partial<Record<TableName, Record<string, string>>>;

/** A pointer to a record, used as evidence for insights and AI output. */
export interface SourceRef {
  table: TableName;
  id: string;
  label?: string;
}
