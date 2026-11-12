import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { canWrite } from "@/lib/auth/permissions";
import { generateReport } from "@/lib/ai/reports";
import { describeAiError } from "@/lib/ai/client";
import { REPORT_TYPE } from "@/lib/schema";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Sign in first." }, { status: 401 });
  if (!canWrite("reports", session.role)) return Response.json({ error: "Your role is read-only." }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const type = REPORT_TYPE.find((t) => t === body.report_type);
  if (!type) return Response.json({ error: "Choose a report type." }, { status: 400 });
  try {
    const row = await generateReport(session, type, String(body.period ?? "").slice(0, 100), String(body.instructions ?? "").slice(0, 2000));
    revalidatePath("/", "layout");
    return Response.json({ id: row.id });
  } catch (e) {
    const { status, message } = describeAiError(e);
    return Response.json({ error: message }, { status });
  }
}
