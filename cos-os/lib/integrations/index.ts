/**
 * Integration registry.
 *
 * CoS OS is built so connectors can be added without touching the modules:
 * a connector maps an external system's objects onto the record types in
 * lib/schema.ts and writes through the same Store, validation, permissions
 * and audit log as a person would. Imports that change records should arrive
 * as AI proposals (ai_recommendations) so a person approves them.
 *
 * None of these connectors is implemented yet. The registry exists so the
 * Settings page states plainly what is and is not connected.
 */
import type { TableName } from "../schema";

export type IntegrationStatus = "not_connected" | "connected" | "error";

export interface IntegrationDef {
  id: string;
  name: string;
  category: "workspace" | "communication" | "crm" | "work_management" | "calendar" | "documents" | "finance";
  /** What it would sync, in CoS OS terms. */
  maps: { from: string; to: TableName }[];
  direction: "read" | "read_write";
  /** Implemented in this codebase. All false today. */
  implemented: boolean;
}

export interface Connector {
  def: IntegrationDef;
  /** Pull changes since the cursor and return them as proposals or records. */
  sync(cursor: string | null): Promise<{ proposals: number; created: number; cursor: string }>;
}

export const INTEGRATIONS: IntegrationDef[] = [
  { id: "google-workspace", name: "Google Workspace", category: "workspace", maps: [{ from: "Gmail threads", to: "commercial_activities" }, { from: "Drive files", to: "documents" }], direction: "read", implemented: false },
  { id: "microsoft-365", name: "Microsoft 365", category: "workspace", maps: [{ from: "Outlook mail", to: "commercial_activities" }, { from: "OneDrive / SharePoint files", to: "documents" }], direction: "read", implemented: false },
  { id: "calendar", name: "Calendar (Google or Outlook)", category: "calendar", maps: [{ from: "Events", to: "meetings" }], direction: "read", implemented: false },
  { id: "slack", name: "Slack", category: "communication", maps: [{ from: "Channel messages (proposed actions)", to: "tasks" }], direction: "read", implemented: false },
  { id: "notion", name: "Notion", category: "documents", maps: [{ from: "Meeting notes pages", to: "meetings" }, { from: "Pages", to: "documents" }], direction: "read", implemented: false },
  { id: "monday", name: "monday.com", category: "work_management", maps: [{ from: "Boards and items", to: "projects" }, { from: "Items", to: "tasks" }], direction: "read_write", implemented: false },
  { id: "linear", name: "Linear", category: "work_management", maps: [{ from: "Projects", to: "projects" }, { from: "Issues", to: "tasks" }], direction: "read", implemented: false },
  { id: "hubspot", name: "HubSpot", category: "crm", maps: [{ from: "Companies", to: "commercial_accounts" }, { from: "Deals", to: "commercial_opportunities" }, { from: "Engagements", to: "commercial_activities" }], direction: "read_write", implemented: false },
  { id: "salesforce", name: "Salesforce", category: "crm", maps: [{ from: "Accounts", to: "commercial_accounts" }, { from: "Opportunities", to: "commercial_opportunities" }], direction: "read_write", implemented: false },
  { id: "documents", name: "Document storage (data room)", category: "documents", maps: [{ from: "Folders and files", to: "documents" }, { from: "Request lists", to: "due_diligence_requests" }], direction: "read", implemented: false },
  { id: "finance", name: "Financial reporting (Xero, QuickBooks, NetSuite)", category: "finance", maps: [{ from: "Month-end balances", to: "financial_snapshots" }], direction: "read", implemented: false },
];
