import { getSession } from "@/lib/auth/session";
import { getStore } from "@/lib/data";
import { canRead } from "@/lib/auth/permissions";

/** Downloads a report as Markdown, with its approval status and AI origin stated at the top. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !canRead("reports", session.role)) return new Response("Not found", { status: 404 });
  const { id } = await params;
  const store = await getStore(session);
  const r = await store.get("reports", id);
  if (!r) return new Response("Not found", { status: 404 });
  const origin = req_origin();
  const status = r.status === "approved" ? `Approved by ${r.approved_by ?? "unknown"} on ${String(r.approved_at ?? "").slice(0, 10)}` : `Status: ${r.status} (not approved)`;
  const body = String(r.body ?? "").replace(/\]\(\/records\//g, `](${origin}/records/`);
  const md = `# ${r.title}\n\n_${status}${r.ai_generated ? " · Drafted by AI from workspace records" : ""}_\n\n${body}\n`;
  const filename = String(r.title).replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "report";
  return new Response(md, { headers: { "content-type": "text/markdown; charset=utf-8", "content-disposition": `attachment; filename="${filename}.md"` } });
}

function req_origin() {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";
}
