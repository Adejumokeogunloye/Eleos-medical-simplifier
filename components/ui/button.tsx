import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { default: "gradient-healthcare bg-[length:180%_180%] text-primary-foreground shadow-healthcare hover:scale-[1.02] hover:bg-[position:100%_50%] hover:shadow-lg", secondary: "bg-secondary text-secondary-foreground hover:scale-[1.01] hover:bg-healthcare-lilac hover:shadow-sm", outline: "border border-primary/25 bg-white text-primary hover:scale-[1.01] hover:bg-healthcare-lavender hover:shadow-sm", ghost: "text-primary hover:scale-[1.01] hover:bg-healthcare-lavender" }, size: { default: "h-11 px-5 py-2", sm: "h-9 rounded-lg px-3", lg: "h-12 rounded-xl px-7", icon: "size-11" } }, defaultVariants: { variant: "default", size: "default" } });
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => { const Comp = asChild ? Slot : "button"; return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />; });
Button.displayName = "Button";
export { Button, buttonVariants };
