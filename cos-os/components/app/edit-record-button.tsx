"use client";

import * as React from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TableName } from "@/lib/schema";
import type { Lookups, Row } from "@/lib/types";
import { RecordForm } from "./record-form";

export function EditRecordButton({ table, row, lookups, canWrite, label = "Edit" }: { table: TableName; row: Row; lookups: Lookups; canWrite: boolean; label?: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}><Pencil /> {canWrite ? label : "View details"}</Button>
      <RecordForm table={table} row={row} lookups={lookups} open={open} onOpenChange={setOpen} canWrite={canWrite} />
    </>
  );
}
