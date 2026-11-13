import "server-only";
import { getStore } from "../data";
import type { Session } from "../types";
import { todayISO } from "../utils";

import { AiLimitError } from "./client";

export const dailyLimit = () => Math.max(1, Number(process.env.AI_DAILY_LIMIT) || 60);

/**
 * Counts one AI request against the person's daily allowance and refuses once
 * it is used up. Protects the API bill if a login is shared or a page loops.
 */
export async function consumeAiAllowance(session: Session, endpoint: string) {
  const store = await getStore(session);
  const day = todayISO();
  const rows = await store.list("ai_usage", { where: { day, actor_id: session.authUserId } });
  const used = rows.reduce((n, r) => n + (Number(r.count) || 0), 0);
  if (used >= dailyLimit()) throw new AiLimitError(`You've reached today's AI limit (${dailyLimit()} requests). It resets at midnight; an admin can raise AI_DAILY_LIMIT.`);
  const mine = rows.find((r) => r.endpoint === endpoint);
  if (mine) await store.update("ai_usage", mine.id, { count: (Number(mine.count) || 0) + 1 });
  else await store.insert("ai_usage", { day, actor_id: session.authUserId, endpoint, count: 1 });
  return { used: used + 1, limit: dailyLimit() };
}
