import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-[13px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-navy-soft shadow-subtle",
        secondary: "bg-surface text-foreground border border-border hover:bg-muted shadow-subtle",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        outline: "border border-input bg-transparent hover:bg-muted",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
        link: "text-navy underline-offset-4 hover:underline px-0 h-auto",
        ai: "bg-ai-soft text-ai border border-ai-border hover:bg-[#E9E3F2]",
      },
      size: { default: "h-8 px-3", sm: "h-7 px-2.5 text-xs", lg: "h-9 px-4", icon: "h-8 w-8" },
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
