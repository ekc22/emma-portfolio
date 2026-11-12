import { loadPage } from "@/lib/page";
import { isClaudeConfigured, claudeModel } from "@/lib/env";
import { PageHeader, SectionTitle } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chat } from "@/components/ai/chat";
import { ProposalQueue } from "@/components/ai/proposal-queue";

export const metadata = { title: "AI Chief of Staff" };

export default async function AgentPage() {
  const { session, data, lookups, write, investors } = await loadPage(["ai_recommendations", "users", "projects", "tasks", "milestones", "decisions", "risks", "meetings", "commercial_opportunities", "strategic_objectives", "investors", "due_diligence_requests", "fundraising_opportunities"] as const);
  const pending = data.ai_recommendations.filter((r) => r.status === "pending");
  return (
    <div>
      <PageHeader number="09" title="AI Chief of Staff" description="Ask anything about the business. Answers are grounded in your records, cite them, and keep facts, assumptions and recommendations apart." />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0">
          <Chat storageKey={`cos-agent-${session.authUserId}`} configured={isClaudeConfigured()} readOnly={!investors} />
        </div>
        <aside className="flex min-w-0 flex-col gap-6">
          <section id="proposals">
            <SectionTitle title={`Awaiting approval (${pending.length})`} description="Changes the AI has proposed. Nothing is applied until you approve." />
            <ProposalQueue proposals={pending} lookups={lookups} canDecide={write("tasks")} empty="No proposals waiting. Ask the agent to log actions or update records and they appear here." />
          </section>
          <Card>
            <CardHeader><CardTitle>What the agent can do</CardTitle></CardHeader>
            <CardContent className="space-y-1.5 text-xs text-muted-foreground">
              <p>Read: strategy, projects, actions, team workload, check-ins, routines, requests, risks, decisions, meetings, the commercial pipeline{investors ? ", investors, fundraising, diligence and capital" : ""}. It sees only what your role can see.</p>
              <p>Calculate: delivery health, pipeline forecasts, fundraising position and runway, with methods shown.</p>
              <p>Propose: new actions, decisions, risks and record updates, for approval.</p>
              <p>Draft: briefings and reports, saved as unapproved drafts.</p>
              <p>It cannot email anyone, change commitments or financial records, or mark work complete without evidence.</p>
              <p className="pt-1 font-mono text-2xs">Model: {claudeModel()}</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
