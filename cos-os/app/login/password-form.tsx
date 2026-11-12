"use client";

import { useActionState } from "react";
import { signInWithPassword } from "@/lib/actions/auth";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PasswordForm() {
  const [state, action, pending] = useActionState(signInWithPassword, {});
  return (
    <form action={action} className="flex flex-col gap-3">
      <h2 className="font-serif text-[1.9rem] leading-tight">Sign in</h2>
      <div className="flex flex-col gap-1"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" required /></div>
      <div className="flex flex-col gap-1"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" autoComplete="current-password" required /></div>
      {state?.error && <p role="alert" className="text-xs text-rag-red">{state.error}</p>}
      <Button type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</Button>
      <p className="text-2xs text-muted-foreground">Accounts are created by a workspace admin in Supabase. See the README.</p>
    </form>
  );
}
