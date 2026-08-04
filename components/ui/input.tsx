import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; icon?: React.ReactNode; }
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, label, icon, id, ...props }, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return <label className="block space-y-2" htmlFor={inputId}>{label && <span className="text-sm font-semibold text-healthcare-ink">{label}</span>}<span className="relative block">{icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary">{icon}</span>}<input id={inputId} ref={ref} className={cn("h-11 w-full rounded-xl border border-healthcare-lilac bg-white px-4 text-sm text-healthcare-ink outline-none transition placeholder:text-healthcare-soft-ink focus:border-primary focus:ring-4 focus:ring-primary/10", icon && "pl-10", className)} {...props} /></span></label>;
});
Input.displayName = "Input";
