"use client";

import { useActionState, useState } from "react";
import { requestPasswordReset, signInWithPassword } from "@/lib/actions/auth";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PasswordForm({ linkError }: { linkError?: boolean }) {
  const [state, action, pending] = useActionState(signInWithPassword, {});
  const [reset, resetAction, resetting] = useActionState(requestPasswordReset, {});
  const [forgot, setForgot] = useState(false);
  if (forgot) {
    return (
      <form action={resetAction} className="flex flex-col gap-3">
        <h2 className="font-serif text-[1.9rem] leading-tight">Reset your password</h2>
        <div className="flex flex-col gap-1"><Label htmlFor="reset-email">Email</Label><Input id="reset-email" name="email" type="email" autoComplete="email" required /></div>
        {reset?.sent && <p role="status" className="text-xs text-sage-deep">If that address has an account, a reset link is on its way.</p>}
        {reset?.error && <p role="alert" className="text-xs text-rag-red">{reset.error}</p>}
        <Button type="submit" disabled={resetting}>{resetting ? "Sending…" : "Send reset link"}</Button>
        <button type="button" onClick={() => setForgot(false)} className="label self-start !text-cherry">Back to sign in</button>
      </form>
    );
  }
  return (
    <form action={action} className="flex flex-col gap-3">
      <h2 className="font-serif text-[1.9rem] leading-tight">Sign in</h2>
      {linkError && <p role="alert" className="text-xs text-rag-red">That link has expired or was already used. Ask for a new one.</p>}
      <div className="flex flex-col gap-1"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" required /></div>
      <div className="flex flex-col gap-1"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" autoComplete="current-password" required /></div>
      {state?.error && <p role="alert" className="text-xs text-rag-red">{state.error}</p>}
      <Button type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</Button>
      <button type="button" onClick={() => setForgot(true)} className="label self-start !text-cherry">Forgotten your password?</button>
      <p className="text-2xs text-muted-foreground">Access is by invitation from a workspace admin.</p>
    </form>
  );
}
