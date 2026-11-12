/**
 * Realistic fictional demo data for CoS OS.
 *
 * Fernhill Systems Ltd is an invented UK B2B SaaS company (energy optimisation
 * for commercial buildings) raising an £8m Series A. Every person, company,
 * investor and figure here is fictional.
 *
 * Dates are written as day offsets from "today" using D(n) and T(n, "HH:MM"),
 * so the demo always has overdue, upcoming and stalled items. The local store
 * resolves them to real dates; scripts/generate-seed-sql.ts turns them into
 * SQL date expressions.
 */
import { stableId } from "../utils";
import type { TableName } from "../schema";

type Seed = Record<string, unknown>;
export const ORG_ID = stableId("org:fernhill");
const id = (table: string, key: string) => stableId(`${table}:${key}`);
export const D = (n: number) => `@@D:${n}@@`;
export const T = (n: number, hm = "10:00") => `@@T:${n}:${hm}@@`;

/* ---------- People ---------- */
const U = (k: string) => id("users", k);
const people: Seed[] = [
  { key: "alex", full_name: "Alex Morgan", title: "Chief Executive Officer", email: "alex@fernhill.example", team: "leadership" },
  { key: "priya", full_name: "Priya Shah", title: "Chief of Staff", email: "priya@fernhill.example", team: "leadership" },
  { key: "daniel", full_name: "Daniel Okafor", title: "Chief Financial Officer", email: "daniel@fernhill.example", team: "finance" },
  { key: "sophie", full_name: "Sophie Laurent", title: "Chief Commercial Officer", email: "sophie@fernhill.example", team: "commercial" },
  { key: "tom", full_name: "Tom Reid", title: "Chief Technology Officer", email: "tom@fernhill.example", team: "engineering" },
  { key: "grace", full_name: "Grace Liu", title: "Head of Delivery", email: "grace@fernhill.example", team: "delivery" },
  { key: "marcus", full_name: "Marcus Bell", title: "Head of Product", email: "marcus@fernhill.example", team: "engineering" },
  { key: "ella", full_name: "Ella Novak", title: "Customer Success Lead", email: "ella@fernhill.example", team: "delivery" },
  { key: "sam", full_name: "Sam Whitaker", title: "Senior Account Executive", email: "sam@fernhill.example", team: "commercial" },
  { key: "ruth", full_name: "Ruth Adeyemi", title: "Board Observer", email: "ruth@fernhill.example", team: "leadership" },
];

/** Demo sign-in personas and their roles. */
export const DEMO_PERSONAS = [
  { personKey: "alex", role: "owner", blurb: "CEO. Full access, including capital and financial records." },
  { personKey: "priya", role: "admin", blurb: "Chief of Staff. Full access and workspace settings." },
  { personKey: "grace", role: "member", blurb: "Head of Delivery. Projects, pipeline and meetings; no investor data." },
  { personKey: "ruth", role: "viewer", blurb: "Board observer. Read-only, no investor data." },
] as const;

const teams: Seed[] = [
  { key: "leadership", name: "Leadership", lead: "alex", description: "Executive team." },
  { key: "commercial", name: "Commercial", lead: "sophie", description: "Sales, partnerships and marketing." },
  { key: "engineering", name: "Product & Engineering", lead: "tom", description: "Platform, data science and product." },
  { key: "delivery", name: "Delivery & Customer Success", lead: "grace", description: "Onboarding, delivery and account health." },
  { key: "finance", name: "Finance & Operations", lead: "daniel", description: "Finance, legal and people operations." },
];

/* ---------- Strategy ---------- */
const O = (k: string) => id("strategic_objectives", k);
const objectives: Seed[] = [
  { key: "arr", title: "Reach £5m ARR by December 2026", level: "annual", period: "FY2026", owner: "sophie", status: "at_risk", progress: 62, measure: "ARR of £5.0m in the December month-end close", due_date: D(49), description: "Grow recurring revenue from £2.4m to £5.0m through enterprise portfolio deals and expansion.", assumptions: "Three enterprise portfolio deals close in Q4. Average new-logo ACV holds at £85k." },
  { key: "raise", title: "Close an £8m Series A by the end of Q1 2027", level: "annual", period: "FY2026", owner: "alex", status: "on_track", progress: 45, measure: "£8m legally committed and received", due_date: D(139), description: "Fund 24 months of runway and the Platform 3.0 roadmap.", assumptions: "Lead investor term sheet by mid-December. Pre-money of £32m." },
  { key: "platform", title: "Launch Platform 3.0 with predictive maintenance", level: "annual", period: "FY2026", owner: "tom", status: "at_risk", progress: 55, measure: "General availability with at least 5 paying sites", due_date: D(45), description: "Add fault prediction for HVAC assets to the core optimisation product.", assumptions: "Pilot data from five sites is sufficient to reach 85% fault-prediction accuracy." },
  { key: "nrr", title: "Net revenue retention above 115%", level: "annual", period: "FY2026", owner: "ella", status: "on_track", progress: 70, measure: "Trailing-12-month NRR of 115% or more", due_date: D(49) },
  { key: "opmodel", title: "Build a scalable operating model", level: "annual", period: "FY2026", owner: null, status: "not_started", progress: 0, measure: null, due_date: D(49), description: "Hiring plan, management reporting and decision rights for a 60-person company." },
  { key: "q-enterprise", title: "Sign three enterprise portfolio deals", level: "quarterly", period: "Q4 2026", parent: "arr", owner: "sophie", status: "at_risk", progress: 33, measure: "Three signed contracts above £150k ACV", due_date: D(49) },
  { key: "q-dataroom", title: "Data room complete and six investors in diligence", level: "quarterly", period: "Q4 2026", parent: "raise", owner: "daniel", status: "on_track", progress: 60, measure: "Data room index 100% and six investors at Due Diligence or later", due_date: D(35) },
  { key: "q-beta", title: "Platform 3.0 beta live at five pilot sites", level: "quarterly", period: "Q4 2026", parent: "platform", owner: "tom", status: "at_risk", progress: 40, measure: "Five sites running predictive alerts in production", due_date: D(20) },
  { key: "q-onboarding", title: "Reduce median onboarding time to 21 days", level: "quarterly", period: "Q4 2026", parent: "nrr", owner: "grace", status: "off_track", progress: 35, measure: "Median days from contract to first optimisation under 21", due_date: D(49) },
  { key: "q-nl", title: "Prepare Netherlands market entry", level: "quarterly", period: "Q4 2026", parent: null, owner: "sophie", status: "not_started", progress: 0, measure: null, due_date: D(49) },
];

const kpis: Seed[] = [
  { key: "arr", name: "Annual recurring revenue", objective: "arr", owner: "daniel", unit: "£", baseline: 2400000, current_value: 3120000, target_value: 5000000, direction: "increase", period: "FY2026", last_updated: D(-12), source: "October month-end close (accounting system and subscription ledger)" },
  { key: "nrr", name: "Net revenue retention (TTM)", objective: "nrr", owner: "ella", unit: "%", baseline: 108, current_value: 112, target_value: 115, direction: "increase", period: "FY2026", last_updated: D(-12), source: "Subscription ledger, October close" },
  { key: "gm", name: "Gross margin", objective: "arr", owner: "daniel", unit: "%", baseline: 68, current_value: 71, target_value: 75, direction: "increase", period: "FY2026", last_updated: D(-12), source: "October management accounts" },
  { key: "onboard", name: "Median onboarding time", objective: "q-onboarding", owner: "grace", unit: "days", baseline: 41, current_value: 34, target_value: 21, direction: "decrease", period: "Q4 2026", last_updated: D(-5), source: "Delivery tracker" },
  { key: "coverage", name: "Pipeline coverage of remaining target", objective: "arr", owner: "sophie", unit: "x", baseline: 2.5, current_value: 2.1, target_value: 3, direction: "increase", period: "Q4 2026", last_updated: D(-7), source: "CRM export" },
  { key: "burn", name: "Net monthly burn", objective: "raise", owner: "daniel", unit: "£", baseline: 360000, current_value: 412000, target_value: 400000, direction: "decrease", period: "FY2026", last_updated: D(-12), source: "October management accounts" },
];

