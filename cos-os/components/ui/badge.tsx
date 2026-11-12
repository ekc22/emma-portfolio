import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-2xs font-medium whitespace-nowrap", {
  variants: {
    variant: {
      default: "border-border bg-surface text-foreground",
      muted: "border-transparent bg-muted text-muted-foreground",
      sage: "border-transparent bg-sage-soft text-sage-deep",
      stone: "border-transparent bg-stone-soft text-stone-deep",
      navy: "border-transparent bg-navy text-primary-foreground",
      green: "border-transparent bg-[#E3EEE4] text-rag-green",
      amber: "border-transparent bg-[#F6EBD6] text-rag-amber",
      red: "border-transparent bg-[#F4E1DE] text-rag-red",
      ai: "border-ai-border bg-ai-soft text-ai",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
