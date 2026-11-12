"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Label, NativeSelect, Textarea } from "@/components/ui/input";
import { REPORT_TYPE, humanize } from "@/lib/schema";

/**
 * Asks Claude to draft a report from workspace data. The draft is saved as a
 * report with status "draft" and ai_generated = true, then opened for review.
 * API: POST /api/reports/generate { report_type, period, instructions } -> { id } | { error }
 */
export function GenerateReportButton({ defaultType = "weekly_ceo_update", types = REPORT_TYPE, label = "Draft with AI" }: { defaultType?: (typeof REPORT_TYPE)[number]; types?: readonly (typeof REPORT_TYPE)[number][]; label?: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState<string>(defaultType);
  const [period, setPeriod] = React.useState("");
  const [instructions, setInstructions] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const go = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/reports/generate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ report_type: type, period, instructions }) });
      const json = await res.json();
      if (!res.ok || !json.id) throw new Error(json.error || "The draft could not be created.");
      setOpen(false);
      router.push(`/intelligence/reports/${json.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button variant="ai" onClick={() => setOpen(true)}><Sparkles /> {label}</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={go} className="flex min-h-0 flex-1 flex-col">
            <DialogHeader>
              <DialogTitle>Draft a report</DialogTitle>
              <DialogDescription>Claude drafts from the records in this workspace and cites them. The draft stays unapproved until a person approves it.</DialogDescription>
            </DialogHeader>
            <DialogBody className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="rg-type">Report</Label>
                <NativeSelect id="rg-type" value={type} onChange={(e) => setType(e.target.value)}>
                  {types.map((t) => <option key={t} value={t}>{humanize(t)}</option>)}
                </NativeSelect>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="rg-period">Period</Label>
                <Input id="rg-period" placeholder="e.g. Week to Friday, November 2026" value={period} onChange={(e) => setPeriod(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="rg-ins">Anything to emphasise (optional)</Label>
                <Textarea id="rg-ins" rows={3} value={instructions} onChange={(e) => setInstructions(e.target.value)} />
              </div>
              {error && <p role="alert" className="text-xs text-rag-red">{error}</p>}
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={busy}>{busy ? "Drafting… (up to a minute)" : "Draft report"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
