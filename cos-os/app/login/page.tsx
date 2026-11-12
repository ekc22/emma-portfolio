import { isSupabaseConfigured } from "@/lib/env";
export const dynamic = "force-dynamic";
import { DEMO_PERSONAS, personId } from "@/lib/data/seed";
import { loadDb } from "@/lib/data/local-store";
import { signInDemo } from "@/lib/actions/auth";
import { ROLE_LABEL } from "@/lib/auth/permissions";
import { PasswordForm } from "./password-form";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  const supa = isSupabaseConfigured();
  const people = supa ? [] : loadDb().tables.users;
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="eyebrow mb-2">CoS OS</div>
          <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight">Less reporting.<br />More thinking.</h1>
          <p className="mt-3 text-[13px] text-muted-foreground">An operating system for founders, CEOs and Chief of Staff teams.</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5 shadow-subtle">
          {supa ? (
            <PasswordForm />
          ) : (
            <form action={signInDemo} className="flex flex-col gap-3">
              <div>
                <h2 className="text-[13px] font-semibold">Demo workspace</h2>
                <p className="text-xs text-muted-foreground">Fernhill Systems is a fictional company. Pick a persona to see how permissions change what each role can do. Data is saved locally in this demo.</p>
              </div>
              <fieldset className="flex flex-col gap-2">
                <legend className="sr-only">Persona</legend>
                {DEMO_PERSONAS.map((p, i) => {
                  const person = people.find((u) => u.id === personId(p.personKey));
                  return (
                    <label key={p.personKey} className="flex cursor-pointer items-start gap-3 rounded-md border border-border px-3 py-2.5 has-[:checked]:border-navy has-[:checked]:bg-background">
                      <input type="radio" name="person" value={personId(p.personKey)} defaultChecked={i === 0} className="mt-1 accent-[#1C2B3F]" />
                      <span>
                        <span className="block text-[13px] font-medium">{person?.full_name} <span className="font-normal text-muted-foreground">· {ROLE_LABEL[p.role]}</span></span>
                        <span className="block text-xs text-muted-foreground">{p.blurb}</span>
                      </span>
                    </label>
                  );
                })}
              </fieldset>
              <button className="mt-1 h-9 rounded-md bg-navy text-[13px] font-medium text-primary-foreground hover:bg-navy-soft">Enter workspace</button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
