import Link from "next/link";
import { loadPage } from "@/lib/page";
import { isClaudeConfigured } from "@/lib/env";
import { cn, formatDateTime } from "@/lib/utils";
import { PageHeader, SectionTitle } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ViewTabs } from "@/components/ui/view-tabs";
import { EntityTable } from "@/components/app/entity-table";
import { StatusBadge } from "@/components/app/status";
import { DataTag } from "@/components/app/provenance";
import { AiActionButton } from "@/components/ai/ai-action-button";
import { ProposalQueue } from "@/components/ai/proposal-queue";
import { NewMeetingButton } from "@/components/meetings/new-meeting";

export const metadata = { title: "Meetings & Decisions" };

export default async function MeetingsPage() {
  const { data, lookups, write } = await loadPage(["meetings", "decisions", "meeting_actions", "ai_recommendations", "users", "projects", "tasks", "strategic_objectives", "commercial_opportunities", "investors"] as const);
  const now = new Date().toISOString();
  const past = data.meetings.filter((m) => m.held_at <= now);
  const upcoming = data.meetings.filter((m) => m.held_at > now).sort((a, b) => String(a.held_at).localeCompare(String(b.held_at)));
  const pending = data.ai_recommendations.filter((r) => r.status === "pending" && r.meeting_id);
  const pendingBy = (id: string) => pending.filter((p) => p.meeting_id === id).length;
  const ai = isClaudeConfigured() && write("ai_recommendations");
  const awaiting = data.decisions.filter((d) => d.status === "awaiting_approval" || d.status === "proposed");

  const meetingList = (rows: typeof past, emptyText: string) => (
    <ul className="divide-y divide-border rounded-lg border border-border bg-surface shadow-subtle">
      {rows.map((m) => {
        const extracted = data.ai_recommendations.some((r) => r.meeting_id === m.id);
        return (
          <li key={m.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/records/meetings/${m.id}`} className="text-[13px] font-medium hover:underline underline-offset-2">{m.title}</Link>
                <StatusBadge value={m.meeting_type} />
                {pendingBy(m.id) > 0 && <Badge variant="ai">{pendingBy(m.id)} to review</Badge>}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">{formatDateTime(m.held_at)}{m.attendees ? ` · ${m.attendees}` : ""}</div>
              {m.summary ? <p className="mt-1.5 line-clamp-2 max-w-3xl text-xs">{m.summary}</p> : m.notes ? <p className="mt-1.5 text-xs text-muted-foreground">Notes recorded ({String(m.notes).length.toLocaleString("en-GB")} characters), no summary yet.</p> : <p className="mt-1.5 text-xs text-muted-foreground">No notes yet.</p>}
            </div>
            {ai && m.notes && (
              <div className="shrink-0">
                <AiActionButton endpoint="/api/meetings/extract" body={{ meeting_id: m.id }} size="sm" label={extracted ? "Extract again" : "Extract with AI"} busyLabel="Reading notes…" />
              </div>
            )}
          </li>
        );
      })}
      {!rows.length && <li className="px-4 py-8 text-center text-[13px] text-muted-foreground">{emptyText}</li>}
    </ul>
  );

  return (
    <div>
      <PageHeader
        number="07"
        title="Meetings & Decisions"
        description="Turn meeting notes into decisions, actions and risks. The AI proposes; a person approves before anything changes."
        actions={write("meetings") ? <NewMeetingButton /> : undefined}
      />

      {pending.length > 0 && (
        <section className="mb-8">
          <SectionTitle title="Extracted from meetings, awaiting approval" description="Check owners and dates, then approve to create the actions, decisions and risks." actions={<DataTag kind="ai" />} />
          <ProposalQueue proposals={pending} lookups={lookups} canDecide={write("tasks")} />
        </section>
      )}

      <ViewTabs
        panels={[
          { id: "meetings", label: `Meetings (${past.length})`, content: meetingList(past, "No meetings recorded yet. Add notes from your last meeting to start.") },
          { id: "upcoming", label: `Upcoming (${upcoming.length})`, content: meetingList(upcoming, "No meetings scheduled.") },
          {
            id: "decisions", label: `Decision register (${data.decisions.length})`,
            content: (
              <div className="flex flex-col gap-3">
                {awaiting.length > 0 && <p className={cn("text-xs text-rag-amber")}>{awaiting.length} decisions are waiting for approval.</p>}
                <EntityTable table="decisions" rows={data.decisions} lookups={lookups} canWrite={write("decisions")} columns={["title", "status", "owner_id", "decided_on", "due_date", "meeting_id"]} filters={["status"]} />
              </div>
            ),
          },
          { id: "actions", label: "Meeting actions", content: <EntityTable table="meeting_actions" rows={data.meeting_actions} lookups={lookups} canWrite={write("meeting_actions")} emptyText="Actions extracted from meetings appear here." /> },
          { id: "all", label: "All meetings", content: <EntityTable table="meetings" rows={data.meetings} lookups={lookups} canWrite={write("meetings")} /> },
        ]}
      />
      <Card className="mt-8 px-4 py-3 text-xs text-muted-foreground">
        Extraction reads the notes you saved and proposes a summary, actions with owners and due dates, decisions and risks. Each proposal shows the meeting it came from. Approving creates the record and logs who approved it.
      </Card>
    </div>
  );
}
