import { LogOut } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import { canSeeInvestors, ROLE_LABEL } from "@/lib/auth/permissions";
import { getStore } from "@/lib/data";
import { signOut } from "@/lib/actions/auth";
import { Sidebar } from "@/components/app/sidebar";
import { Badge } from "@/components/ui/badge";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const store = await getStore(session);
  const pending = (await store.list("ai_recommendations", { where: { status: "pending" } })).length;
  const footer = (
    <div className="flex flex-col gap-2 border-t border-border px-2.5 pt-3">
      <div className="min-w-0">
        <div className="truncate text-[13px] font-medium">{session.name}</div>
        <div className="flex items-center gap-1.5 text-2xs text-muted-foreground">
          {ROLE_LABEL[session.role]}
          {session.mode === "demo" && <Badge variant="stone" title="Local demo data. Configure Supabase for production.">Demo data</Badge>}
        </div>
      </div>
      <form action={signOut}>
        <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><LogOut className="size-3" /> Sign out</button>
      </form>
    </div>
  );
  return (
    <div className="min-h-screen lg:flex">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-surface focus:px-3 focus:py-2">Skip to content</a>
      <Sidebar orgName={session.orgName} footer={footer} canSeeInvestors={canSeeInvestors(session.role)} pendingProposals={pending} />
      <main id="main" className="min-w-0 flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
        <div className="mx-auto max-w-[1280px]">{children}</div>
      </main>
    </div>
  );
}
