import * as React from "react";

export function PageHeader({ number, title, description, actions }: { number?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-oxblood pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {number && <div className="eyebrow num mb-2 text-cherry">{number}</div>}
        <h1 className="font-serif text-display-md">{title}</h1>
        {description && <p className="mt-2 max-w-2xl font-serif text-[18px] leading-snug text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function SectionTitle({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="font-serif text-[24px] leading-tight">{title}</h2>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
