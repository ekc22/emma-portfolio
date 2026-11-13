"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="max-w-xl py-16">
      <div className="eyebrow text-cherry">Something went wrong</div>
      <h1 className="mt-2 font-serif text-display-md">This page didn&apos;t load.</h1>
      <p className="mt-3 font-serif text-[18px] text-muted-foreground">Your data is safe. Try again; if it keeps happening, the reference below helps track it down.</p>
      {error.digest && <p className="mt-3 font-mono text-xs text-muted-foreground">Reference: {error.digest}</p>}
      <div className="mt-6 flex gap-2"><Button onClick={reset}>Try again</Button><Button variant="secondary" onClick={() => (window.location.href = "/")}>Command Centre</Button></div>
    </div>
  );
}
