"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Guided CoS OS demo. Runs entirely in the browser: no AI calls, no network, nothing stored.
 * The desk belongs to Fernhill Systems, a fictional company. Answers are written in advance
 * in the style the live product uses, and are labelled as sample answers on the page.
 */

type Priority = { title: string; status: "Now" | "Next" | "Waiting"; due: string; note?: string };
type Lead = { name: string; org: string; stage: string; next: string };
type Decision = { decision: string; why: string; isNew?: boolean };

const PRIORITIES: Priority[] = [
  { title: "Close the data room gaps two funds flagged", status: "Now", due: "Due in 2 days", note: "KPI methodology and churn cohorts" },
  { title: "Agree scope of the Vantage connector", status: "Waiting", due: "Due in 4 days", note: "Waiting on CTO estimate" },
  { title: "Board pack: narrative and KPI pages", status: "Next", due: "Due in 9 days", note: "Board meeting on the 26th" },
  { title: "Shortlist for Head of Customer Success", status: "Next", due: "Due in 12 days" },
];

const PIPELINE: Lead[] = [
  { name: "Harbour Angels", org: "Angel syndicate", stage: "Committed", next: "Countersign side letter" },
  { name: "Greenfield Impact Fund", org: "Lead candidate", stage: "Diligence", next: "Send KPI methodology note" },
  { name: "Northbridge Ventures", org: "Series A specialist", stage: "Diligence", next: "Churn cohort analysis by Friday" },
  { name: "Linden Capital", org: "Generalist VC", stage: "Meeting", next: "Partner meeting to book" },
  { name: "Ostro Partners", org: "Climate tech fund", stage: "Intro", next: "Intro call via board member" },
];

const DECISIONS: Decision[] = [
  { decision: "Price the predictive maintenance tier per site, per month", why: "Matches how facilities teams budget" },
  { decision: "Move ISO 27001 ownership to Finance & Operations", why: "Frees the CTO for the platform release" },
];

const NEW_DECISION: Decision = {
  decision: "Delay the Netherlands launch until the Series A closes",
  why: "Keeps the team focused on pilots",
  isNew: true,
};

type Prompt = { id: string; chip: string; ask: string; trace: string[]; answer: ReactNode; logsDecision?: boolean };

const H = ({ children }: { children: ReactNode }) => <p className="mt-4 font-sans text-[0.6875rem] font-semibold uppercase tracking-label text-cherry first:mt-0">{children}</p>;
const L = ({ children }: { children: ReactNode }) => <ul className="mt-2 space-y-1.5 pl-4 [list-style:disc] marker:text-cherry">{children}</ul>;

