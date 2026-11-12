import { loadPage } from "@/lib/page";
import { claudeModel, isClaudeConfigured, isSupabaseConfigured } from "@/lib/env";
import { INTEGRATIONS } from "@/lib/integrations";
import { ROLES, ROLE_LABEL, canRead, canWrite, isAdmin } from "@/lib/auth/permissions";
import { ENTITIES, humanize, type AccessGroup } from "@/lib/schema";
import { resetDemo } from "@/lib/actions/auth";
import { PageHeader, SectionTitle } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EntityTable } from "@/components/app/entity-table";
import { ViewTabs } from "@/components/ui/view-tabs";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";

export const metadata = { title: "Settings & Integrations" };

const GROUP_EXAMPLE: Record<AccessGroup, string> = {
  core: "Strategy, projects, actions, risks, decisions, meetings, pipeline, reports",
  investor: "Investors, fundraising pipeline, diligence, interactions",
  financial: "Commitments, capital received, financial snapshots",
  admin: "Workspace settings, audit log",
};

export default async function SettingsPage() {
  const { session, data, lookups, write } = await loadPage(["organisations", "users", "teams", "documents", "audit_logs"] as const);
  const org = data.organisations[0];
  const admin = isAdmin(session.role);

  return (
    <div>
      <PageHeader number="10" title="Settings & Integrations" description="Workspace, people, permissions, connections and the audit trail." />
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <div className="eyebrow">Workspace</div>
          <div className="mt-1 text-[13px] font-medium">{org?.name ?? session.orgName}</div>
          <div className="text-xs text-muted-foreground">{org?.sector}</div>
        </Card>
        <Card className="p-4">
          <div className="eyebrow">Data</div>
          <div className="mt-1 flex items-center gap-2 text-[13px] font-medium">{isSupabaseConfigured() ? "Supabase (PostgreSQL)" : "Local demo store"} <Badge variant={isSupabaseConfigured() ? "green" : "stone"}>{isSupabaseConfigured() ? "Production" : "Demo"}</Badge></div>
          <div className="text-xs text-muted-foreground">{isSupabaseConfigured() ? "Row-level security enforces roles in the database." : "Saved to .data/cos-os.json. Configure Supabase for multi-user use."}</div>
        </Card>
        <Card className="p-4">
          <div className="eyebrow">Claude</div>
          <div className="mt-1 flex items-center gap-2 text-[13px] font-medium">{isClaudeConfigured() ? "Configured" : "Not configured"} <Badge variant={isClaudeConfigured() ? "green" : "amber"}>{isClaudeConfigured() ? "On" : "Off"}</Badge></div>
          <div className="font-mono text-2xs text-muted-foreground">{isClaudeConfigured() ? claudeModel() : "Set ANTHROPIC_API_KEY"}</div>
        </Card>
      </div>

      <ViewTabs
        panels={[
          {
            id: "integrations", label: "Integrations",
            content: (
              <div>
                <p className="mb-4 max-w-3xl text-xs text-muted-foreground">No external integrations are connected yet. Each connector below has a defined mapping onto CoS OS records, and would write through the same permissions, validation and audit log, with imported changes arriving as proposals for approval. They are listed so it is clear what exists and what does not.</p>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {INTEGRATIONS.map((i) => (
                    <Card key={i.id} className="flex flex-col gap-2 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div><div className="text-[13px] font-medium">{i.name}</div><div className="text-2xs text-muted-foreground">{humanize(i.category)} · {i.direction === "read" ? "read only" : "read and write"}</div></div>
                        <Badge variant="muted">Not connected</Badge>
                      </div>
                      <ul className="text-xs text-muted-foreground">{i.maps.map((m) => <li key={m.from}>{m.from} → {ENTITIES[m.to].plural.toLowerCase()}</li>)}</ul>
                      <div className="text-2xs text-muted-foreground">Status: planned. Not implemented in this build.</div>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          },
          {
            id: "permissions", label: "Roles & permissions",
            content: (
              <div className="flex flex-col gap-4">
                <p className="max-w-3xl text-xs text-muted-foreground">You are signed in as <strong>{session.name}</strong> with the <strong>{ROLE_LABEL[session.role]}</strong> role. The same rules are enforced in the app and, in production, by Postgres row-level security.</p>
                <Card>
                  <Table>
                    <THead><tr><TH>Record group</TH>{ROLES.map((r) => <TH key={r}>{ROLE_LABEL[r]}</TH>)}</tr></THead>
                    <TBody>
                      {(["core", "investor", "financial", "admin"] as AccessGroup[]).map((g) => {
                        const sample = Object.values(ENTITIES).find((e) => e.group === g)!.table;
                        return (
                          <TR key={g}>
                            <TD><div className="font-medium">{humanize(g)}</div><div className="text-2xs text-muted-foreground">{GROUP_EXAMPLE[g]}</div></TD>
                            {ROLES.map((r) => <TD key={r} className="text-xs">{canWrite(sample, r) ? "Read and write" : canRead(sample, r) ? "Read" : <span className="text-muted-foreground">No access</span>}</TD>)}
                          </TR>
                        );
                      })}
                    </TBody>
                  </Table>
                </Card>
                <p className="text-xs text-muted-foreground">AI proposals are applied with the approving person&apos;s permissions. The AI can never change financial records, commitments or receipts.</p>
              </div>
            ),
          },
          { id: "people", label: "People", content: <EntityTable table="users" rows={data.users} lookups={lookups} canWrite={write("users")} /> },
          { id: "teams", label: "Teams", content: <EntityTable table="teams" rows={data.teams} lookups={lookups} canWrite={write("teams")} /> },
          { id: "documents", label: "Documents", content: <EntityTable table="documents" rows={data.documents} lookups={lookups} canWrite={write("documents")} emptyText="Link documents held in your storage." /> },
          ...(admin ? [{ id: "audit", label: "Audit log", content: <EntityTable table="audit_logs" rows={data.audit_logs} lookups={lookups} canWrite={false} emptyText="Changes appear here as people and approved AI proposals make them." /> }] : []),
        ]}
      />

      {session.mode === "demo" && admin && (
        <section className="mt-10">
          <SectionTitle title="Demo data" />
          <Card>
            <CardHeader><CardTitle>Reset the demo workspace</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>Restores the fictional Fernhill Systems dataset, with dates relative to today. Your changes are discarded.</span>
              <form action={resetDemo}><Button variant="secondary" type="submit">Reset demo data</Button></form>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
