"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, NativeSelect } from "@/components/ui/input";
import { changeRole, inviteMember, revokeAccess } from "@/lib/actions/members";
import type { Role, Row } from "@/lib/types";

const ROLE_OPTIONS: { value: Role; label: string; hint: string }[] = [
  { value: "owner", label: "Owner", hint: "Everything" },
  { value: "admin", label: "Admin", hint: "Everything, plus access and settings" },
  { value: "executive", label: "Executive", hint: "All records; reads financial records" },
  { value: "member", label: "Member", hint: "Core records; no investor or financial data" },
  { value: "viewer", label: "Viewer", hint: "Read-only core records" },
];

export interface AccessRow { id: string; personId: string | null; role: Role }

/** Who can sign in, with which role. Admins invite people, change roles and remove access. */
export function AccessManager({ people, access, selfPersonId, demo, canInvite }: { people: Row[]; access: AccessRow[]; selfPersonId: string | null; demo: boolean; canInvite: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-3xl text-xs text-muted-foreground">
        {demo
          ? "Demo mode: giving someone access adds them to the sign-in screen straight away."
          : canInvite
            ? "Inviting sends an email so the person sets their own password. Their role decides what they can see and change."
            : "To invite people, add SUPABASE_SERVICE_ROLE_KEY to the server environment (see the README). You can still change roles and remove access."}
      </p>
      <ul className="divide-y divide-linen-deep border-t border-oxblood">
        {people.map((p) => <PersonAccess key={p.id} person={p} access={access.find((a) => a.personId === p.id)} self={p.id === selfPersonId} demo={demo} canInvite={canInvite} />)}
      </ul>
      {access.some((a) => !a.personId) && (
        <p className="text-2xs text-muted-foreground">{access.filter((a) => !a.personId).length} login(s) are not linked to a person record.</p>
      )}
    </div>
  );
}

function PersonAccess({ person, access, self, demo, canInvite }: { person: Row; access?: AccessRow; self: boolean; demo: boolean; canInvite: boolean }) {
  const router = useRouter();
  const [email, setEmail] = React.useState<string>(person.email ?? "");
  const [role, setRole] = React.useState<Role>(access?.role ?? "member");
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [confirm, setConfirm] = React.useState(false);
  const [pending, start] = React.useTransition();
  const run = (fn: () => Promise<{ ok: boolean; error?: string; message?: string }>) => start(async () => {
    const res = await fn();
    setMsg(res.ok ? { ok: true, text: res.message ?? "Saved." } : { ok: false, text: res.error ?? "That did not work." });
    setConfirm(false);
    if (res.ok) router.refresh();
  });

  return (
    <li className="grid grid-cols-1 gap-2 py-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="min-w-0">
        <div className="font-serif text-[18px] leading-tight">{person.full_name}{self && <span className="label ml-2">You</span>}</div>
        <div className="text-2xs text-muted-foreground">{person.title}{access ? ` · ${access.role}` : " · No access"}</div>
        {msg && <p role={msg.ok ? "status" : "alert"} className={msg.ok ? "text-2xs text-sage-deep" : "text-2xs text-rag-red"}>{msg.text}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {access ? (
          <>
            <label className="sr-only" htmlFor={`role-${person.id}`}>Role for {person.full_name}</label>
            <NativeSelect id={`role-${person.id}`} className="h-8 w-36 text-xs" value={access.role} disabled={self || pending} onChange={(e) => run(() => changeRole(access.id, e.target.value as Role))}>
              {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value} title={r.hint}>{r.label}</option>)}
            </NativeSelect>
            {!self && (confirm ? (
              <>
                <Button size="sm" variant="destructive" onClick={() => run(() => revokeAccess(access.id))} disabled={pending}>Remove access</Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirm(false)}>Keep</Button>
              </>
            ) : <Button size="sm" variant="ghost" onClick={() => setConfirm(true)}>Remove</Button>)}
          </>
        ) : (demo || canInvite) ? (
          <>
            {!demo && (
              <>
                <label className="sr-only" htmlFor={`email-${person.id}`}>Email for {person.full_name}</label>
                <Input id={`email-${person.id}`} type="email" className="h-8 w-52 text-xs" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              </>
            )}
            <label className="sr-only" htmlFor={`newrole-${person.id}`}>Role for {person.full_name}</label>
            <NativeSelect id={`newrole-${person.id}`} className="h-8 w-32 text-xs" value={role} onChange={(e) => setRole(e.target.value as Role)}>
              {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </NativeSelect>
            <Button size="sm" onClick={() => run(() => inviteMember(person.id, email, role))} disabled={pending}>{demo ? "Give access" : pending ? "Sending…" : "Invite"}</Button>
          </>
        ) : null}
      </div>
    </li>
  );
}
