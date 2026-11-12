import type { Row } from "@/lib/types";

/** The round currently being raised: open or closing, otherwise the first recorded. */
export function currentRound(rounds: Row[]) {
  return rounds.find((r) => r.status === "open" || r.status === "closing") ?? rounds[0];
}