/* ---------- Projects ---------- */
const P = (k: string) => id("projects", k);
const projects: Seed[] = [
  { key: "p3", name: "Platform 3.0: predictive maintenance", objective: "q-beta", sponsor: "alex", owner: "tom", priority: "critical", status: "active", rag: "amber", progress: 60, start_date: D(-120), target_date: D(45), budget: 620000, spent: 455000, description: "Fault prediction for HVAC assets, trained on pilot-site telemetry, shipped as a new product tier.", deliverables: "Prediction service; alerting in the client dashboard; pilot report; GA release notes.", decisions_required: "Pricing for the predictive tier (see decision register)." },
  { key: "dataroom", name: "Series A data room and diligence readiness", objective: "q-dataroom", sponsor: "alex", owner: "daniel", priority: "critical", status: "active", rag: "green", progress: 72, start_date: D(-60), target_date: D(20), budget: 60000, spent: 38000, description: "Investor-grade data room, financial model and legal pack for the Series A.", deliverables: "Data room index; three-statement model v3; legal DD pack; customer reference list." },
  { key: "onboarding", name: "Enterprise onboarding redesign", objective: "q-onboarding", sponsor: "sophie", owner: "grace", priority: "high", status: "active", rag: "red", progress: 70, start_date: D(-90), target_date: D(-5), budget: 45000, spent: 51000, description: "Cut onboarding from 41 to 21 days with a standard playbook and automated data ingestion.", deliverables: "Playbook; ingestion connectors for three BMS vendors; onboarding dashboard.", decisions_required: "Whether to extend the project by four weeks or descope the third BMS connector." },
  { key: "crm", name: "CRM migration to HubSpot", objective: null, sponsor: "sophie", owner: "sam", priority: "medium", status: "active", rag: "amber", progress: 35, start_date: D(-40), target_date: D(30), budget: 25000, spent: 9000, description: "Move pipeline, contacts and activity history off spreadsheets and the legacy CRM." },
  { key: "iso", name: "ISO 27001 certification", objective: "q-enterprise", sponsor: "daniel", owner: "tom", priority: "high", status: "active", rag: "amber", progress: 45, start_date: D(-75), target_date: D(60), budget: 40000, spent: 21000, description: "Certification required by two enterprise prospects and expected by investors." },
  { key: "nl", name: "Netherlands market entry study", objective: "q-nl", sponsor: "alex", owner: "sophie", priority: "low", status: "planning", rag: "green", progress: 10, start_date: D(-10), target_date: D(90), budget: 15000, spent: 0, description: "Sizing, channel partners and regulatory requirements for a 2027 launch." },
  { key: "pricing", name: "Pricing and packaging refresh", objective: "arr", sponsor: "sophie", owner: "marcus", priority: "high", status: "on_hold", rag: "amber", progress: 30, start_date: D(-50), target_date: D(15), budget: 20000, spent: 8000, description: "New tiers including predictive maintenance; usage-based add-on for large portfolios.", decisions_required: "Approve predictive tier price point." },
];

const milestones: Seed[] = [
  { key: "p3-accuracy", project: "p3", title: "Fault-prediction accuracy of 85% on pilot data", owner: "tom", due_date: D(-10), status: "in_progress" },
  { key: "p3-beta", project: "p3", title: "Beta live at five pilot sites", owner: "tom", due_date: D(20), status: "not_started" },
  { key: "p3-ga", project: "p3", title: "General availability", owner: "marcus", due_date: D(45), status: "not_started" },
  { key: "dr-model", project: "dataroom", title: "Financial model v3 signed off", owner: "daniel", due_date: D(-3), status: "complete", completed_on: D(-4), evidence: "Model v3 approved by CEO and CFO in the exec meeting; file in data room folder 2.1." },
  { key: "dr-index", project: "dataroom", title: "Data room index complete", owner: "priya", due_date: D(5), status: "in_progress" },
  { key: "dr-legal", project: "dataroom", title: "Legal DD pack ready", owner: "daniel", due_date: D(18), status: "not_started" },
  { key: "ob-playbook", project: "onboarding", title: "New onboarding playbook live", owner: "grace", due_date: D(-12), status: "in_progress" },
  { key: "ob-three", project: "onboarding", title: "Three customers onboarded on the new flow", owner: "ella", due_date: D(10), status: "not_started" },
  { key: "crm-dry", project: "crm", title: "Data migration dry run", owner: "sam", due_date: D(7), status: "in_progress" },
  { key: "crm-cutover", project: "crm", title: "Cutover to HubSpot", owner: "sam", due_date: D(30), status: "not_started" },
  { key: "iso-gap", project: "iso", title: "Gap assessment complete", owner: "tom", due_date: D(-20), status: "complete", completed_on: D(-22), evidence: "Gap assessment report from the external auditor, received and filed." },
  { key: "iso-s1", project: "iso", title: "Stage 1 audit", owner: "tom", due_date: D(21), status: "not_started" },
  { key: "iso-s2", project: "iso", title: "Stage 2 audit", owner: "tom", due_date: D(60), status: "not_started" },
  { key: "pr-proposal", project: "pricing", title: "Pricing proposal to the executive team", owner: "marcus", due_date: D(-2), status: "not_started" },
];

const tasks: Seed[] = [
  { key: "t1", title: "Retrain fault model with October telemetry from Halcyon sites", project: "p3", milestone: "p3-accuracy", owner: "tom", due_date: D(-4), status: "in_progress", priority: "critical", escalated: true },
  { key: "t2", title: "Confirm install dates for gateway hardware at five pilot sites", project: "p3", milestone: "p3-beta", owner: "grace", due_date: D(6), status: "todo", priority: "high" },
  { key: "t3", title: "Upload customer contracts to data room (folder 4)", project: "dataroom", milestone: "dr-index", owner: "priya", due_date: D(2), status: "in_progress", priority: "high" },
  { key: "t4", title: "Prepare churn cohort analysis for investors", project: "dataroom", owner: "daniel", due_date: D(-1), status: "todo", priority: "high" },
  { key: "t5", title: "Instruct counsel on legal DD pack", project: "dataroom", milestone: "dr-legal", owner: "daniel", due_date: D(4), status: "todo", priority: "medium" },
  { key: "t6", title: "Finish BMS connector for Vantage controllers", project: "onboarding", milestone: "ob-playbook", owner: "tom", due_date: D(-8), status: "blocked", priority: "high", escalated: true, description: "Blocked on API credentials from Vantage. Third request sent." },
  { key: "t7", title: "Publish onboarding playbook to customer success", project: "onboarding", milestone: "ob-playbook", owner: "grace", due_date: D(-6), status: "in_progress", priority: "high" },
  { key: "t8", title: "Map legacy CRM fields to HubSpot properties", project: "crm", milestone: "crm-dry", owner: "sam", due_date: D(3), status: "in_progress", priority: "medium" },
  { key: "t9", title: "Write access control policy for ISO scope", project: "iso", milestone: "iso-s1", owner: "tom", due_date: D(9), status: "todo", priority: "high" },
  { key: "t10", title: "Draft predictive tier pricing options", project: "pricing", milestone: "pr-proposal", owner: "marcus", due_date: D(-5), status: "todo", priority: "high" },
  { key: "t11", title: "Send Halcyon Estates commercial proposal v2", project: null, owner: "sophie", due_date: D(1), status: "todo", priority: "critical", opportunity: "halcyon" },
  { key: "t12", title: "Book reference call between Northbridge and Brightwater FM", project: null, owner: "alex", due_date: D(3), status: "todo", priority: "high", investor: "northbridge" },
  { key: "t13", title: "Agenda and papers for December board meeting", project: null, owner: "priya", due_date: D(12), status: "todo", priority: "medium" },
  { key: "t14", title: "Hire senior data scientist (offer stage)", project: "p3", owner: "tom", due_date: D(14), status: "in_progress", priority: "medium" },
  { key: "t15", title: "Customer health review for top 20 accounts", project: null, owner: "ella", due_date: D(8), status: "todo", priority: "medium" },
  { key: "t16", title: "Collect gateway telemetry export for model validation", project: "p3", milestone: "p3-accuracy", owner: "marcus", due_date: D(-15), status: "done", priority: "high", evidence: "Export delivered to data science bucket; checksum confirmed." },
];

