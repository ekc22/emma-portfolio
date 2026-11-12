"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FileUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Label, NativeSelect, Textarea } from "@/components/ui/input";
import { createRecord } from "@/lib/actions/records";
import { MEETING_TYPE, humanize } from "@/lib/schema";

const nowLocal = () => {
  const d = new Date();
  const z = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}`;
};

/** Paste notes or a transcript, or load a text file (.txt, .md, .vtt, .srt). */
export function NewMeetingButton() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState("executive");
  const [when, setWhen] = React.useState(nowLocal);
  const [attendees, setAttendees] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, start] = React.useTransition();

  const load = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 2_000_000) { setError("That file is over 2 MB. Paste the relevant part instead."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "")
        .replace(/^WEBVTT.*$/m, "")
        .replace(/^\d+\s*$/gm, "")
        .replace(/^\d{2}:\d{2}[:.,\d]* --> .*$/gm, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      setNotes(text);
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
    };
    reader.onerror = () => setError("The file could not be read. Try a plain text file.");
    reader.readAsText(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const res = await createRecord("meetings", { title, meeting_type: type, held_at: new Date(when).toISOString(), attendees, notes });
      if (!res.ok) { setError(res.fieldErrors ? Object.values(res.fieldErrors).join(" ") : res.error); return; }
      setOpen(false); setTitle(""); setNotes(""); setAttendees(""); setError(null);
      router.refresh();
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}><Plus /> Add meeting notes</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent wide>
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <DialogHeader>
              <DialogTitle>Add meeting notes</DialogTitle>
              <DialogDescription>Paste notes or a transcript, or load a text file. You can then ask the AI to extract decisions and actions for approval.</DialogDescription>
            </DialogHeader>
            <DialogBody className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1 sm:col-span-2"><Label htmlFor="m-title">Meeting <span className="text-rag-red">*</span></Label><Input id="m-title" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
              <div className="flex flex-col gap-1"><Label htmlFor="m-type">Type</Label><NativeSelect id="m-type" value={type} onChange={(e) => setType(e.target.value)}>{MEETING_TYPE.map((t) => <option key={t} value={t}>{humanize(t)}</option>)}</NativeSelect></div>
              <div className="flex flex-col gap-1"><Label htmlFor="m-when">Date and time</Label><Input id="m-when" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} required /></div>
              <div className="flex flex-col gap-1 sm:col-span-2"><Label htmlFor="m-att">Attendees</Label><Input id="m-att" value={attendees} onChange={(e) => setAttendees(e.target.value)} /></div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="m-notes">Notes or transcript</Label>
                  <label className="inline-flex cursor-pointer items-center gap-1 text-xs text-navy hover:underline">
                    <FileUp className="size-3.5" /> Load a text file
                    <input type="file" accept=".txt,.md,.vtt,.srt,text/plain,text/markdown" className="sr-only" onChange={(e) => load(e.target.files?.[0])} />
                  </label>
                </div>
                <Textarea id="m-notes" rows={12} value={notes} onChange={(e) => setNotes(e.target.value)} className="font-mono text-xs" />
              </div>
              {error && <p role="alert" className="text-xs text-rag-red sm:col-span-2">{error}</p>}
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save meeting"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
