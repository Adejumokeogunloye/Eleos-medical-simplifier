import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", { variants: { variant: { default: "bg-healthcare-lilac text-healthcare-purple-ink", pink: "bg-pink-50 text-healthcare-rose-ink", success: "bg-emerald-50 text-healthcare-success", outline: "border border-primary/20 bg-white text-healthcare-purple-ink" } }, defaultVariants: { variant: "default" } });
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}
export function Badge({ className, variant, ...props }: BadgeProps) { return <div className={cn(badgeVariants({ variant }), className)} {...props} />; }