const dependencies: Seed[] = [
  { key: "d1", project: "dataroom", depends_on: "iso", description: "Security policies and ISO statement of applicability needed for the technical DD folder", needed_by: D(15), status: "at_risk" },
  { key: "d2", project: "onboarding", depends_on: "crm", description: "Onboarding workflow automation runs on HubSpot pipelines", needed_by: D(10), status: "open" },
  { key: "d3", project: "p3", depends_on: "pricing", description: "GA launch needs the approved predictive tier price", needed_by: D(25), status: "at_risk" },
];

const risks: Seed[] = [
  { key: "r1", title: "Fault-prediction accuracy below the 85% threshold", category: "delivery", likelihood: 4, impact: 5, owner: "tom", status: "open", project: "p3", objective: "platform", review_date: D(3), description: "Latest validation run reached 79%. Beta and GA dates depend on it.", mitigation: "Retrain with October telemetry; narrow beta to two asset classes if needed." },
  { key: "r2", title: "Series A closes after cash runway falls below six months", category: "fundraising", likelihood: 3, impact: 5, owner: "daniel", status: "open", objective: "raise", review_date: D(7), description: "Runway is under eight months at current burn.", mitigation: "Prioritise two lead candidates; prepare a bridge option with existing angels." },
  { key: "r3", title: "Enterprise deals slip into 2027", category: "commercial", likelihood: 3, impact: 4, owner: "sophie", status: "open", objective: "arr", review_date: D(5), mitigation: "Executive sponsor calls on Halcyon and Meridian; offer phased rollout." },
  { key: "r4", title: "Vantage API access delays onboarding connector", category: "delivery", likelihood: 4, impact: 3, owner: "grace", status: "mitigating", project: "onboarding", review_date: D(2), mitigation: "Escalate through Vantage partner manager; manual CSV ingestion as fallback." },
  { key: "r5", title: "Key-person dependency on CTO across three critical projects", category: "people", likelihood: 3, impact: 4, owner: "alex", status: "open", review_date: D(10), description: "Tom owns Platform 3.0, ISO 27001 and the Vantage connector." },
  { key: "r6", title: "ISO 27001 certificate not in place for Meridian procurement", category: "regulatory", likelihood: 2, impact: 4, owner: "tom", status: "open", project: "iso", opportunity: "meridian", review_date: D(14) },
  { key: "r7", title: "Onboarding project over budget", category: "financial", likelihood: 5, impact: 2, owner: "grace", status: "open", project: "onboarding", review_date: D(7), description: "Spent £51k against a £45k budget." },
];

/* ---------- Commercial ---------- */
const A = (k: string) => id("commercial_accounts", k);
const accounts: Seed[] = [
  { key: "halcyon", name: "Halcyon Estates", account_type: "prospect", sector: "Commercial real estate", region: "UK", owner: "sophie", website: "halcyon.example" },
  { key: "meridian", name: "Meridian Hospitals Trust", account_type: "prospect", sector: "Healthcare estates", region: "UK", owner: "sam" },
  { key: "brightwater", name: "Brightwater FM", account_type: "customer", sector: "Facilities management", region: "UK", owner: "ella" },
  { key: "oakfield", name: "Oakfield Retail Parks", account_type: "customer", sector: "Retail property", region: "UK", owner: "ella" },
  { key: "corvid", name: "Corvid Data Centres", account_type: "prospect", sector: "Data centres", region: "UK & Ireland", owner: "sam" },
  { key: "stavanger", name: "Nordlys Property AS", account_type: "prospect", sector: "Commercial real estate", region: "Norway", owner: "sophie" },
  { key: "unity", name: "Unity Campus Partners", account_type: "prospect", sector: "Higher education", region: "UK", owner: "sam" },
  { key: "gridwise", name: "Gridwise Energy", account_type: "partner", sector: "Energy supplier", region: "UK", owner: "sophie", notes: "Channel partnership: bundled optimisation for business energy customers." },
  { key: "kestrel", name: "Kestrel Logistics", account_type: "prospect", sector: "Logistics", region: "UK", owner: "sam" },
  { key: "vantage", name: "Vantage Controls", account_type: "partner", sector: "Building management systems", region: "Europe", owner: "tom", notes: "BMS vendor. API access needed for onboarding connector." },
  { key: "harbour", name: "Harbour City Council", account_type: "prospect", sector: "Public sector", region: "UK", owner: "sam" },
  { key: "linden", name: "Linden Office REIT", account_type: "customer", sector: "Commercial real estate", region: "UK", owner: "ella" },
];

const contacts: Seed[] = [
  { key: "c1", account: "halcyon", full_name: "Imogen Price", title: "Head of Sustainability", email: "imogen.price@halcyon.example" },
  { key: "c2", account: "halcyon", full_name: "Rob Achebe", title: "Procurement Director", email: "rob.achebe@halcyon.example" },
  { key: "c3", account: "meridian", full_name: "Dr Helen Marsh", title: "Director of Estates", email: "h.marsh@meridian.example" },
  { key: "c4", account: "brightwater", full_name: "Jonah Fields", title: "Operations Director", email: "jonah@brightwater.example" },
  { key: "c5", account: "corvid", full_name: "Lena Varga", title: "VP Infrastructure", email: "lena.varga@corvid.example" },
  { key: "c6", account: "gridwise", full_name: "Callum Doyle", title: "Partnerships Lead", email: "callum@gridwise.example" },
  { key: "c7", account: "unity", full_name: "Femi Adebayo", title: "Head of Campus Services", email: "f.adebayo@unity.example" },
  { key: "c8", account: "stavanger", full_name: "Ingrid Solberg", title: "Chief Operating Officer", email: "ingrid@nordlys.example" },
];

