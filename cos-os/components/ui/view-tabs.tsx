"use client";

import * as React from "react";
import { Tabs } from "@/components/ui/tabs";

type Panel = { id: string; label: React.ReactNode; content: React.ReactNode };

/**
 * Tabs whose panels are rendered on the server and passed in as nodes.
 * Accepts either a list of panels, or `tabs` plus a `panels` map keyed by id.
 */
export function ViewTabs(props: { panels: Panel[]; initial?: string } | { tabs: { id: string; label: React.ReactNode }[]; panels: Record<string, React.ReactNode>; initial?: string }) {
  const list: Panel[] = Array.isArray(props.panels)
    ? props.panels
    : (props as { tabs: { id: string; label: React.ReactNode }[] }).tabs.map((t) => ({ ...t, content: (props.panels as Record<string, React.ReactNode>)[t.id] }));
  return <Tabs tabs={list.map(({ id, label }) => ({ id, label }))} initial={props.initial}>{(active) => list.find((p) => p.id === active)?.content}</Tabs>;
}
