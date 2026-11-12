import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { canWrite } from "@/lib/auth/permissions";
import { generateBriefing } from "@/lib/ai/briefing";
import { describeAiError } from "@/lib/ai/client";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Sign in first." }, { status: 401 });
  if (!canWrite("reports", session.role)) return Response.json({ error: "Your role is read-only." }, { status: 403 });
  try {
    const row = await generateBriefing(session);
    revalidatePath("/", "layout");
    return Response.json({ id: row.id });
  } catch (e) {
    const { status, message } = describeAiError(e);
    return Response.json({ error: message }, { status });
  }
}
