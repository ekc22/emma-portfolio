import { isSupabaseConfigured } from "@/lib/env";
import { DEMO_PERSONAS, personId } from "@/lib/data/seed";
import { loadDb } from "@/lib/data/local-store";
import { signInDemo } from "@/lib/actions/auth";
import { ROLE_LABEL } from "@/lib/auth/permissions";
import { PasswordForm } from "./password-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in" };

const WORD = "CoS OS";

export default async function LoginPage() {
  const supa = isSupabaseConfigured();
  const people = supa ? [] : loadDb().tables.users;
  return (
    <main className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 gap-12 px-5 py-10 sm:px-8 lg:grid-cols-12 lg:items-center lg:px-14">
      <section className="lg:col-span-7">
        <div className="flex items-baseline gap-4">
          <span className="font-serif text-[3rem] leading-none text-cherry">E.</span>
          <span className="label">Chief of Staff operating system</span>
        </div>
        {/* Logo in motion: 70 ms stagger across 1.4 s, once. */}
        <h1 aria-label={WORD} className="wordmark mt-8 text-[clamp(4rem,12vw,10rem)]">
          {WORD.split("").map((c, i) => (
            <span key={i} aria-hidden="true" className="letter-in" style={{ animationDelay: `${i * 70}ms`, animationDuration: `${1400 - i * 70}ms` }}>{c === " " ? " " : c}</span>
          ))}
        </h1>
        <p className="mt-6 max-w-xl font-serif text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1]">
          Less reporting. <em className="text-cherry">More thinking.</em>
        </p>
        <p className="mt-4 max-w-md font-serif text-[1.15rem] leading-snug text-muted-foreground">One workspace for strategy, delivery, pipeline and investors, with a Chief of Staff that connects them.</p>
      </section>

      <section className="border-t-2 border-oxblood pt-6 lg:col-span-5">
        {supa ? (
          <PasswordForm />
        ) : (
          <form action={signInDemo} className="flex flex-col gap-4">
            <div>
              <h2 className="font-serif text-[1.9rem] leading-tight">Demo workspace</h2>
              <p className="mt-1 text-[13px] text-muted-foreground">Fernhill Systems is a fictional company. Choose a person to see how each role changes what you can see and do. Changes are saved locally.</p>
            </div>
            <fieldset className="flex flex-col border-t border-linen-deep">
              <legend className="sr-only">Persona</legend>
              {DEMO_PERSONAS.map((p, i) => {
                const person = people.find((u) => u.id === personId(p.personKey));
                return (
                  <label key={p.personKey} className="flex cursor-pointer items-start gap-3 border-b border-linen-deep px-1 py-3 transition-colors hover:bg-butter/40 has-[:checked]:bg-butter/70">
                    <input type="radio" name="person" value={personId(p.personKey)} defaultChecked={i === 0} className="mt-1.5 accent-[#9B1C2E]" />
                    <span>
                      <span className="block font-serif text-[1.25rem] leading-tight">{person?.full_name} <span className="label ml-1">{ROLE_LABEL[p.role]}</span></span>
                      <span className="block text-xs text-muted-foreground">{p.blurb}</span>
                    </span>
                  </label>
                );
              })}
            </fieldset>
            <button className="h-11 bg-cherry font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-paper transition-colors duration-300 hover:bg-oxblood">Enter the workspace</button>
          </form>
        )}
      </section>
    </main>
  );
}
