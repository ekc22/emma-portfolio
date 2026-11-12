"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUp, Loader2, RotateCcw, Sparkles, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/app/markdown";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string; steps?: string[]; proposals?: string[]; reports?: string[]; error?: string };

export const EXAMPLES = [
  "Prepare my CEO briefing for Monday.",
  "Which strategic projects are at risk?",
  "Which commercial opportunities need intervention?",
  "Summarise our fundraising position.",
  "Which investors are currently in due diligence?",
  "Prepare a board update covering commercial performance, delivery and fundraising.",
  "Extract actions from these meeting notes: ",
  "Identify where leadership attention would create the most value this week.",
];

export function Chat({ storageKey, configured, readOnly }: { storageKey: string; configured: boolean; readOnly: boolean }) {
  const router = useRouter();
  const [msgs, setMsgs] = React.useState<Msg[]>([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const abort = React.useRef<AbortController | null>(null);
  const end = React.useRef<HTMLDivElement>(null);
  const box = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    try { const s = localStorage.getItem(storageKey); if (s) setMsgs(JSON.parse(s)); } catch { /* storage unavailable */ }
  }, [storageKey]);
  React.useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(msgs.slice(-40))); } catch { /* storage unavailable */ }
    end.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [msgs, storageKey]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    const history = [...msgs.filter((m) => !m.error || m.content), { role: "user" as const, content: q }];
    setMsgs([...history, { role: "assistant", content: "", steps: [] }]);
    setInput("");
    setBusy(true);
    const ctl = new AbortController();
    abort.current = ctl;
    const patch = (fn: (m: Msg) => Msg) => setMsgs((all) => [...all.slice(0, -1), fn(all[all.length - 1])]);
    let changed = false;
    try {
      const res = await fetch("/api/agent", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }), signal: ctl.signal });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "The request failed.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line) continue;
          const ev = JSON.parse(line);
          if (ev.type === "tool") patch((m) => ({ ...m, steps: [...(m.steps ?? []), ev.label] }));
          else if (ev.type === "proposal") { changed = true; patch((m) => ({ ...m, proposals: [...(m.proposals ?? []), ev.id] })); }
          else if (ev.type === "report") { changed = true; patch((m) => ({ ...m, reports: [...(m.reports ?? []), ev.id] })); }
          else if (ev.type === "text") patch((m) => ({ ...m, content: ev.text }));
          else if (ev.type === "error") patch((m) => ({ ...m, error: ev.message }));
        }
      }
    } catch (e) {
      const aborted = (e as Error).name === "AbortError";
      patch((m) => ({ ...m, error: aborted ? "Stopped." : (e as Error).message }));
    } finally {
      setBusy(false);
      abort.current = null;
      if (changed) router.refresh();
      box.current?.focus();
    }
  };

  if (!configured) {
    return (
      <div className="rounded-lg border border-dashed border-ai-border bg-ai-soft/30 p-6 text-[13px]">
        <p className="font-medium">The AI Chief of Staff is not configured.</p>
        <p className="mt-1 text-muted-foreground">Add <code className="rounded bg-muted px-1 font-mono text-xs">ANTHROPIC_API_KEY</code> to <code className="rounded bg-muted px-1 font-mono text-xs">.env.local</code> and restart the app. Everything else in CoS OS works without it.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col rounded-lg border border-border bg-surface shadow-subtle">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="flex items-center gap-2 text-xs text-muted-foreground"><Sparkles className="size-3.5 text-ai" /> Answers come from your workspace records and link to them.</span>
        {msgs.length > 0 && <Button size="sm" variant="ghost" onClick={() => setMsgs([])} disabled={busy}><RotateCcw /> New conversation</Button>}
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite">
        {!msgs.length && (
          <div>
            <p className="font-serif text-xl">What do you need?</p>
            <p className="mt-1 text-xs text-muted-foreground">Ask across strategy, delivery, pipeline and{readOnly ? "" : " investors"}. I can draft reports and propose changes; you approve them.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {EXAMPLES.map((e) => (
                <button key={e} onClick={() => (e.endsWith(": ") ? (setInput(e), box.current?.focus()) : send(e))} className="rounded-full border border-border px-3 py-1.5 text-left text-xs hover:border-navy/40 hover:bg-background">{e.replace(/: $/, "…")}</button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={cn(m.role === "user" ? "ml-auto max-w-[85%] rounded-lg bg-muted px-3.5 py-2.5 text-[13px] whitespace-pre-wrap" : "max-w-3xl")}>
            {m.role === "user" ? m.content : (
              <div>
                {!!m.steps?.length && (
                  <ol className="mb-2 flex flex-wrap gap-1.5">
                    {m.steps.map((s, k) => <li key={k} className="rounded-full border border-dashed border-ai-border px-2 py-0.5 text-2xs text-ai">{s}</li>)}
                  </ol>
                )}
                {m.content ? (
                  <div className="rounded-lg border border-dashed border-ai-border px-4 py-3">
                    <div className="mb-1 text-2xs font-medium text-ai">AI-generated · check linked records before acting</div>
                    <Markdown text={m.content} />
                  </div>
                ) : busy && i === msgs.length - 1 ? (
                  <p className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="size-3.5 animate-spin" /> Working through your records…</p>
                ) : null}
                {!!m.proposals?.length && <p className="mt-2 text-xs"><Link href="#proposals" className="text-navy hover:underline">{m.proposals.length} change{m.proposals.length > 1 ? "s" : ""} proposed, awaiting your approval →</Link></p>}
                {m.reports?.map((r) => <p key={r} className="mt-2 text-xs"><Link href={`/intelligence/reports/${r}`} className="text-navy hover:underline">Open the draft report →</Link></p>)}
                {m.error && <p role="alert" className="mt-2 text-xs text-rag-red">{m.error}</p>}
              </div>
            )}
          </div>
        ))}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-border p-3">
        <div className="flex items-end gap-2 rounded-md border border-input bg-background px-2 py-1.5 focus-within:ring-1 focus-within:ring-ring">
          <label htmlFor="agent-input" className="sr-only">Message the AI Chief of Staff</label>
          <textarea
            id="agent-input"
            ref={box}
            rows={Math.min(8, Math.max(1, input.split("\n").length))}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask a question, paste meeting notes, or request a report"
            className="max-h-60 min-h-[2rem] flex-1 resize-none bg-transparent px-1 py-1 text-[13px] outline-none"
          />
          {busy ? (
            <Button type="button" size="icon" variant="secondary" onClick={() => abort.current?.abort()} aria-label="Stop"><Square /></Button>
          ) : (
            <Button type="submit" size="icon" disabled={!input.trim()} aria-label="Send"><ArrowUp /></Button>
          )}
        </div>
        <p className="mt-1.5 px-1 text-2xs text-muted-foreground">Enter to send, Shift+Enter for a new line. The AI cannot send messages, change financial records or apply changes without approval.</p>
      </form>
    </div>
  );
}
