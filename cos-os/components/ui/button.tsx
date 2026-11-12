import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-sans text-[11.5px] font-semibold uppercase tracking-[0.1em] transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-cherry text-paper hover:bg-oxblood",
        secondary: "border border-oxblood bg-transparent text-oxblood hover:border-cherry hover:text-cherry",
        ghost: "text-muted-foreground hover:bg-butter/60 hover:text-oxblood",
        outline: "border border-input bg-transparent hover:border-oxblood",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
        link: "text-cherry underline-offset-4 hover:underline px-0 h-auto normal-case tracking-normal text-[13px]",
        ai: "border border-ai-border bg-ai-soft text-ai hover:border-ai",
      },
      size: { default: "h-9 px-4", sm: "h-7 px-2.5 text-[10.5px]", lg: "h-10 px-5", icon: "h-9 w-9" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";
export { buttonVariants };
