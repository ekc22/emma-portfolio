/**
 * The entity registry: one description of every business record in CoS OS.
 *
 * It drives the generic table, the create/edit forms, validation, search,
 * permissions and the AI agent's tools, so a field is defined once and
 * behaves the same everywhere. The SQL migrations mirror these definitions.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "currency"
  | "percent"
  | "date"
  | "datetime"
  | "select"
  | "relation"
  | "boolean"
  | "score"; // 1–5

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: readonly string[];
  /** For relation fields: the table the id points to. */
  relation?: TableName;
  /** Shown in the default table view. */
  list?: boolean;
  /** Help text under the form input. */
  hint?: string;
  /** Hidden from forms (system-managed). */
  system?: boolean;
}

/** Permission groups. RLS in supabase/migrations mirrors these. */
export type AccessGroup =
  | "core" // every member reads; member and above write
  | "investor" // owner, admin, executive read and write
  | "financial" // owner, admin, executive read; owner, admin write
  | "admin"; // owner and admin only

export interface EntityDef {
  table: TableName;
  label: string;
  plural: string;
  /** Field used as the record's display name. */
  titleField: string;
  group: AccessGroup;
  module: ModuleKey;
  fields: FieldDef[];
  /** Fields searched by the free-text search box and the agent. */
  search: string[];
  /** Default sort: [field, direction]. */
  sort?: [string, "asc" | "desc"];
  /** Verified business data, versus generated or proposed content. */
  description: string;
}

export type ModuleKey =
  | "command"
  | "strategy"
  | "projects"
  | "pipeline"
  | "investors"
  | "meetings"
  | "intelligence"
  | "agent"
  | "settings";

export const TABLES = [
  "organisations",
  "teams",
  "users",
  "strategic_objectives",
  "kpis",
  "projects",
  "milestones",
  "tasks",
  "dependencies",
  "risks",
  "decisions",
  "meetings",
  "meeting_actions",
  "commercial_accounts",
  "commercial_contacts",
  "commercial_opportunities",
  "commercial_activities",
  "investors",
  "investor_contacts",
  "fundraising_rounds",
  "fundraising_opportunities",
  "investor_commitments",
  "capital_receipts",
  "due_diligence_requests",
  "investor_interactions",
  "financial_snapshots",
  "reports",
  "documents",
  "ai_recommendations",
  "audit_logs",
] as const;
export type TableName = (typeof TABLES)[number];

/* ---------- Option sets ---------- */
export const RAG = ["green", "amber", "red"] as const;
export const PRIORITY = ["critical", "high", "medium", "low"] as const;
export const OBJECTIVE_STATUS = ["not_started", "on_track", "at_risk", "off_track", "achieved"] as const;
export const PROJECT_STATUS = ["planning", "active", "on_hold", "completed", "cancelled"] as const;
export const MILESTONE_STATUS = ["not_started", "in_progress", "complete", "missed"] as const;
export const TASK_STATUS = ["todo", "in_progress", "blocked", "done"] as const;
export const RISK_STATUS = ["open", "mitigating", "closed"] as const;
export const RISK_CATEGORY = ["delivery", "commercial", "financial", "fundraising", "regulatory", "people", "technology"] as const;
export const DECISION_STATUS = ["proposed", "awaiting_approval", "approved", "rejected", "deferred"] as const;
export const MEETING_TYPE = ["executive", "board", "investor", "commercial", "project", "one_to_one", "other"] as const;
export const ACTION_STATUS = ["proposed", "approved", "rejected"] as const;
export const ACCOUNT_TYPE = ["prospect", "customer", "partner", "channel"] as const;
export const COMMERCIAL_STAGES = ["Lead", "Qualified", "Discovery", "Proposal", "Negotiation", "Contracting", "Won", "Lost"] as const;
export const OPEN_COMMERCIAL_STAGES = COMMERCIAL_STAGES.filter((s) => s !== "Won" && s !== "Lost");
export const ACTIVITY_TYPE = ["call", "email", "meeting", "proposal", "demo", "note"] as const;
export const INVESTOR_CATEGORY = ["venture_capital", "angel", "family_office", "corporate_vc", "private_equity", "strategic", "government"] as const;
export const RELATIONSHIP_STRENGTH = ["cold", "warm", "strong"] as const;
export const ROUND_STATUS = ["planning", "open", "closing", "closed"] as const;
export const FUNDRAISING_STAGES = [
  "Identified",
  "Introduction",
  "First Meeting",
  "Follow-up",
  "Investment Interest",
  "Due Diligence",
  "Investment Committee",
  "Soft Commitment",
  "Legally Committed",
  "Funds Received",
  "Closed",
  "Passed",
] as const;
export const COMMITMENT_TYPE = ["soft", "legal"] as const;
export const DD_CATEGORY = ["financial", "legal", "commercial", "technical", "team", "esg", "product"] as const;
export const DD_STATUS = ["open", "in_progress", "submitted", "accepted", "blocked"] as const;
export const APPROVAL_STATUS = ["not_required", "pending", "approved"] as const;
export const INTERACTION_TYPE = ["meeting", "call", "email", "event", "update_sent", "data_room"] as const;
export const REPORT_TYPE = [
  "daily_briefing",
  "weekly_ceo_update",
  "project_portfolio",
  "pipeline_review",
  "investor_update",
  "monthly_business_review",
  "board_pack",
  "risk_summary",
  "ir_briefing",
] as const;
export const REPORT_STATUS = ["draft", "in_review", "approved"] as const;
export const DOC_CATEGORY = ["board", "financial", "legal", "commercial", "product", "investor", "other"] as const;
export const RECOMMENDATION_STATUS = ["pending", "approved", "rejected", "applied"] as const;

