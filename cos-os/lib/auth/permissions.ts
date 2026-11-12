import { ENTITIES, type AccessGroup, type TableName } from "../schema";
import type { Role } from "../types";

/**
 * Role-based permissions. supabase/migrations/0002_rls.sql enforces the same
 * rules in the database, so a bypassed UI check still fails at the data layer.
 *
 * owner, admin   everything
 * executive      everything except writing financial records and admin settings
 * member         core business records; no investor or financial data
 * viewer         reads core business records only
 */
export const ROLES: Role[] = ["owner", "admin", "executive", "member", "viewer"];

const READ: Record<AccessGroup, Role[]> = {
  core: ["owner", "admin", "executive", "member", "viewer"],
  investor: ["owner", "admin", "executive"],
  financial: ["owner", "admin", "executive"],
  admin: ["owner", "admin"],
};
const WRITE: Record<AccessGroup, Role[]> = {
  core: ["owner", "admin", "executive", "member"],
  investor: ["owner", "admin", "executive"],
  financial: ["owner", "admin"],
  admin: ["owner", "admin"],
};

export const canRead = (table: TableName, role: Role) => READ[ENTITIES[table].group].includes(role);
export const canWrite = (table: TableName, role: Role) => WRITE[ENTITIES[table].group].includes(role);
export const canSeeInvestors = (role: Role) => READ.investor.includes(role);
export const isAdmin = (role: Role) => role === "owner" || role === "admin";

export const ROLE_LABEL: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  executive: "Executive",
  member: "Member",
  viewer: "Viewer",
};
