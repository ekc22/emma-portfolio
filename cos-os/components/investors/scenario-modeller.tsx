"use client";

import * as React from "react";
import { projectCash, type Scenario } from "@/lib/analytics";
import { CashLine } from "@/components/app/charts";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";

const FIELDS: { key: keyof Scenario; label: string; hint: string; money?: boolean }[] = [
  { key: "cash", label: "Starting cash (£)", hint: "Prefilled from the latest month-end snapshot", money: true },
  { key: "monthlyBurn", label: "Net monthly burn (£)", hint: "Prefilled from the 3-month average", money: true },
  { key: "burnGrowthPct", label: "Burn growth per month (%)", hint: "e.g. hiring plan" },
  { key: "monthlyRevenueGrowth", label: "Monthly burn reduction from revenue (£)", hint: "Net new monthly revenue each month", money: true },
  { key: "raiseAmount", label: "Raise amount (£)", hint: "Prefilled with the round's remaining legal gap", money: true },
  { key: "raiseMonth", label: "Funds arrive in month", hint: "Months from now; 0 for no raise" },
  { key: "months", label: "Horizon (months)", hint: "Up to 60" },
];

/** Client-side cash scenario modelling. Every input is printed with the result. */
export function ScenarioModeller({ initial }: { initial: Scenario }) {
  const [s, setS] = React.useState<Scenario>(initial);
  const [raw, setRaw] = React.useState<Record<string, string>>(() => Object.fromEntries(Object.entries(initial).map(([k, v]) => [k, String(v)])));

  const set = (k: keyof Scenario, v: string) => {
    setRaw((r) => ({ ...r, [k]: v }));
    const n = Number(v.replace(/[£,\s%]/g, ""));
    if (Number.isFinite(n)) setS((x) => ({ ...x, [k]: k === "months" ? Math.min(Math.max(Math.round(n), 1), 60) : k === "raiseMonth" ? Math.max(Math.round(n), 0) : n }));
  };
  const reset = () => { setS(initial); setRaw(Object.fromEntries(Object.entries(initial).map(([k, v]) => [k, String(v)]))); };

  const { rows, zeroAt } = projectCash(s);
  const now = new Date();
  const monthLabel = (m: number) => { const d = new Date(now.getFullYear(), now.getMonth() + m, 1); return d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" }); };
  const chart = [{ label: monthLabel(0), cash: s.cash }, ...rows.map((r) => ({ label: monthLabel(r.month), cash: r.cash }))];
  const end = rows[rows.length - 1];

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()} aria-label="Scenario inputs">
        {FIELDS.map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <Label htmlFor={`sc-${f.key}`}>{f.label}</Label>
            <Input id={`sc-${f.key}`} inputMode="decimal" className="num" value={raw[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
            <span className="text-2xs text-muted-foreground">{f.hint}</span>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={reset}>Reset to recorded figures</Button>
      </form>
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <span className="eyebrow text-stone-deep">Scenario — not a forecast</span>
          <span className="text-[13px]">
            {zeroAt === null ? (
              <>Cash does not run out within {s.months} months. Ending cash <strong className="num">{formatMoney(end?.cash ?? s.cash)}</strong>.</>
            ) : (
              <>Cash runs out in <strong className="text-rag-red">month {zeroAt} ({monthLabel(zeroAt)})</strong>.</>
            )}
          </span>
        </div>
        <div className="rounded-md border border-dashed border-border p-2"><CashLine data={chart} height={260} /></div>
        <div className="mt-3 rounded-md bg-background px-3 py-2.5 text-xs">
          <div className="eyebrow mb-1">Assumptions used</div>
          <ul className="list-disc space-y-0.5 pl-4 text-muted-foreground">
            <li>Starting cash {formatMoney(s.cash, "GBP", false)}.</li>
            <li>Net burn starts at {formatMoney(s.monthlyBurn, "GBP", false)} a month, grows {s.burnGrowthPct}% a month, and falls by {formatMoney(s.monthlyRevenueGrowth, "GBP", false)} a month from revenue growth (never below zero).</li>
            <li>{s.raiseMonth > 0 && s.raiseAmount > 0 ? `${formatMoney(s.raiseAmount, "GBP", false)} raised and received in month ${s.raiseMonth}.` : "No new capital received."}</li>
            <li>Each month: cash = previous cash − that month&apos;s burn + any capital received. Horizon {s.months} months.</li>
            <li>Excludes one-off costs, working-capital timing and anything not entered above.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
