import { Badge } from "@/components/ui/badge";
import { humanize } from "@/lib/schema";

type V = "default" | "muted" | "sage" | "stone" | "navy" | "green" | "amber" | "red" | "ai";

const MAP: Record<string, V> = {
  green: "green", amber: "amber", red: "red",
  on_track: "green", achieved: "sage", at_risk: "amber", off_track: "red", not_started: "muted",
  active: "sage", planning: "stone", on_hold: "amber", completed: "muted", cancelled: "muted",
  complete: "green", in_progress: "sage", missed: "red",
  todo: "muted", blocked: "red", done: "green",
  open: "stone", mitigating: "amber", closed: "muted", resolved: "muted",
  proposed: "stone", awaiting_approval: "amber", approved: "green", rejected: "muted", deferred: "muted",
  critical: "red", high: "amber", medium: "stone", low: "muted",
  submitted: "sage", accepted: "green", pending: "amber", not_required: "muted",
  draft: "stone", in_review: "amber", applied: "green",
  Won: "green", Lost: "muted", Negotiation: "sage", Contracting: "sage", Proposal: "stone",
  "Funds Received": "green", "Legally Committed": "green", "Soft Commitment": "sage", "Due Diligence": "sage", Passed: "muted",
  soft: "stone", legal: "green", strong: "green", warm: "amber", cold: "muted",
  prospect: "stone", customer: "green", partner: "sage", channel: "sage",
};

export function StatusBadge({ value, className }: { value: string | null | undefined; className?: string }) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  return <Badge variant={MAP[value] ?? "default"} className={className}>{humanize(value)}</Badge>;
}

export function RagDot({ rag }: { rag?: string | null }) {
  const c = rag === "red" ? "bg-rag-red" : rag === "amber" ? "bg-rag-amber" : rag === "green" ? "bg-rag-green" : "bg-rag-grey";
  return <span className={`inline-block size-2 rounded-full ${c}`} aria-label={rag ? `RAG ${rag}` : "No RAG"} />;
}
