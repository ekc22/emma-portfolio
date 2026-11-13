import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { extractMeeting } from "@/lib/ai/meetings";
import { describeAiError } from "@/lib/ai/client";
import { consumeAiAllowance } from "@/lib/ai/limits";
import { isClaudeConfigured } from "@/lib/env";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Sign in first." }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (typeof body.meeting_id !== "string") return Response.json({ error: "meeting_id is required." }, { status: 400 });
  try {
    if (isClaudeConfigured()) await consumeAiAllowance(session, "meeting_extraction");
    const result = await extractMeeting(session, body.meeting_id);
    revalidatePath("/", "layout");
    return Response.json(result);
  } catch (e) {
    const { status, message } = describeAiError(e);
    return Response.json({ error: message }, { status });
  }
}
