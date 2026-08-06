import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label?: string; }
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, label, id, children, ...props }, ref) => {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return <label className="block space-y-2" htmlFor={selectId}>{label && <span className="text-sm font-semibold text-healthcare-ink">{label}</span>}<select id={selectId} ref={ref} className={cn("h-11 w-full rounded-xl border border-healthcare-lilac bg-white px-4 text-sm font-medium text-healthcare-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10", className)} {...props}>{children}</select></label>;
});
Select.displayName = "Select";
