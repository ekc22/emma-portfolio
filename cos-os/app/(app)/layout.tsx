import { requireSession } from "@/lib/auth/session";
import { canSeeInvestors, ROLE_LABEL } from "@/lib/auth/permissions";
import { getStore } from "@/lib/data";
import { signOut } from "@/lib/actions/auth";
import { Masthead } from "@/components/app/masthead";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const store = await getStore(session);
  const pending = (await store.list("ai_recommendations", { where: { status: "pending" } })).length;
  const signOutButton = (
    <form action={signOut}>
      <button className="label !text-cherry hover:!text-oxblood">Sign out</button>
    </form>
  );
  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-oxblood focus:px-4 focus:py-2 focus:text-paper">Skip to content</a>
      <Masthead
        orgName={session.orgName}
        user={session.name}
        role={ROLE_LABEL[session.role]}
        demo={session.mode === "demo"}
        signOut={signOutButton}
        canSeeInvestors={canSeeInvestors(session.role)}
        pendingProposals={pending}
      />
      <main id="main" className="mx-auto max-w-[1400px] px-4 pb-20 pt-8 sm:px-6 lg:px-10 lg:pt-12">{children}</main>
      <footer className="mx-auto flex max-w-[1400px] flex-wrap items-baseline justify-between gap-3 border-t border-oxblood px-4 py-6 sm:px-6 lg:px-10">
        <span className="font-serif text-[1.5rem] leading-none text-cherry">E.</span>
        <span className="font-serif text-[1.1rem] italic text-muted-foreground">Less reporting. More thinking.</span>
      </footer>
    </div>
  );
}