const OPP = (k: string) => id("commercial_opportunities", k);
const opportunities: Seed[] = [
  { key: "halcyon", name: "Halcyon Estates portfolio rollout (42 buildings)", account: "halcyon", owner: "sophie", stage: "Negotiation", value: 420000, probability: 60, expected_close: D(21), next_action: "Send proposal v2 with phased rollout", next_action_date: D(1), last_activity_date: D(-3), stage_changed_at: D(-18), objective: "q-enterprise", risk_notes: "Procurement pushing for 15% discount and 60-day payment terms." },
  { key: "meridian", name: "Meridian Hospitals estate optimisation", account: "meridian", owner: "sam", stage: "Proposal", value: 310000, probability: 40, expected_close: D(35), next_action: "Answer security questionnaire", next_action_date: D(-2), last_activity_date: D(-9), stage_changed_at: D(-30), objective: "q-enterprise", risk_notes: "Requires ISO 27001 certificate before contract award." },
  { key: "corvid", name: "Corvid Data Centres pilot to rollout", account: "corvid", owner: "sam", stage: "Discovery", value: 260000, probability: 25, expected_close: D(70), next_action: null, next_action_date: null, last_activity_date: D(-34), stage_changed_at: D(-52), objective: "q-enterprise" },
  { key: "brightwater-exp", name: "Brightwater FM expansion (+60 sites)", account: "brightwater", owner: "ella", stage: "Contracting", value: 180000, probability: 85, expected_close: D(9), next_action: "Countersign order form", next_action_date: D(4), last_activity_date: D(-2), stage_changed_at: D(-6), objective: "nrr" },
  { key: "oakfield-renew", name: "Oakfield renewal and predictive add-on", account: "oakfield", owner: "ella", stage: "Proposal", value: 95000, probability: 55, expected_close: D(28), next_action: "Pricing for predictive add-on", next_action_date: D(10), last_activity_date: D(-11), stage_changed_at: D(-14), objective: "nrr", risk_notes: "Add-on depends on predictive tier pricing decision." },
  { key: "nordlys", name: "Nordlys Property pilot", account: "stavanger", owner: "sophie", stage: "Qualified", value: 120000, probability: 20, expected_close: D(95), next_action: "Discovery call with COO", next_action_date: D(12), last_activity_date: D(-6), stage_changed_at: D(-20) },
  { key: "unity", name: "Unity Campus energy programme", account: "unity", owner: "sam", stage: "Proposal", value: 150000, probability: 35, expected_close: D(-6), next_action: "Chase decision", next_action_date: D(-4), last_activity_date: D(-27), stage_changed_at: D(-45), risk_notes: "Expected close date has passed." },
  { key: "gridwise", name: "Gridwise channel partnership", account: "gridwise", owner: "sophie", stage: "Negotiation", value: 350000, probability: 45, expected_close: D(40), is_partnership: true, next_action: "Revenue share term sheet review", next_action_date: D(5), last_activity_date: D(-4), stage_changed_at: D(-21), objective: "arr" },
  { key: "kestrel", name: "Kestrel Logistics warehouses", account: "kestrel", owner: "sam", stage: "Lead", value: 80000, probability: 10, expected_close: D(120), next_action: "Intro call", next_action_date: D(9), last_activity_date: D(-8), stage_changed_at: D(-8) },
  { key: "harbour", name: "Harbour City Council framework", account: "harbour", owner: "sam", stage: "Qualified", value: 200000, probability: 15, expected_close: D(150), next_action: null, next_action_date: null, last_activity_date: D(-41), stage_changed_at: D(-60) },
  { key: "linden-won", name: "Linden Office REIT (12 buildings)", account: "linden", owner: "ella", stage: "Won", value: 110000, probability: 100, expected_close: D(-25), last_activity_date: D(-25), stage_changed_at: D(-25) },
  { key: "oakfield-won", name: "Oakfield phase 2", account: "oakfield", owner: "ella", stage: "Won", value: 65000, probability: 100, expected_close: D(-48), last_activity_date: D(-48), stage_changed_at: D(-48) },
  { key: "lost-1", name: "Westgate Shopping Centres", account: "kestrel", owner: "sam", stage: "Lost", value: 140000, probability: 0, expected_close: D(-30), lost_reason: "Chose incumbent BMS vendor's analytics module", last_activity_date: D(-30), stage_changed_at: D(-30) },
];

const activities: Seed[] = [
  { key: "a1", opp: "halcyon", account: "halcyon", activity_type: "meeting", occurred_on: D(-3), owner: "sophie", summary: "Commercial negotiation with procurement; discount and payment terms open" },
  { key: "a2", opp: "halcyon", account: "halcyon", activity_type: "demo", occurred_on: D(-24), owner: "sophie", summary: "Portfolio dashboard demo to sustainability team" },
  { key: "a3", opp: "meridian", account: "meridian", activity_type: "email", occurred_on: D(-9), owner: "sam", summary: "Security questionnaire received (142 questions)" },
  { key: "a4", opp: "brightwater-exp", account: "brightwater", activity_type: "call", occurred_on: D(-2), owner: "ella", summary: "Order form agreed; legal reviewing" },
  { key: "a5", opp: "corvid", account: "corvid", activity_type: "meeting", occurred_on: D(-34), owner: "sam", summary: "Discovery workshop on cooling load data" },
  { key: "a6", opp: "gridwise", account: "gridwise", activity_type: "meeting", occurred_on: D(-4), owner: "sophie", summary: "Partnership economics: 20% revenue share proposed" },
  { key: "a7", opp: "unity", account: "unity", activity_type: "proposal", occurred_on: D(-27), owner: "sam", summary: "Proposal sent for 9-campus programme" },
  { key: "a8", opp: "oakfield-renew", account: "oakfield", activity_type: "call", occurred_on: D(-11), owner: "ella", summary: "Renewal confirmed in principle; interested in predictive add-on" },
  { key: "a9", opp: "nordlys", account: "stavanger", activity_type: "email", occurred_on: D(-6), owner: "sophie", summary: "Intro from Gridwise; discovery call requested" },
  { key: "a10", opp: "kestrel", account: "kestrel", activity_type: "email", occurred_on: D(-8), owner: "sam", summary: "Inbound enquiry from website" },
];

