import Link from "next/link";
import * as React from "react";
import type { TableName } from "@/lib/schema";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export interface ListItem {
  id: string;
  table: TableName;
  title: string;
  meta?: React.ReactNode;
  right?: React.ReactNode;
}

/** A compact card listing records, each linking to its record page. */
export function RecordListCard({ title, description, items, empty = "Nothing here.", tone }: { title: string; description?: string; items: ListItem[]; empty?: string; tone?: "red" | "amber" }) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>{title}</CardTitle>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        <span className={`num shrink-0 text-xs font-medium ${items.length && tone === "red" ? "text-rag-red" : items.length && tone === "amber" ? "text-rag-amber" : "text-muted-foreground"}`}>{items.length}</span>
      </CardHeader>
      {items.length ? (
        <ul className="divide-y divide-border">
          {items.map((i) => (
            <li key={i.table + i.id} className="flex items-start justify-between gap-3 px-4 py-2">
              <div className="min-w-0">
                <Link href={`/records/${i.table}/${i.id}`} className="block truncate text-[13px] font-medium hover:underline underline-offset-2">{i.title}</Link>
                {i.meta && <div className="truncate text-xs text-muted-foreground">{i.meta}</div>}
              </div>
              {i.right && <div className="num shrink-0 text-xs">{i.right}</div>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 py-5 text-center text-xs text-muted-foreground">{empty}</p>
      )}
    </Card>
  );
}
