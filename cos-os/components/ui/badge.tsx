import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 border px-1.5 py-px font-sans text-[10px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap", {
  variants: {
    variant: {
      default: "border-border bg-surface text-foreground",
      muted: "border-transparent bg-muted text-muted-foreground",
      sage: "border-transparent bg-sage-soft text-sage-deep",
      stone: "border-transparent bg-stone-soft text-stone-deep",
      navy: "border-transparent bg-cherry text-paper",
      green: "border-transparent bg-[#ECEAD3] text-rag-green",
      amber: "border-transparent bg-[#F6EBC8] text-rag-amber",
      red: "border-transparent bg-[#F6E2DC] text-rag-red",
      ai: "border-ai-border bg-ai-soft text-ai",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