/* ---------- Shared field helpers ---------- */
const owner = (label = "Owner", list = true): FieldDef => ({ key: "owner_id", label, type: "relation", relation: "users", list });
const notes: FieldDef = { key: "notes", label: "Notes", type: "textarea" };

export const ENTITIES: Record<TableName, EntityDef> = {
  organisations: {
    table: "organisations", label: "Organisation", plural: "Organisations", titleField: "name", group: "admin", module: "settings",
    description: "The company workspace.",
    search: ["name"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true, list: true },
      { key: "sector", label: "Sector", type: "text", list: true },
      { key: "currency", label: "Reporting currency", type: "select", options: ["GBP", "USD", "EUR"], list: true },
      { key: "tagline", label: "Tagline", type: "text" },
    ],
  },
  teams: {
    table: "teams", label: "Team", plural: "Teams", titleField: "name", group: "core", module: "settings",
    description: "Functional teams.",
    search: ["name", "description"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true, list: true },
      { key: "lead_id", label: "Lead", type: "relation", relation: "users", list: true },
      { key: "description", label: "Description", type: "textarea", list: true },
    ],
  },
  users: {
    table: "users", label: "Person", plural: "People", titleField: "full_name", group: "core", module: "settings",
    description: "People who own work. A person can exist without an app login.",
    search: ["full_name", "title", "email"],
    sort: ["full_name", "asc"],
    fields: [
      { key: "full_name", label: "Name", type: "text", required: true, list: true },
      { key: "title", label: "Title", type: "text", list: true },
      { key: "email", label: "Email", type: "text", list: true },
      { key: "team_id", label: "Team", type: "relation", relation: "teams", list: true },
    ],
  },
  strategic_objectives: {
    table: "strategic_objectives", label: "Objective", plural: "Strategic objectives", titleField: "title", group: "core", module: "strategy",
    description: "Annual objectives and quarterly priorities.",
    search: ["title", "description", "measure"],
    sort: ["level", "asc"],
    fields: [
      { key: "title", label: "Objective", type: "text", required: true, list: true },
      { key: "level", label: "Level", type: "select", options: ["annual", "quarterly"], required: true, list: true },
      { key: "period", label: "Period", type: "text", list: true, hint: "e.g. FY2026 or Q4 2026" },
      { key: "parent_id", label: "Supports annual objective", type: "relation", relation: "strategic_objectives" },
      owner(),
      { key: "status", label: "Status", type: "select", options: OBJECTIVE_STATUS, list: true },
      { key: "progress", label: "Progress", type: "percent", list: true },
      { key: "measure", label: "Measurable outcome", type: "text", hint: "How we will know it is achieved" },
      { key: "due_date", label: "Due", type: "date", list: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "assumptions", label: "Assumptions", type: "textarea" },
    ],
  },
  kpis: {
    table: "kpis", label: "KPI", plural: "KPIs", titleField: "name", group: "core", module: "strategy",
    description: "Measured indicators with a verified source.",
    search: ["name", "unit", "source"],
    fields: [
      { key: "name", label: "KPI", type: "text", required: true, list: true },
      { key: "objective_id", label: "Objective", type: "relation", relation: "strategic_objectives", list: true },
      owner(),
      { key: "unit", label: "Unit", type: "text" },
      { key: "baseline", label: "Baseline", type: "number" },
      { key: "current_value", label: "Current", type: "number", list: true },
      { key: "target_value", label: "Target", type: "number", list: true },
      { key: "direction", label: "Better when", type: "select", options: ["increase", "decrease"] },
      { key: "period", label: "Period", type: "text" },
      { key: "last_updated", label: "Last measured", type: "date", list: true },
      { key: "source", label: "Source", type: "text", hint: "Where the number comes from" },
    ],
  },
  projects: {
    table: "projects", label: "Project", plural: "Projects", titleField: "name", group: "core", module: "projects",
    description: "Delivery projects linked to strategy.",
    search: ["name", "description", "decisions_required"],
    sort: ["target_date", "asc"],
    fields: [
      { key: "name", label: "Project", type: "text", required: true, list: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "objective_id", label: "Strategic objective", type: "relation", relation: "strategic_objectives", list: true },
      { key: "sponsor_id", label: "Executive sponsor", type: "relation", relation: "users" },
      owner("Project owner"),
      { key: "priority", label: "Priority", type: "select", options: PRIORITY, list: true },
      { key: "status", label: "Status", type: "select", options: PROJECT_STATUS, required: true, list: true },
      { key: "rag", label: "RAG", type: "select", options: RAG, list: true },
      { key: "progress", label: "Progress", type: "percent" },
      { key: "start_date", label: "Start", type: "date" },
      { key: "target_date", label: "Target completion", type: "date", list: true },
      { key: "budget", label: "Budget", type: "currency" },
      { key: "spent", label: "Spent to date", type: "currency" },
      { key: "deliverables", label: "Deliverables", type: "textarea" },
      { key: "decisions_required", label: "Decisions required", type: "textarea" },
    ],
  },
  milestones: {
    table: "milestones", label: "Milestone", plural: "Milestones", titleField: "title", group: "core", module: "projects",
    description: "Dated project checkpoints.",
    search: ["title", "evidence"],
    sort: ["due_date", "asc"],
    fields: [
      { key: "title", label: "Milestone", type: "text", required: true, list: true },
      { key: "project_id", label: "Project", type: "relation", relation: "projects", required: true, list: true },
      owner(),
      { key: "due_date", label: "Due", type: "date", required: true, list: true },
      { key: "status", label: "Status", type: "select", options: MILESTONE_STATUS, list: true },
      { key: "completed_on", label: "Completed on", type: "date" },
      { key: "evidence", label: "Evidence of completion", type: "textarea" },
    ],
  },
  tasks: {
    table: "tasks", label: "Action", plural: "Actions", titleField: "title", group: "core", module: "projects",
    description: "The central action tracker.",
    search: ["title", "description"],
    sort: ["due_date", "asc"],
    fields: [
      { key: "title", label: "Action", type: "text", required: true, list: true },
      { key: "description", label: "Detail", type: "textarea" },
      { key: "project_id", label: "Project", type: "relation", relation: "projects", list: true },
      { key: "milestone_id", label: "Milestone", type: "relation", relation: "milestones" },
      owner(),
      { key: "due_date", label: "Due", type: "date", list: true },
      { key: "status", label: "Status", type: "select", options: TASK_STATUS, required: true, list: true },
      { key: "priority", label: "Priority", type: "select", options: PRIORITY, list: true },
      { key: "escalated", label: "Escalated", type: "boolean" },
      { key: "evidence", label: "Completion evidence", type: "textarea", hint: "Required before an action is marked done" },
      { key: "meeting_id", label: "From meeting", type: "relation", relation: "meetings" },
      { key: "opportunity_id", label: "Commercial opportunity", type: "relation", relation: "commercial_opportunities" },
      { key: "investor_id", label: "Investor", type: "relation", relation: "investors" },
    ],
  },
  dependencies: {
    table: "dependencies", label: "Dependency", plural: "Dependencies", titleField: "description", group: "core", module: "projects",
    description: "Where one project waits on another.",
    search: ["description"],
    fields: [
      { key: "description", label: "Dependency", type: "text", required: true, list: true },
      { key: "project_id", label: "Project", type: "relation", relation: "projects", required: true, list: true },
      { key: "depends_on_project_id", label: "Depends on", type: "relation", relation: "projects", required: true, list: true },
      { key: "needed_by", label: "Needed by", type: "date", list: true },
      { key: "status", label: "Status", type: "select", options: ["open", "at_risk", "resolved"], list: true },
    ],
  },
  risks: {
    table: "risks", label: "Risk", plural: "Risks", titleField: "title", group: "core", module: "projects",
    description: "Risks and issues across the business.",
    search: ["title", "description", "mitigation"],
    fields: [
      { key: "title", label: "Risk", type: "text", required: true, list: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "category", label: "Category", type: "select", options: RISK_CATEGORY, list: true },
      { key: "likelihood", label: "Likelihood (1–5)", type: "score", list: true },
      { key: "impact", label: "Impact (1–5)", type: "score", list: true },
      owner(),
      { key: "status", label: "Status", type: "select", options: RISK_STATUS, list: true },
      { key: "mitigation", label: "Mitigation", type: "textarea" },
      { key: "review_date", label: "Review by", type: "date", list: true },
      { key: "project_id", label: "Project", type: "relation", relation: "projects" },
      { key: "objective_id", label: "Objective", type: "relation", relation: "strategic_objectives" },
      { key: "opportunity_id", label: "Opportunity", type: "relation", relation: "commercial_opportunities" },
    ],
  },
  decisions: {
    table: "decisions", label: "Decision", plural: "Decision register", titleField: "title", group: "core", module: "meetings",
    description: "Decisions with rationale and owner.",
    search: ["title", "rationale", "impact"],
    sort: ["decided_on", "desc"],
    fields: [
      { key: "title", label: "Decision", type: "text", required: true, list: true },
      { key: "rationale", label: "Rationale", type: "textarea" },
      owner("Decision owner"),
      { key: "status", label: "Status", type: "select", options: DECISION_STATUS, required: true, list: true },
      { key: "decided_on", label: "Decided on", type: "date", list: true },
      { key: "due_date", label: "Decision needed by", type: "date", list: true },
      { key: "impact", label: "Impact", type: "textarea" },
      { key: "objective_id", label: "Related objective", type: "relation", relation: "strategic_objectives" },
      { key: "project_id", label: "Related project", type: "relation", relation: "projects" },
      { key: "meeting_id", label: "Meeting", type: "relation", relation: "meetings" },
    ],
  },
  meetings: {
    table: "meetings", label: "Meeting", plural: "Meetings", titleField: "title", group: "core", module: "meetings",
    description: "Meetings, notes and transcripts.",
    search: ["title", "attendees", "notes", "summary"],
    sort: ["held_at", "desc"],
    fields: [
      { key: "title", label: "Meeting", type: "text", required: true, list: true },
      { key: "meeting_type", label: "Type", type: "select", options: MEETING_TYPE, list: true },
      { key: "held_at", label: "Date and time", type: "datetime", required: true, list: true },
      { key: "attendees", label: "Attendees", type: "text", list: true },
      owner("Organiser", false),
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "notes", label: "Notes or transcript", type: "textarea" },
      { key: "project_id", label: "Project", type: "relation", relation: "projects" },
      { key: "opportunity_id", label: "Opportunity", type: "relation", relation: "commercial_opportunities" },
      { key: "investor_id", label: "Investor", type: "relation", relation: "investors" },
    ],
  },
  meeting_actions: {
    table: "meeting_actions", label: "Meeting action", plural: "Meeting actions", titleField: "description", group: "core", module: "meetings",
    description: "Actions extracted from meetings, awaiting approval.",
    search: ["description"],
    fields: [
      { key: "description", label: "Action", type: "text", required: true, list: true },
      { key: "meeting_id", label: "Meeting", type: "relation", relation: "meetings", required: true, list: true },
      owner(),
      { key: "due_date", label: "Due", type: "date", list: true },
      { key: "status", label: "Status", type: "select", options: ACTION_STATUS, list: true },
      { key: "task_id", label: "Created action", type: "relation", relation: "tasks", system: true },
    ],
  },
  commercial_accounts: {
    table: "commercial_accounts", label: "Organisation", plural: "Organisations", titleField: "name", group: "core", module: "pipeline",
    description: "Customers, prospects and partners.",
    search: ["name", "sector", "region", "notes"],
    sort: ["name", "asc"],
    fields: [
      { key: "name", label: "Organisation", type: "text", required: true, list: true },
      { key: "account_type", label: "Type", type: "select", options: ACCOUNT_TYPE, list: true },
      { key: "sector", label: "Sector", type: "text", list: true },
      { key: "region", label: "Region", type: "text", list: true },
      { key: "website", label: "Website", type: "text" },
      owner("Account owner"),
      notes,
    ],
  },
  commercial_contacts: {
    table: "commercial_contacts", label: "Contact", plural: "Contacts", titleField: "full_name", group: "core", module: "pipeline",
    description: "People at commercial organisations.",
    search: ["full_name", "title", "email"],
    sort: ["full_name", "asc"],
    fields: [
      { key: "full_name", label: "Name", type: "text", required: true, list: true },
      { key: "account_id", label: "Organisation", type: "relation", relation: "commercial_accounts", required: true, list: true },
      { key: "title", label: "Title", type: "text", list: true },
      { key: "email", label: "Email", type: "text", list: true },
      { key: "phone", label: "Phone", type: "text" },
      notes,
    ],
  },
  commercial_opportunities: {
    table: "commercial_opportunities", label: "Opportunity", plural: "Opportunities", titleField: "name", group: "core", module: "pipeline",
    description: "Commercial deals and partnerships.",
    search: ["name", "next_action", "risk_notes"],
    sort: ["expected_close", "asc"],
    fields: [
      { key: "name", label: "Opportunity", type: "text", required: true, list: true },
      { key: "account_id", label: "Organisation", type: "relation", relation: "commercial_accounts", required: true, list: true },
      owner(),
      { key: "stage", label: "Stage", type: "select", options: COMMERCIAL_STAGES, required: true, list: true },
      { key: "value", label: "Estimated value (annual)", type: "currency", list: true },
      { key: "probability", label: "Probability", type: "percent", list: true },
      { key: "expected_close", label: "Expected close", type: "date", list: true },
      { key: "is_partnership", label: "Strategic partnership", type: "boolean" },
      { key: "next_action", label: "Next action", type: "text" },
      { key: "next_action_date", label: "Next action by", type: "date" },
      { key: "last_activity_date", label: "Last activity", type: "date" },
      { key: "stage_changed_at", label: "In stage since", type: "date" },
      { key: "objective_id", label: "Strategic objective", type: "relation", relation: "strategic_objectives" },
      { key: "risk_notes", label: "Commercial risks", type: "textarea" },
      { key: "lost_reason", label: "Lost reason", type: "text" },
    ],
  },
  commercial_activities: {
    table: "commercial_activities", label: "Activity", plural: "Commercial activity", titleField: "summary", group: "core", module: "pipeline",
    description: "Calls, meetings and emails on deals.",
    search: ["summary"],
    sort: ["occurred_on", "desc"],
    fields: [
      { key: "summary", label: "Summary", type: "text", required: true, list: true },
      { key: "activity_type", label: "Type", type: "select", options: ACTIVITY_TYPE, list: true },
      { key: "occurred_on", label: "Date", type: "date", required: true, list: true },
      { key: "opportunity_id", label: "Opportunity", type: "relation", relation: "commercial_opportunities", list: true },
      { key: "account_id", label: "Organisation", type: "relation", relation: "commercial_accounts" },
      owner(),
    ],
  },
  investors: {
    table: "investors", label: "Investor", plural: "Investors", titleField: "name", group: "investor", module: "investors",
    description: "Investor CRM.",
    search: ["name", "investment_focus", "sectors", "geographies", "notes", "portfolio_companies"],
    sort: ["name", "asc"],
    fields: [
      { key: "name", label: "Investor / fund", type: "text", required: true, list: true },
      { key: "category", label: "Category", type: "select", options: INVESTOR_CATEGORY, list: true },
      { key: "investment_focus", label: "Investment focus", type: "text" },
      { key: "sectors", label: "Sector preferences", type: "text", list: true },
      { key: "geographies", label: "Geographic preferences", type: "text" },
      { key: "cheque_min", label: "Typical cheque from", type: "currency" },
      { key: "cheque_max", label: "Typical cheque to", type: "currency", list: true },
      { key: "relationship_owner_id", label: "Relationship owner", type: "relation", relation: "users", list: true },
      { key: "introduction_source", label: "Introduction source", type: "text" },
      { key: "relationship_strength", label: "Relationship", type: "select", options: RELATIONSHIP_STRENGTH, list: true },
      { key: "last_contact_date", label: "Last contact", type: "date", list: true },
      { key: "next_follow_up", label: "Next follow-up", type: "date", list: true },
      { key: "portfolio_companies", label: "Relevant portfolio companies", type: "text" },
      notes,
    ],
  },
  investor_contacts: {
    table: "investor_contacts", label: "Investor contact", plural: "Investor contacts", titleField: "full_name", group: "investor", module: "investors",
    description: "Key people at investors.",
    search: ["full_name", "title", "email"],
    fields: [
      { key: "full_name", label: "Name", type: "text", required: true, list: true },
      { key: "investor_id", label: "Investor", type: "relation", relation: "investors", required: true, list: true },
      { key: "title", label: "Title", type: "text", list: true },
      { key: "email", label: "Email", type: "text", list: true },
      notes,
    ],
  },
  fundraising_rounds: {
    table: "fundraising_rounds", label: "Round", plural: "Fundraising rounds", titleField: "name", group: "investor", module: "investors",
    description: "Funding rounds and targets.",
    search: ["name"],
    fields: [
      { key: "name", label: "Round", type: "text", required: true, list: true },
      { key: "target_amount", label: "Target raise", type: "currency", required: true, list: true },
      { key: "pre_money", label: "Pre-money valuation", type: "currency" },
      { key: "status", label: "Status", type: "select", options: ROUND_STATUS, list: true },
      { key: "open_date", label: "Opened", type: "date" },
      { key: "target_close_date", label: "Target close", type: "date", list: true },
      notes,
    ],
  },
  fundraising_opportunities: {
    table: "fundraising_opportunities", label: "Fundraising opportunity", plural: "Fundraising pipeline", titleField: "name", group: "investor", module: "investors",
    description: "Each investor's position in a round.",
    search: ["name", "outstanding_requirements", "next_action"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true, list: true, hint: "Usually the investor's name" },
      { key: "investor_id", label: "Investor", type: "relation", relation: "investors", required: true },
      { key: "round_id", label: "Round", type: "relation", relation: "fundraising_rounds", required: true },
      { key: "stage", label: "Stage", type: "select", options: FUNDRAISING_STAGES, required: true, list: true },
      { key: "potential_amount", label: "Potential amount", type: "currency", list: true, hint: "Our estimate of what they could invest" },
      { key: "indicative_amount", label: "Indicative interest", type: "currency", list: true, hint: "What they have said, not committed" },
      owner("Relationship owner"),
      { key: "expected_close", label: "Expected close", type: "date", list: true },
      { key: "next_action", label: "Next action", type: "text" },
      { key: "next_action_date", label: "Next action by", type: "date", list: true },
      { key: "outstanding_requirements", label: "Outstanding requirements", type: "textarea" },
      { key: "stage_changed_at", label: "In stage since", type: "date" },
    ],
  },
  investor_commitments: {
    table: "investor_commitments", label: "Commitment", plural: "Commitments", titleField: "reference", group: "financial", module: "investors",
    description: "Soft and legally binding commitments. Financial record.",
    search: ["reference"],
    fields: [
      { key: "reference", label: "Reference", type: "text", required: true, list: true },
      { key: "investor_id", label: "Investor", type: "relation", relation: "investors", required: true, list: true },
      { key: "round_id", label: "Round", type: "relation", relation: "fundraising_rounds", required: true },
      { key: "opportunity_id", label: "Fundraising opportunity", type: "relation", relation: "fundraising_opportunities" },
      { key: "commitment_type", label: "Type", type: "select", options: COMMITMENT_TYPE, required: true, list: true },
      { key: "amount", label: "Amount", type: "currency", required: true, list: true },
      { key: "committed_on", label: "Committed on", type: "date", list: true },
      { key: "document_ref", label: "Supporting document", type: "text", hint: "Term sheet, side letter or subscription agreement" },
      { key: "verified", label: "Verified", type: "boolean", list: true },
    ],
  },
  capital_receipts: {
    table: "capital_receipts", label: "Capital receipt", plural: "Capital received", titleField: "reference", group: "financial", module: "investors",
    description: "Cash received. Financial record.",
    search: ["reference"],
    fields: [
      { key: "reference", label: "Reference", type: "text", required: true, list: true },
      { key: "investor_id", label: "Investor", type: "relation", relation: "investors", required: true, list: true },
      { key: "round_id", label: "Round", type: "relation", relation: "fundraising_rounds", required: true },
      { key: "commitment_id", label: "Against commitment", type: "relation", relation: "investor_commitments" },
      { key: "amount", label: "Amount", type: "currency", required: true, list: true },
      { key: "received_on", label: "Received on", type: "date", required: true, list: true },
      { key: "verified", label: "Bank-verified", type: "boolean", list: true },
    ],
  },
  due_diligence_requests: {
    table: "due_diligence_requests", label: "Diligence request", plural: "Due diligence", titleField: "request", group: "investor", module: "investors",
    description: "Investor information requests.",
    search: ["request", "outstanding_questions", "related_files"],
    sort: ["deadline", "asc"],
    fields: [
      { key: "request", label: "Request", type: "text", required: true, list: true },
      { key: "investor_id", label: "Investor", type: "relation", relation: "investors", required: true, list: true },
      { key: "round_id", label: "Round", type: "relation", relation: "fundraising_rounds" },
      { key: "category", label: "Category", type: "select", options: DD_CATEGORY, list: true },
      owner("Internal owner"),
      { key: "deadline", label: "Deadline", type: "date", list: true },
      { key: "status", label: "Status", type: "select", options: DD_STATUS, required: true, list: true },
      { key: "priority", label: "Priority", type: "select", options: PRIORITY, list: true },
      { key: "approval_status", label: "Approval before release", type: "select", options: APPROVAL_STATUS },
      { key: "related_files", label: "Related files", type: "text" },
      { key: "outstanding_questions", label: "Outstanding questions", type: "textarea" },
    ],
  },
  investor_interactions: {
    table: "investor_interactions", label: "Interaction", plural: "Investor interactions", titleField: "summary", group: "investor", module: "investors",
    description: "Relationship history.",
    search: ["summary"],
    sort: ["occurred_on", "desc"],
    fields: [
      { key: "summary", label: "Summary", type: "text", required: true, list: true },
      { key: "investor_id", label: "Investor", type: "relation", relation: "investors", required: true, list: true },
      { key: "interaction_type", label: "Type", type: "select", options: INTERACTION_TYPE, list: true },
      { key: "occurred_on", label: "Date", type: "date", required: true, list: true },
      owner(),
    ],
  },
  financial_snapshots: {
    table: "financial_snapshots", label: "Financial snapshot", plural: "Financial snapshots", titleField: "period", group: "financial", module: "investors",
    description: "Month-end cash, burn and revenue. Financial record.",
    search: ["period", "source"],
    sort: ["period", "desc"],
    fields: [
      { key: "period", label: "Month end", type: "date", required: true, list: true },
      { key: "cash_balance", label: "Cash balance", type: "currency", required: true, list: true },
      { key: "monthly_burn", label: "Net monthly burn", type: "currency", required: true, list: true },
      { key: "revenue", label: "Revenue in month", type: "currency", list: true },
      { key: "arr", label: "ARR", type: "currency", list: true },
      { key: "headcount", label: "Headcount", type: "number" },
      { key: "source", label: "Source", type: "text", hint: "e.g. Xero month-end close" },
      { key: "verified", label: "Verified", type: "boolean", list: true },
    ],
  },
  reports: {
    table: "reports", label: "Report", plural: "Reports", titleField: "title", group: "core", module: "intelligence",
    description: "Briefings, updates and board packs.",
    search: ["title", "body", "period"],
    sort: ["created_at", "desc"],
    fields: [
      { key: "title", label: "Title", type: "text", required: true, list: true },
      { key: "report_type", label: "Type", type: "select", options: REPORT_TYPE, required: true, list: true },
      { key: "period", label: "Period", type: "text", list: true },
      { key: "status", label: "Status", type: "select", options: REPORT_STATUS, list: true },
      { key: "ai_generated", label: "AI-generated", type: "boolean", list: true, system: true },
      { key: "body", label: "Body (Markdown)", type: "textarea" },
    ],
  },
  documents: {
    table: "documents", label: "Document", plural: "Documents", titleField: "title", group: "core", module: "settings",
    description: "Links to documents held elsewhere.",
    search: ["title", "notes"],
    fields: [
      { key: "title", label: "Document", type: "text", required: true, list: true },
      { key: "category", label: "Category", type: "select", options: DOC_CATEGORY, list: true },
      { key: "url", label: "Link", type: "text" },
      owner(),
      { key: "project_id", label: "Project", type: "relation", relation: "projects" },
      { key: "investor_id", label: "Investor", type: "relation", relation: "investors" },
      { key: "opportunity_id", label: "Opportunity", type: "relation", relation: "commercial_opportunities" },
      notes,
    ],
  },
  ai_recommendations: {
    table: "ai_recommendations", label: "AI proposal", plural: "AI proposals", titleField: "title", group: "core", module: "agent",
    description: "Changes and insights proposed by the AI, awaiting a person.",
    search: ["title", "rationale"],
    sort: ["created_at", "desc"],
    fields: [
      { key: "title", label: "Proposal", type: "text", required: true, list: true },
      { key: "kind", label: "Kind", type: "select", options: ["proposed_change", "insight"], list: true },
      { key: "target_table", label: "Record type", type: "text", list: true },
      { key: "status", label: "Status", type: "select", options: RECOMMENDATION_STATUS, list: true },
      { key: "rationale", label: "Rationale", type: "textarea" },
      { key: "confidence", label: "Confidence", type: "select", options: ["low", "medium", "high"] },
    ],
  },
  audit_logs: {
    table: "audit_logs", label: "Audit entry", plural: "Audit log", titleField: "summary", group: "admin", module: "settings",
    description: "Every change, by whom and from where.",
    search: ["summary", "table_name", "actor_name"],
    sort: ["created_at", "desc"],
    fields: [
      { key: "summary", label: "Change", type: "text", list: true },
      { key: "actor_name", label: "By", type: "text", list: true },
      { key: "actor_type", label: "Actor", type: "select", options: ["user", "ai", "system"], list: true },
      { key: "table_name", label: "Record type", type: "text", list: true },
      { key: "created_at", label: "When", type: "datetime", list: true },
    ],
  },
};

export function entity(table: string): EntityDef {
  const e = (ENTITIES as Record<string, EntityDef>)[table];
  if (!e) throw new Error(`Unknown record type: ${table}`);
  return e;
}

export function isTable(t: string): t is TableName {
  return (TABLES as readonly string[]).includes(t);
}

/** Relation tables a set of entities needs labels for. */
export function relationTables(tables: TableName[]): TableName[] {
  const set = new Set<TableName>();
  for (const t of tables) for (const f of ENTITIES[t].fields) if (f.type === "relation" && f.relation) set.add(f.relation);
  return [...set];
}

export const humanize = (s: string | null | undefined) =>
  !s ? "" : s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
