import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:bg-primary-700 hover:shadow-primary-500/40 active:scale-[0.98]",
        accent:
          "bg-accent-500 text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600 hover:shadow-accent-500/40 active:scale-[0.98]",
        outline:
          "border-2 border-primary-300 text-primary-700 hover:border-primary-600 hover:bg-primary-50 active:scale-[0.98]",
        ghost: "text-surface-600 hover:bg-surface-100 hover:text-surface-900",
        white:
          "bg-white text-primary-700 shadow-lg hover:bg-surface-100 active:scale-[0.98]",
        "outline-white":
          "border-2 border-white/60 text-white hover:border-white hover:bg-white/10 active:scale-[0.98]",
      },
      size: {
        sm: "h-10 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
