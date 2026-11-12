"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Calls an AI endpoint, shows progress and errors, then refreshes or navigates. */
export function AiActionButton({ endpoint, body, label, busyLabel = "Working…", navigateTo, onDone, size = "default", variant = "ai" }: {
  endpoint: string; body?: Record<string, unknown>; label: string; busyLabel?: string; navigateTo?: (json: Record<string, unknown>) => string | null; onDone?: (json: Record<string, unknown>) => void; size?: "default" | "sm"; variant?: "ai" | "default" | "secondary";
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [note, setNote] = React.useState<string | null>(null);
  const run = async () => {
    setBusy(true); setError(null); setNote(null);
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body ?? {}) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "The request failed.");
      onDone?.(json);
      if (typeof json.proposals === "number") setNote(`${json.proposals} proposals ready for review below.`);
      const to = navigateTo?.(json);
      if (to) router.push(to); else router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <span className="inline-flex flex-col items-end gap-1">
      <Button size={size} variant={variant} onClick={run} disabled={busy} aria-busy={busy}><Sparkles /> {busy ? busyLabel : label}</Button>
      {error && <span role="alert" className="max-w-xs text-right text-2xs text-rag-red">{error}</span>}
      {note && <span role="status" className="text-2xs text-sage-deep">{note}</span>}
    </span>
  );
}
