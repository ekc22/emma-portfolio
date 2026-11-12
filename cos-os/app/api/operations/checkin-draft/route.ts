import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { draftCheckIn } from "@/lib/ai/operations";
import { describeAiError } from "@/lib/ai/client";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Sign in first." }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (typeof body.project_id !== "string") return Response.json({ error: "project_id is required." }, { status: 400 });
  try {
    const out = await draftCheckIn(session, body.project_id);
    revalidatePath("/", "layout");
    return Response.json({ ...out, proposals: 1 });
  } catch (e) {
    const { status, message } = describeAiError(e);
    return Response.json({ error: message }, { status });
  }
}