/* ---------- Investors ---------- */
const I = (k: string) => id("investors", k);
const investors: Seed[] = [
  { key: "northbridge", name: "Northbridge Ventures", category: "venture_capital", investment_focus: "Series A climate software", sectors: "Climate tech, B2B SaaS", geographies: "UK, Europe", cheque_min: 2000000, cheque_max: 5000000, owner: "alex", introduction_source: "Existing angel (Clara Hughes)", relationship_strength: "strong", last_contact_date: D(-2), next_follow_up: D(3), portfolio_companies: "Voltaic, HeatGrid" },
  { key: "aster", name: "Aster Capital Partners", category: "venture_capital", investment_focus: "Industrial and energy software", sectors: "Energy, PropTech", geographies: "Europe", cheque_min: 3000000, cheque_max: 8000000, owner: "alex", introduction_source: "Conference (Future Buildings Summit)", relationship_strength: "warm", last_contact_date: D(-6), next_follow_up: D(1) },
  { key: "greenfield", name: "Greenfield Impact Fund", category: "private_equity", investment_focus: "Impact growth equity", sectors: "Decarbonisation", geographies: "UK", cheque_min: 1000000, cheque_max: 4000000, owner: "daniel", introduction_source: "Advisor network", relationship_strength: "warm", last_contact_date: D(-15), next_follow_up: D(-5) },
  { key: "climate-angels", name: "Climate Angels Syndicate", category: "angel", investment_focus: "Early-stage climate", sectors: "Climate tech", geographies: "UK", cheque_min: 100000, cheque_max: 750000, owner: "priya", introduction_source: "Inbound", relationship_strength: "strong", last_contact_date: D(-9), next_follow_up: D(6) },
  { key: "helix-cvc", name: "Helix Energy Ventures (CVC)", category: "corporate_vc", investment_focus: "Strategic energy technology", sectors: "Energy services", geographies: "Global", cheque_min: 1000000, cheque_max: 3000000, owner: "sophie", introduction_source: "Gridwise partnership", relationship_strength: "warm", last_contact_date: D(-19), next_follow_up: D(-7) },
  { key: "pinecrest", name: "Pinecrest Family Office", category: "family_office", investment_focus: "Real assets and enabling technology", sectors: "Real estate, PropTech", geographies: "UK", cheque_min: 500000, cheque_max: 2000000, owner: "priya", introduction_source: "Board member (Ruth Adeyemi)", relationship_strength: "warm", last_contact_date: D(-38), next_follow_up: null },
  { key: "elm", name: "Elm Street Capital", category: "venture_capital", investment_focus: "B2B SaaS Series A", sectors: "Vertical SaaS", geographies: "UK", cheque_min: 2000000, cheque_max: 6000000, owner: "alex", introduction_source: "Cold outreach", relationship_strength: "cold", last_contact_date: D(-27), next_follow_up: D(-10) },
  { key: "solent", name: "Solent Growth Partners", category: "venture_capital", investment_focus: "Deep tech and energy", sectors: "Energy, AI", geographies: "UK, Nordics", cheque_min: 2000000, cheque_max: 5000000, owner: "alex", introduction_source: "Northbridge co-invest network", relationship_strength: "warm", last_contact_date: D(-4), next_follow_up: D(8) },
  { key: "brookline", name: "Brookline Angels", category: "angel", investment_focus: "Seed and pre-Series A", sectors: "Generalist", geographies: "UK", cheque_min: 50000, cheque_max: 300000, owner: "priya", introduction_source: "Existing investor", relationship_strength: "strong", last_contact_date: D(-20), next_follow_up: null },
  { key: "vireo", name: "Vireo Climate Fund", category: "venture_capital", investment_focus: "Buildings decarbonisation", sectors: "Climate tech, PropTech", geographies: "Europe", cheque_min: 3000000, cheque_max: 10000000, owner: null, introduction_source: null, relationship_strength: "cold", last_contact_date: null, next_follow_up: null, notes: "Strong thesis fit: led two building-energy rounds in 2026. No relationship yet." },
  { key: "uk-innov", name: "National Innovation Fund", category: "government", investment_focus: "Co-investment alongside private leads", sectors: "Net zero", geographies: "UK", cheque_min: 500000, cheque_max: 2000000, owner: "daniel", introduction_source: "Application", relationship_strength: "warm", last_contact_date: D(-12), next_follow_up: D(12) },
  { key: "atlas", name: "Atlas Peak Ventures", category: "venture_capital", investment_focus: "Series A/B software", sectors: "SaaS", geographies: "US, UK", cheque_min: 5000000, cheque_max: 15000000, owner: "alex", introduction_source: "Cold outreach", relationship_strength: "cold", last_contact_date: D(-44), next_follow_up: null },
];

const investorContacts: Seed[] = [
  { key: "ic1", investor: "northbridge", full_name: "Olivia Grant", title: "Partner", email: "olivia@northbridge.example" },
  { key: "ic2", investor: "northbridge", full_name: "James Kerr", title: "Associate", email: "james@northbridge.example" },
  { key: "ic3", investor: "aster", full_name: "Mathilde Roux", title: "Principal", email: "m.roux@aster.example" },
  { key: "ic4", investor: "greenfield", full_name: "Kwame Mensah", title: "Investment Director", email: "kwame@greenfield.example" },
  { key: "ic5", investor: "helix-cvc", full_name: "Anna Lindqvist", title: "Director, Ventures", email: "anna.l@helix.example" },
  { key: "ic6", investor: "solent", full_name: "Rory Byrne", title: "Partner", email: "rory@solent.example" },
  { key: "ic7", investor: "climate-angels", full_name: "Clara Hughes", title: "Syndicate Lead", email: "clara@climateangels.example" },
];

const R = id("fundraising_rounds", "series-a");
const rounds: Seed[] = [
  { key: "series-a", name: "Series A", target_amount: 8000000, pre_money: 32000000, status: "open", open_date: D(-75), target_close_date: D(120), notes: "Target lead cheque £4–5m with co-investors." },
];

const FO = (k: string) => id("fundraising_opportunities", k);
const fundOpps: Seed[] = [
  { key: "northbridge", investor: "northbridge", stage: "Due Diligence", potential_amount: 4000000, indicative_amount: 3500000, owner: "alex", expected_close: D(60), next_action: "Customer reference calls", next_action_date: D(3), outstanding_requirements: "Churn cohort analysis; two customer references; technical DD session.", stage_changed_at: D(-12) },
  { key: "aster", investor: "aster", stage: "Investment Interest", potential_amount: 5000000, indicative_amount: 4000000, owner: "alex", expected_close: D(75), next_action: "Partner meeting", next_action_date: D(1), outstanding_requirements: "Financial model v3; pipeline detail.", stage_changed_at: D(-10) },
  { key: "greenfield", investor: "greenfield", stage: "Due Diligence", potential_amount: 2500000, indicative_amount: 2000000, owner: "daniel", expected_close: D(80), next_action: "Return impact questionnaire", next_action_date: D(-5), outstanding_requirements: "Impact KPIs methodology; carbon savings validation.", stage_changed_at: D(-21) },
  { key: "climate-angels", investor: "climate-angels", stage: "Soft Commitment", potential_amount: 750000, indicative_amount: 500000, owner: "priya", expected_close: D(45), next_action: "Send subscription documents when lead is confirmed", next_action_date: D(20), stage_changed_at: D(-9) },
  { key: "helix-cvc", investor: "helix-cvc", stage: "Follow-up", potential_amount: 2000000, indicative_amount: null, owner: "sophie", expected_close: D(100), next_action: "Send strategic partnership memo", next_action_date: D(-7), stage_changed_at: D(-19) },
  { key: "pinecrest", investor: "pinecrest", stage: "First Meeting", potential_amount: 1000000, indicative_amount: null, owner: "priya", expected_close: D(110), next_action: null, next_action_date: null, stage_changed_at: D(-38) },
  { key: "elm", investor: "elm", stage: "Introduction", potential_amount: 3000000, indicative_amount: null, owner: "alex", expected_close: D(120), next_action: "Follow up on intro email", next_action_date: D(-10), stage_changed_at: D(-27) },
  { key: "solent", investor: "solent", stage: "Due Diligence", potential_amount: 3000000, indicative_amount: 2500000, owner: "alex", expected_close: D(70), next_action: "Technical deep dive with CTO", next_action_date: D(8), outstanding_requirements: "Model architecture review; churn cohorts.", stage_changed_at: D(-4) },
  { key: "brookline", investor: "brookline", stage: "Funds Received", potential_amount: 250000, indicative_amount: 250000, owner: "priya", expected_close: D(-20), stage_changed_at: D(-20) },
  { key: "uk-innov", investor: "uk-innov", stage: "Investment Interest", potential_amount: 1500000, indicative_amount: 1000000, owner: "daniel", expected_close: D(110), next_action: "Submit co-investment application", next_action_date: D(12), outstanding_requirements: "Needs a private lead to be confirmed.", stage_changed_at: D(-12) },
  { key: "atlas", investor: "atlas", stage: "Passed", potential_amount: 0, indicative_amount: null, owner: "alex", stage_changed_at: D(-44), outstanding_requirements: "Passed: too early for their ARR threshold." },
];

const commitments: Seed[] = [
  { key: "cm1", investor: "climate-angels", opp: "climate-angels", commitment_type: "soft", amount: 500000, committed_on: D(-9), document_ref: "Email from syndicate lead, 9 days ago", verified: true, reference: "Climate Angels — soft commitment" },
  { key: "cm2", investor: "brookline", opp: "brookline", commitment_type: "legal", amount: 250000, committed_on: D(-28), document_ref: "Signed advance subscription agreement", verified: true, reference: "Brookline Angels — ASA" },
];
const receipts: Seed[] = [
  { key: "rc1", investor: "brookline", commitment: "cm2", amount: 250000, received_on: D(-20), verified: true, reference: "Brookline Angels — ASA funds" },
];