const PROMPTS: Prompt[] = [
  {
    id: "brief",
    chip: "Brief me on today",
    ask: "Brief me on today: what matters most on the desk, and the one thing I should do first.",
    trace: ["Read the desk"],
    answer: (
      <>
        <H>Do this first</H>
        <p className="mt-2">
          Close the data room gaps. Greenfield and Northbridge are both in diligence and both are waiting on the same two items: the KPI methodology
          note and the churn cohorts. Clearing them moves two investors at once.
        </p>
        <H>Also on the desk</H>
        <L>
          <li>The board pack is due in 9 days and can reuse the KPI note, so do the data room first.</li>
          <li>The Vantage connector scope is waiting on the CTO’s estimate. Worth a nudge today so it doesn’t slip past its date.</li>
          <li>Harbour Angels have committed. The side letter is ready to countersign.</li>
        </L>
        <H>Can wait</H>
        <p className="mt-2">The Head of Customer Success shortlist, due in 12 days.</p>
      </>
    ),
  },
  {
    id: "raise",
    chip: "Where’s the raise?",
    ask: "Where does the Series A stand? Who is closest to committing and what is the next step for each?",
    trace: ["Read the desk"],
    answer: (
      <>
        <p>You’re raising £8m. One investor has committed and two funds are in diligence.</p>
        <L>
          <li><strong className="font-normal text-cherry">Harbour Angels</strong> · Committed. Countersign the side letter.</li>
          <li><strong className="font-normal text-cherry">Greenfield Impact Fund</strong> · Diligence. Send the KPI methodology note.</li>
          <li><strong className="font-normal text-cherry">Northbridge Ventures</strong> · Diligence. Churn cohort analysis by Friday.</li>
          <li><strong className="font-normal text-cherry">Linden Capital</strong> · Meeting. Book the partner meeting.</li>
          <li><strong className="font-normal text-cherry">Ostro Partners</strong> · Intro. Intro call via your board member.</li>
        </L>
        <H>Closest to a lead</H>
        <p className="mt-2">Greenfield. Both diligence funds are blocked on the same data room items, so that’s the step that matters this week.</p>
        <p className="mt-3 text-muted-ink">Only Harbour Angels is committed. Everything else is interest, not capital.</p>
      </>
    ),
  },
  {
    id: "week",
    chip: "Plan my week",
    ask: "Plan my week around the priorities on the desk. What should I protect time for, and what can wait?",
    trace: ["Read the desk"],
    answer: (
      <>
        <H>Protect time for</H>
        <L>
          <li><strong className="font-normal text-cherry">Monday and Tuesday:</strong> the data room. KPI methodology note and churn cohorts.</li>
          <li><strong className="font-normal text-cherry">Wednesday:</strong> the Vantage connector scope with the CTO, once the estimate lands.</li>
          <li><strong className="font-normal text-cherry">Thursday:</strong> the board pack narrative, reusing the KPI note.</li>
          <li><strong className="font-normal text-cherry">Friday:</strong> churn analysis to Northbridge, and book the Linden partner meeting.</li>
        </L>
        <H>Can wait</H>
        <p className="mt-2">The Head of Customer Success shortlist and the Ostro intro call can both move to next week.</p>
      </>
    ),
  },
  {
    id: "update",
    chip: "Draft an investor update",
    ask: "Draft a short investor update from the priorities, pipeline and recent decisions. Keep it warm and direct.",
    trace: ["Read the desk", "Drafted an update"],
    answer: (
      <>
        <div className="border-l-2 border-linen-deep pl-4">
          <p><strong className="font-normal text-cherry">Subject: Fernhill update</strong></p>
          <p className="mt-3">Hi all,</p>
          <p className="mt-3">
            <strong className="font-normal text-cherry">Fundraising.</strong> Our £8m Series A is progressing well. Harbour Angels have committed and two funds are in
            diligence. We’re closing the remaining data room items this week.
          </p>
          <p className="mt-3">
            <strong className="font-normal text-cherry">Product.</strong> We’ve agreed to price the predictive maintenance tier per site, per month, which matches how
            facilities teams budget.
          </p>
          <p className="mt-3">
            <strong className="font-normal text-cherry">Team.</strong> ISO 27001 now sits with Finance & Operations, freeing our CTO for the platform release. We’re
            shortlisting for a Head of Customer Success.
          </p>
          <p className="mt-3"><strong className="font-normal text-cherry">Ask.</strong> Introductions to Series A investors would be very welcome.</p>
          <p className="mt-3">Thank you for the continued support.</p>
        </div>
        <p className="mt-3 text-muted-ink">This is a draft. Nothing is sent: you review it and send it yourself.</p>
      </>
    ),
  },
  {
    id: "decision",
    chip: "Log a decision",
    ask: "Log a decision: we will delay the Netherlands launch until the Series A closes, to keep the team focused on pilots.",
    trace: ["Read the desk", "Logged a decision"],
    logsDecision: true,
    answer: (
      <>
        <p>
          Logged: <strong className="font-normal text-cherry">delay the Netherlands launch until the Series A closes</strong>, to keep the team focused on pilots.
        </p>
        <p className="mt-3">It’s at the top of Decisions on the desk. If it changes the board pack narrative, I’ll flag it in the next draft.</p>
      </>
    ),
  },
];

type Turn = { id: string; ask: string; trace: string[]; answer: ReactNode; ready: boolean };

