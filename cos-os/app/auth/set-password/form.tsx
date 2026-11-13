"use client";

import { useActionState } from "react";
import { setPassword } from "@/lib/actions/auth";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SetPasswordForm() {
  const [state, action, pending] = useActionState(setPassword, {});
  return (
    <form action={action} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1"><Label htmlFor="password">New password</Label><Input id="password" name="password" type="password" autoComplete="new-password" minLength={10} required /></div>
      <div className="flex flex-col gap-1"><Label htmlFor="confirm">Repeat it</Label><Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={10} required /></div>
      {state?.error && <p role="alert" className="text-xs text-rag-red">{state.error}</p>}
      <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save and continue"}</Button>
    </form>
  );
}