const dd: Seed[] = [
  { key: "dd1", investor: "northbridge", category: "financial", request: "Customer churn cohort analysis (2023–2026)", owner: "daniel", deadline: D(-1), status: "in_progress", priority: "high", approval_status: "pending", outstanding_questions: "Gross vs logo churn split by segment." },
  { key: "dd2", investor: "solent", category: "financial", request: "Cohort retention and churn by customer segment", owner: "daniel", deadline: D(6), status: "open", priority: "high", approval_status: "pending" },
  { key: "dd3", investor: "greenfield", category: "financial", request: "Churn and expansion by cohort", owner: "daniel", deadline: D(-3), status: "open", priority: "medium", approval_status: "pending" },
  { key: "dd4", investor: "northbridge", category: "technical", request: "Architecture overview and model validation results", owner: "tom", deadline: D(5), status: "in_progress", priority: "high", approval_status: "pending" },
  { key: "dd5", investor: "northbridge", category: "legal", request: "Material contracts and IP assignments", owner: "daniel", deadline: D(10), status: "open", priority: "medium", approval_status: "pending", related_files: "Data room folder 4" },
  { key: "dd6", investor: "greenfield", category: "esg", request: "Impact KPI methodology and carbon savings validation", owner: "priya", deadline: D(-5), status: "blocked", priority: "high", approval_status: "not_required", outstanding_questions: "Which baseline year do we use for savings claims?" },
  { key: "dd7", investor: "solent", category: "technical", request: "Security posture and ISO 27001 roadmap", owner: "tom", deadline: D(8), status: "open", priority: "medium", approval_status: "not_required" },
  { key: "dd8", investor: "aster", category: "commercial", request: "Pipeline detail with stage history", owner: "sophie", deadline: D(2), status: "in_progress", priority: "high", approval_status: "pending" },
  { key: "dd9", investor: "northbridge", category: "commercial", request: "Two customer reference contacts", owner: "alex", deadline: D(3), status: "open", priority: "high", approval_status: "not_required" },
  { key: "dd10", investor: "aster", category: "financial", request: "Financial model v3 and assumptions book", owner: "daniel", deadline: D(-6), status: "submitted", priority: "high", approval_status: "approved" },
  { key: "dd11", investor: "solent", category: "team", request: "Org chart and hiring plan", owner: "priya", deadline: D(4), status: "accepted", priority: "low", approval_status: "approved" },
];

const interactions: Seed[] = [
  { key: "ii1", investor: "northbridge", interaction_type: "meeting", occurred_on: D(-2), owner: "alex", summary: "DD kick-off with Olivia and James; reference calls requested" },
  { key: "ii2", investor: "northbridge", interaction_type: "meeting", occurred_on: D(-14), owner: "alex", summary: "Partner meeting; moved to diligence" },
  { key: "ii3", investor: "aster", interaction_type: "call", occurred_on: D(-6), owner: "alex", summary: "Principal call; partner meeting being scheduled" },
  { key: "ii4", investor: "greenfield", interaction_type: "data_room", occurred_on: D(-15), owner: "daniel", summary: "Data room access granted" },
  { key: "ii5", investor: "climate-angels", interaction_type: "email", occurred_on: D(-9), owner: "priya", summary: "Syndicate confirmed £500k soft commitment subject to lead" },
  { key: "ii6", investor: "helix-cvc", interaction_type: "meeting", occurred_on: D(-19), owner: "sophie", summary: "Intro via Gridwise; interest in strategic angle" },
  { key: "ii7", investor: "pinecrest", interaction_type: "meeting", occurred_on: D(-38), owner: "priya", summary: "First meeting; asked for property-portfolio case studies" },
  { key: "ii8", investor: "solent", interaction_type: "meeting", occurred_on: D(-4), owner: "alex", summary: "Moved to diligence after second meeting" },
  { key: "ii9", investor: "elm", interaction_type: "email", occurred_on: D(-27), owner: "alex", summary: "Intro email sent; no reply" },
  { key: "ii10", investor: "uk-innov", interaction_type: "call", occurred_on: D(-12), owner: "daniel", summary: "Eligibility confirmed; needs private lead" },
  { key: "ii11", investor: "brookline", interaction_type: "update_sent", occurred_on: D(-20), owner: "priya", summary: "Monthly investor update (October)" },
];

const snapshots: Seed[] = [
  { key: "m6", period: D(-163), cash_balance: 5240000, monthly_burn: 372000, revenue: 228000, arr: 2730000, headcount: 33, verified: true, source: "Month-end close" },
  { key: "m5", period: D(-133), cash_balance: 4860000, monthly_burn: 381000, revenue: 236000, arr: 2810000, headcount: 34, verified: true, source: "Month-end close" },
  { key: "m4", period: D(-102), cash_balance: 4470000, monthly_burn: 389000, revenue: 241000, arr: 2890000, headcount: 35, verified: true, source: "Month-end close" },
  { key: "m3", period: D(-72), cash_balance: 4070000, monthly_burn: 398000, revenue: 249000, arr: 2960000, headcount: 36, verified: true, source: "Month-end close" },
  { key: "m2", period: D(-41), cash_balance: 3660000, monthly_burn: 407000, revenue: 255000, arr: 3040000, headcount: 37, verified: true, source: "Month-end close" },
  { key: "m1", period: D(-12), cash_balance: 3500000, monthly_burn: 412000, revenue: 262000, arr: 3120000, headcount: 38, verified: true, source: "Month-end close (includes £250k ASA receipt)" },
];

/* ---------- Meetings and decisions ---------- */
const M = (k: string) => id("meetings", k);
const meetings: Seed[] = [
  {
    key: "exec-weekly", title: "Executive team weekly", meeting_type: "executive", held_at: T(-1, "09:00"), owner: "priya",
    attendees: "Alex Morgan, Priya Shah, Daniel Okafor, Sophie Laurent, Tom Reid",
    summary: null,
    notes: `Exec weekly — notes (Priya)

1. Platform 3.0
Tom: latest validation run is 79% accuracy, below the 85% gate. Retraining with October telemetry from the Halcyon sites; expects results by Friday. If still below, proposes narrowing beta to chillers and AHUs only. Alex agreed that narrowing is acceptable if it protects the beta date. Tom to bring a go/no-go recommendation to next week's meeting.

2. Fundraising
Daniel: Northbridge and Solent both in DD. Three investors have now asked for churn cohort analysis — Daniel will produce one standard pack for all of them by Wednesday instead of three versions. Aster partner meeting tomorrow; Alex leading. Greenfield impact questionnaire is late — Priya to get the baseline-year question answered by Tom and Daniel and send it by Monday.

3. Commercial
Sophie: Halcyon want 15% discount and 60-day terms. Decision: we will offer a phased rollout at 8% discount, standard 30-day terms. Sophie to send proposal v2 tomorrow. Unity Campus has gone quiet — Sam to call Femi this week; if no response, move to Lost at month end.

4. Pricing
Pricing proposal for the predictive tier is overdue. Marcus out sick this week. Sophie to pick up and circulate options by Thursday so the board pack can include it.

5. Risks
Alex raised that Tom is carrying too much (Platform 3.0, ISO, Vantage connector). Agreed to discuss moving ISO ownership to Daniel's team next week.

Open question: do we tell investors about the accuracy miss now or after the retrain? Not decided.`,
  },
  {
    key: "board-oct", title: "Board meeting (October)", meeting_type: "board", held_at: T(-30, "14:00"), owner: "priya",
    attendees: "Alex Morgan, Daniel Okafor, Ruth Adeyemi, Olivia Grant (observer), independent chair",
    summary: "Board approved the Series A process and the £8m target. Asked for monthly runway reporting and a bridge plan if the lead is not secured by mid-December.",
    notes: "Board pack v1. Approved Series A process. Request: runway each month; bridge plan by December.",
  },
  {
    key: "halcyon-neg", title: "Halcyon Estates commercial negotiation", meeting_type: "commercial", held_at: T(-3, "11:00"), owner: "sophie", opportunity: "halcyon",
    attendees: "Sophie Laurent, Imogen Price, Rob Achebe",
    summary: "Procurement asked for 15% discount and 60-day terms. Sustainability team wants rollout before April reporting deadline.",
  },
  {
    key: "northbridge-dd", title: "Northbridge diligence kick-off", meeting_type: "investor", held_at: T(-2, "15:00"), owner: "alex", investor: "northbridge",
    attendees: "Alex Morgan, Daniel Okafor, Olivia Grant, James Kerr",
    summary: "Northbridge started diligence. Requested two customer references, churn cohorts and a technical session with Tom.",
  },
  { key: "aster-partner", title: "Aster Capital partner meeting", meeting_type: "investor", held_at: T(1, "14:00"), owner: "alex", investor: "aster", attendees: "Alex Morgan, Daniel Okafor, Aster partnership" },
  { key: "exec-next", title: "Executive team weekly", meeting_type: "executive", held_at: T(6, "09:00"), owner: "priya", attendees: "Executive team" },
  { key: "board-dec", title: "Board meeting (December)", meeting_type: "board", held_at: T(26, "14:00"), owner: "priya", attendees: "Board, CEO, CFO" },
];

