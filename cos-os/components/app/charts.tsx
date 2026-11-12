"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMoney } from "@/lib/utils";

const AXIS = { fontSize: 11, fill: "#6E5659" };
const GRID = "#EFE6D8";
const money = (v: number) => formatMoney(v);
const tooltipStyle = { fontSize: 12, borderRadius: 6, border: "1px solid #E4DACB", background: "#FFFCF5" };

export function StageBars({ data, height = 220 }: { data: { stage: string; value: number; weighted?: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={2}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="stage" tick={AXIS} axisLine={false} tickLine={false} interval={0} angle={data.length > 6 ? -25 : 0} textAnchor={data.length > 6 ? "end" : "middle"} height={data.length > 6 ? 50 : 24} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} tickFormatter={money} width={56} />
        <Tooltip formatter={(v: number) => money(v)} contentStyle={tooltipStyle} cursor={{ fill: "#F6EBC8" }} />
        <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={8} />
        <Bar dataKey="value" name="Total value" fill="#E0D2BE" radius={[3, 3, 0, 0]} />
        {data.some((d) => d.weighted !== undefined) && <Bar dataKey="weighted" name="Weighted" fill="#3A0E16" radius={[3, 3, 0, 0]} />}
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Target vs indicative vs committed vs received, as one horizontal stack per measure. */
export function CapitalLadder({ target, rows }: { target: number; rows: { label: string; value: number; kind: "indicative" | "soft" | "legal" | "received" }[] }) {
  const colour = { indicative: "#E4DACB", soft: "#D9A7A0", legal: "#9B1C2E", received: "#3A0E16" };
  return (
    <ResponsiveContainer width="100%" height={40 + rows.length * 34}>
      <BarChart data={rows} layout="vertical" margin={{ top: 20, right: 16, left: 4, bottom: 4 }}>
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false} tickFormatter={money} domain={[0, Math.max(target, ...rows.map((r) => r.value)) * 1.05]} />
        <YAxis type="category" dataKey="label" tick={AXIS} axisLine={false} tickLine={false} width={130} />
        <Tooltip formatter={(v: number) => money(v)} contentStyle={tooltipStyle} cursor={{ fill: "#F6EBC8" }} />
        <ReferenceLine x={target} stroke="#3A0E16" strokeDasharray="4 3" label={{ value: `Target ${money(target)}`, position: "top", fontSize: 11, fill: "#3A0E16" }} />
        <Bar dataKey="value" radius={[0, 3, 3, 0]} barSize={18}>
          {rows.map((r) => <Cell key={r.label} fill={colour[r.kind]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CashLine({ data, height = 220 }: { data: { label: string; cash: number; burn?: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="cashFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9B1C2E" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#9B1C2E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} tickFormatter={money} width={56} />
        <Tooltip formatter={(v: number) => money(v)} contentStyle={tooltipStyle} />
        <ReferenceLine y={0} stroke="#9B1C2E" />
        <Area type="monotone" dataKey="cash" name="Cash" stroke="#9B1C2E" fill="url(#cashFill)" strokeWidth={2} dot={{ r: 2.5, fill: "#9B1C2E" }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TwoLines({ data, a, b, height = 200 }: { data: Record<string, number | string>[]; a: { key: string; name: string }; b?: { key: string; name: string }; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} tickFormatter={money} width={56} />
        <Tooltip formatter={(v: number) => money(v)} contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={8} />
        <Line type="monotone" dataKey={a.key} name={a.name} stroke="#3A0E16" strokeWidth={2} dot={{ r: 2.5 }} />
        {b && <Line type="monotone" dataKey={b.key} name={b.name} stroke="#9B1C2E" strokeWidth={2} dot={{ r: 2.5 }} />}
      </LineChart>
    </ResponsiveContainer>
  );
}