export default function CosDemo() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [logged, setLogged] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [turns]);

  const run = (p: Prompt) => {
    if (busy) return;
    setBusy(true);
    const key = `${p.id}-${Date.now()}`;
    setTurns((t) => [...t, { id: key, ask: p.ask, trace: p.trace, answer: p.answer, ready: false }]);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = window.setTimeout(() => {
      setTurns((t) => t.map((x) => (x.id === key ? { ...x, ready: true } : x)));
      if (p.logsDecision) setLogged(true);
      setBusy(false);
    }, reduce ? 0 : 900);
  };

  const reset = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setTurns([]);
    setLogged(false);
    setBusy(false);
  };

  const decisions = logged ? [NEW_DECISION, ...DECISIONS] : DECISIONS;
  const asked = new Set(turns.map((t) => t.id.split("-")[0]));

  return (
    <div className="grid-12 gap-y-10">
      {/* Conversation */}
      <section aria-label="Conversation with the AI Chief of Staff" className="col-span-4 flex flex-col border border-linen-deep bg-paper md:col-span-7">
        <div className="border-b border-linen-deep p-4 md:p-5">
          <p className="label">Choose a question</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PROMPTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => run(p)}
                disabled={busy || (p.logsDecision && logged)}
                className={`rounded-full border px-4 py-2 font-sans text-[0.8125rem] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  asked.has(p.id) ? "border-cherry/40 text-cherry" : "border-linen-deep hover:border-cherry hover:text-cherry"
                }`}
              >
                {p.chip}
              </button>
            ))}
          </div>
        </div>

        <div ref={logRef} aria-live="polite" className="h-[28rem] overflow-y-auto p-4 md:h-[34rem] md:p-6">
          {turns.length === 0 ? (
            <div className="flex h-full flex-col justify-center">
              <p className="text-display-sm">Good morning.</p>
              <p className="mt-3 max-w-[44ch] text-[1.125rem] leading-snug text-muted-ink">
                Pick a question above. I read the desk on the right before I answer, and tell you what I changed.
              </p>
            </div>
          ) : (
            <ol className="space-y-6">
              {turns.map((t) => (
                <li key={t.id} className="space-y-3">
                  <p className="ml-auto max-w-[85%] bg-butter/70 px-4 py-3 text-[1.0625rem] leading-snug">{t.ask}</p>
                  <div className="max-w-[92%]">
                    <p className="label flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-cherry">Chief of Staff</span>
                      {t.trace.map((x, i) => (
                        <span key={x} className={t.ready || i === 0 ? "" : "opacity-40"}>
                          · {x}
                          {!t.ready && i === 0 ? "…" : ""}
                        </span>
                      ))}
                    </p>
                    {t.ready ? (
                      <div className="mt-2 text-[1.0625rem] leading-[1.5]">{t.answer}</div>
                    ) : (
                      <p className="mt-2 text-[1.0625rem] italic text-muted-ink">Reading the desk…</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-linen-deep px-4 py-3 md:px-5">
          <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-label text-muted-ink">Sample answers · fictional company</p>
          <button type="button" onClick={reset} className="text-[1rem] text-cherry underline decoration-cherry/30 underline-offset-4 hover:decoration-cherry">
            Start again
          </button>
        </div>
      </section>

      {/* The desk */}
      <aside aria-label="The desk" className="col-span-4 space-y-8 md:col-span-5">
        <section>
          <h2 className="flex items-baseline justify-between border-b border-oxblood pb-2">
            <span className="text-[1.375rem]">Priorities</span>
            <span className="label">{PRIORITIES.length}</span>
          </h2>
          <ul>
            {PRIORITIES.map((p) => (
              <li key={p.title} className="border-b border-linen-deep py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[1.0625rem] leading-snug">{p.title}</span>
                  <span className={`label shrink-0 ${p.status === "Now" ? "!text-cherry" : ""}`}>{p.status}</span>
                </div>
                <p className="mt-1 text-[0.9375rem] text-muted-ink">
                  {p.due}
                  {p.note ? ` · ${p.note}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="flex items-baseline justify-between border-b border-oxblood pb-2">
            <span className="text-[1.375rem]">Series A pipeline</span>
            <span className="label">£8m target</span>
          </h2>
          <ul>
            {PIPELINE.map((l) => (
              <li key={l.name} className="border-b border-linen-deep py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[1.0625rem] leading-snug">{l.name}</span>
                  <span className={`label shrink-0 ${l.stage === "Committed" ? "!text-[#3F6B3A]" : l.stage === "Diligence" ? "!text-cherry" : ""}`}>{l.stage}</span>
                </div>
                <p className="mt-1 text-[0.9375rem] text-muted-ink">
                  {l.org} · {l.next}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="flex items-baseline justify-between border-b border-oxblood pb-2">
            <span className="text-[1.375rem]">Decisions</span>
            <span className="label">Most recent</span>
          </h2>
          <ul>
            {decisions.map((d) => (
              <li key={d.decision} className={`border-b border-linen-deep py-3 ${d.isNew ? "bg-butter/60 px-3" : ""}`}>
                {d.isNew && <p className="label !text-cherry">Just logged</p>}
                <p className="text-[1.0625rem] leading-snug">{d.decision}</p>
                <p className="mt-1 text-[0.9375rem] text-muted-ink">{d.why}</p>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}