const decisions: Seed[] = [
  { key: "dec1", title: "Run a Series A process targeting £8m at £32m pre-money", owner: "alex", status: "approved", decided_on: D(-30), meeting: "board-oct", objective: "raise", rationale: "Runway under 12 months; Platform 3.0 needs funding; market feedback supports valuation range.", impact: "Fundraising becomes the CEO's primary focus for Q4." },
  { key: "dec2", title: "Approve price point for the predictive maintenance tier", owner: "sophie", status: "awaiting_approval", due_date: D(-1), project: "pricing", objective: "platform", rationale: "Needed for GA launch, Oakfield add-on and board pack.", impact: "Blocks Platform 3.0 GA and two commercial proposals." },
  { key: "dec3", title: "Offer Halcyon a phased rollout at 8% discount on 30-day terms", owner: "sophie", status: "approved", decided_on: D(-1), meeting: "exec-weekly", objective: "q-enterprise", rationale: "Protects margin and cash collection while meeting their April deadline." },
  { key: "dec4", title: "Extend onboarding redesign by four weeks or descope the Vantage connector", owner: "grace", status: "awaiting_approval", due_date: D(3), project: "onboarding", rationale: "Vantage API access still outstanding; project already past target date." },
  { key: "dec5", title: "Move ISO 27001 ownership from CTO to Finance & Operations", owner: "alex", status: "proposed", due_date: D(7), project: "iso", rationale: "Reduce key-person dependency on the CTO." },
  { key: "dec6", title: "Produce one standard churn cohort pack for all investors", owner: "daniel", status: "approved", decided_on: D(-1), meeting: "exec-weekly", objective: "raise", rationale: "Three investors asked for the same analysis." },
];

const reports: Seed[] = [
  {
    key: "ceo-w44", title: "Weekly CEO update (last week)", report_type: "weekly_ceo_update", period: "Last week", status: "approved", ai_generated: false,
    body: "## Headlines\n- Brightwater expansion moved to contracting.\n- Northbridge moved into diligence.\n- Platform 3.0 accuracy behind plan (79% vs 85% gate).\n\n## Focus next week\n- Aster partner meeting.\n- Halcyon proposal v2.\n- Pricing decision for the predictive tier.",
  },
];

const documents: Seed[] = [
  { key: "doc1", title: "Series A investor deck v4", category: "investor", url: "https://example.com/deck-v4", owner: "alex" },
  { key: "doc2", title: "Financial model v3 (three statement)", category: "financial", url: "https://example.com/model-v3", owner: "daniel" },
  { key: "doc3", title: "Platform 3.0 pilot results (interim)", category: "product", url: "https://example.com/pilot-interim", owner: "tom", project: "p3" },
  { key: "doc4", title: "Halcyon proposal v1", category: "commercial", url: "https://example.com/halcyon-v1", owner: "sophie", opportunity: "halcyon" },
];

/* ---------- Build ---------- */
const ref = (table: string, key: string | null | undefined) => (key ? id(table, key) : null);

function base(table: string, key: string, createdOffset = -30) {
  return { id: id(table, key), organisation_id: ORG_ID, created_at: T(createdOffset, "09:00"), updated_at: T(createdOffset, "09:00") };
}

