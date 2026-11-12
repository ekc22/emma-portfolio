import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn("flex h-8 w-full rounded-md border border-input bg-surface px-2.5 text-[13px] placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-offset-0 disabled:opacity-50", className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn("flex min-h-[72px] w-full rounded-md border border-input bg-surface px-2.5 py-2 text-[13px] leading-5 placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-offset-0", className)} {...props} />
));
Textarea.displayName = "Textarea";

export const NativeSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...props }, ref) => (
  <select ref={ref} className={cn("flex h-8 w-full rounded-md border border-input bg-surface px-2 text-[13px] focus-visible:ring-1 focus-visible:ring-offset-0", className)} {...props} />
));
NativeSelect.displayName = "NativeSelect";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-xs font-medium text-foreground", className)} {...props} />;
}
