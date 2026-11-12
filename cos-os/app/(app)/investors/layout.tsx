import { Lock } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import { canSeeInvestors, ROLE_LABEL } from "@/lib/auth/permissions";
import { PageHeader } from "@/components/app/page-header";
import { InvestorSubnav } from "@/components/investors/subnav";

export default async function InvestorsLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  if (!canSeeInvestors(session.role)) {
    return (
      <div>
        <PageHeader number="05" title="Investor Relations Desk" description="Investor CRM, fundraising, diligence, reporting and capital." />
        <div className="mx-auto mt-10 max-w-md rounded-lg border border-border bg-surface p-6 text-center shadow-subtle">
          <Lock className="mx-auto mb-3 size-5 text-muted-foreground" aria-hidden />
          <h2 className="text-[15px] font-semibold">Restricted to the executive team</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Investor, fundraising and capital records are confidential. Your role ({ROLE_LABEL[session.role]}) does not include access. Ask a workspace owner or admin if you need it.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <PageHeader number="05" title="Investor Relations Desk" description="Investor relationships, the fundraising pipeline, diligence, reporting and capital in one place. Indicative interest is never shown as committed capital." />
      <InvestorSubnav />
      {children}
    </div>
  );
}