/** Builds the full dataset with date tokens unresolved. */
export function buildSeed(): Record<TableName, Record<string, unknown>[]> {
  return {
    organisations: [{ id: ORG_ID, organisation_id: ORG_ID, created_at: T(-200), updated_at: T(-200), name: "Fernhill Systems Ltd", sector: "Energy optimisation software for commercial buildings", currency: "GBP", tagline: "Fictional demo company" }],
    teams: teams.map((t) => ({ ...base("teams", t.key as string, -200), name: t.name, description: t.description, lead_id: U(t.lead as string) })),
    users: people.map((p) => ({ ...base("users", p.key as string, -200), full_name: p.full_name, title: p.title, email: p.email, team_id: ref("teams", p.team as string) })),
    strategic_objectives: objectives.map((o) => ({ ...base("strategic_objectives", o.key as string, -120), title: o.title, level: o.level, period: o.period, parent_id: ref("strategic_objectives", o.parent as string), owner_id: ref("users", o.owner as string), status: o.status, progress: o.progress, measure: o.measure ?? null, due_date: o.due_date, description: o.description ?? null, assumptions: o.assumptions ?? null })),
    kpis: kpis.map((k) => ({ ...base("kpis", k.key as string, -120), name: k.name, objective_id: O(k.objective as string), owner_id: U(k.owner as string), unit: k.unit, baseline: k.baseline, current_value: k.current_value, target_value: k.target_value, direction: k.direction, period: k.period, last_updated: k.last_updated, source: k.source })),
    projects: projects.map((p) => ({ ...base("projects", p.key as string, -120), name: p.name, description: p.description ?? null, objective_id: ref("strategic_objectives", p.objective as string), sponsor_id: U(p.sponsor as string), owner_id: U(p.owner as string), priority: p.priority, status: p.status, rag: p.rag, progress: p.progress, start_date: p.start_date, target_date: p.target_date, budget: p.budget, spent: p.spent, deliverables: p.deliverables ?? null, decisions_required: p.decisions_required ?? null })),
    milestones: milestones.map((m) => ({ ...base("milestones", m.key as string, -90), title: m.title, project_id: P(m.project as string), owner_id: U(m.owner as string), due_date: m.due_date, status: m.status, completed_on: m.completed_on ?? null, evidence: m.evidence ?? null })),
    tasks: tasks.map((t) => ({ ...base("tasks", t.key as string, -20), title: t.title, description: t.description ?? null, project_id: ref("projects", t.project as string), milestone_id: ref("milestones", t.milestone as string), owner_id: U(t.owner as string), due_date: t.due_date, status: t.status, priority: t.priority, escalated: Boolean(t.escalated), evidence: t.evidence ?? null, meeting_id: null, opportunity_id: ref("commercial_opportunities", t.opportunity as string), investor_id: ref("investors", t.investor as string) })),
    dependencies: dependencies.map((d) => ({ ...base("dependencies", d.key as string, -30), description: d.description, project_id: P(d.project as string), depends_on_project_id: P(d.depends_on as string), needed_by: d.needed_by, status: d.status })),
    risks: risks.map((r) => ({ ...base("risks", r.key as string, -40), title: r.title, description: r.description ?? null, category: r.category, likelihood: r.likelihood, impact: r.impact, owner_id: U(r.owner as string), status: r.status, mitigation: r.mitigation ?? null, review_date: r.review_date, project_id: ref("projects", r.project as string), objective_id: ref("strategic_objectives", r.objective as string), opportunity_id: ref("commercial_opportunities", r.opportunity as string) })),
    decisions: decisions.map((d) => ({ ...base("decisions", d.key as string, -10), title: d.title, rationale: d.rationale ?? null, owner_id: U(d.owner as string), status: d.status, decided_on: d.decided_on ?? null, due_date: d.due_date ?? null, impact: d.impact ?? null, objective_id: ref("strategic_objectives", d.objective as string), project_id: ref("projects", d.project as string), meeting_id: ref("meetings", d.meeting as string) })),
    meetings: meetings.map((m) => ({ ...base("meetings", m.key as string, -5), title: m.title, meeting_type: m.meeting_type, held_at: m.held_at, attendees: m.attendees, owner_id: U(m.owner as string), summary: m.summary ?? null, notes: m.notes ?? null, project_id: null, opportunity_id: ref("commercial_opportunities", m.opportunity as string), investor_id: ref("investors", m.investor as string) })),
    meeting_actions: [],
    commercial_accounts: accounts.map((a) => ({ ...base("commercial_accounts", a.key as string, -150), name: a.name, account_type: a.account_type, sector: a.sector, region: a.region, website: a.website ?? null, owner_id: U(a.owner as string), notes: a.notes ?? null })),
    commercial_contacts: contacts.map((c) => ({ ...base("commercial_contacts", c.key as string, -100), full_name: c.full_name, account_id: A(c.account as string), title: c.title, email: c.email, phone: null, notes: null })),
    commercial_opportunities: opportunities.map((o) => ({ ...base("commercial_opportunities", o.key as string, -60), name: o.name, account_id: A(o.account as string), owner_id: U(o.owner as string), stage: o.stage, value: o.value, probability: o.probability, expected_close: o.expected_close, is_partnership: Boolean(o.is_partnership), next_action: o.next_action ?? null, next_action_date: o.next_action_date ?? null, last_activity_date: o.last_activity_date ?? null, stage_changed_at: o.stage_changed_at ?? null, objective_id: ref("strategic_objectives", o.objective as string), risk_notes: o.risk_notes ?? null, lost_reason: o.lost_reason ?? null })),
    commercial_activities: activities.map((a) => ({ ...base("commercial_activities", a.key as string, -10), summary: a.summary, activity_type: a.activity_type, occurred_on: a.occurred_on, opportunity_id: OPP(a.opp as string), account_id: A(a.account as string), owner_id: U(a.owner as string) })),
    investors: investors.map((i) => ({ ...base("investors", i.key as string, -90), name: i.name, category: i.category, investment_focus: i.investment_focus, sectors: i.sectors, geographies: i.geographies, cheque_min: i.cheque_min, cheque_max: i.cheque_max, relationship_owner_id: ref("users", i.owner as string), introduction_source: i.introduction_source ?? null, relationship_strength: i.relationship_strength, last_contact_date: i.last_contact_date ?? null, next_follow_up: i.next_follow_up ?? null, portfolio_companies: i.portfolio_companies ?? null, notes: i.notes ?? null })),
    investor_contacts: investorContacts.map((c) => ({ ...base("investor_contacts", c.key as string, -80), full_name: c.full_name, investor_id: I(c.investor as string), title: c.title, email: c.email, notes: null })),
    fundraising_rounds: rounds.map((r) => ({ ...base("fundraising_rounds", r.key as string, -80), name: r.name, target_amount: r.target_amount, pre_money: r.pre_money, status: r.status, open_date: r.open_date, target_close_date: r.target_close_date, notes: r.notes })),
    fundraising_opportunities: fundOpps.map((f) => ({ ...base("fundraising_opportunities", f.key as string, -70), name: investors.find((i) => i.key === f.investor)?.name, investor_id: I(f.investor as string), round_id: R, stage: f.stage, potential_amount: f.potential_amount, indicative_amount: f.indicative_amount ?? null, owner_id: ref("users", f.owner as string), expected_close: f.expected_close ?? null, next_action: f.next_action ?? null, next_action_date: f.next_action_date ?? null, outstanding_requirements: f.outstanding_requirements ?? null, stage_changed_at: f.stage_changed_at ?? null })),
    investor_commitments: commitments.map((c) => ({ ...base("investor_commitments", c.key as string, -9), reference: c.reference, investor_id: I(c.investor as string), round_id: R, opportunity_id: FO(c.opp as string), commitment_type: c.commitment_type, amount: c.amount, committed_on: c.committed_on, document_ref: c.document_ref, verified: c.verified })),
    capital_receipts: receipts.map((r) => ({ ...base("capital_receipts", r.key as string, -20), reference: r.reference, investor_id: I(r.investor as string), round_id: R, commitment_id: id("investor_commitments", r.commitment as string), amount: r.amount, received_on: r.received_on, verified: r.verified })),
    due_diligence_requests: dd.map((d) => ({ ...base("due_diligence_requests", d.key as string, -14), request: d.request, investor_id: I(d.investor as string), round_id: R, category: d.category, owner_id: U(d.owner as string), deadline: d.deadline, status: d.status, priority: d.priority, approval_status: d.approval_status, related_files: d.related_files ?? null, outstanding_questions: d.outstanding_questions ?? null })),
    investor_interactions: interactions.map((x) => ({ ...base("investor_interactions", x.key as string, -10), summary: x.summary, investor_id: I(x.investor as string), interaction_type: x.interaction_type, occurred_on: x.occurred_on, owner_id: U(x.owner as string) })),
    financial_snapshots: snapshots.map((s) => ({ ...base("financial_snapshots", s.key as string, -12), period: s.period, cash_balance: s.cash_balance, monthly_burn: s.monthly_burn, revenue: s.revenue, arr: s.arr, headcount: s.headcount, source: s.source, verified: s.verified })),
    reports: reports.map((r) => ({ ...base("reports", r.key as string, -7), title: r.title, report_type: r.report_type, period: r.period, status: r.status, ai_generated: r.ai_generated, body: r.body, sources: [], approved_by: "Alex Morgan", approved_at: T(-6) })),
    documents: documents.map((d) => ({ ...base("documents", d.key as string, -20), title: d.title, category: d.category, url: d.url, owner_id: U(d.owner as string), project_id: ref("projects", d.project as string), investor_id: null, opportunity_id: ref("commercial_opportunities", d.opportunity as string), notes: null })),
    ai_recommendations: [],
    audit_logs: [],
  };
}

/** Memberships for demo sign-in (person id doubles as the auth id in demo mode). */
export function demoMemberships() {
  return DEMO_PERSONAS.map((p) => ({ auth_user_id: U(p.personKey), person_id: U(p.personKey), organisation_id: ORG_ID, role: p.role }));
}

export const personId = U;

/** Replaces date tokens with real ISO dates relative to `today`. */
export function resolveTokens<T>(value: T, today = new Date()): T {
  const json = JSON.stringify(value).replace(/@@([DT]):(-?\d+)(?::(\d\d:\d\d))?@@/g, (_m, kind: string, n: string, hm?: string) => {
    const d = new Date(today);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + Number(n));
    const z = (x: number) => String(x).padStart(2, "0");
    const date = `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
    return kind === "D" ? date : `${date}T${hm ?? "09:00"}:00.000Z`;
  });
  return JSON.parse(json) as T;
}
