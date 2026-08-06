import * as React from "react";
import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => <input ref={ref} type="checkbox" className={cn("size-5 shrink-0 rounded border-healthcare-lilac text-primary accent-primary focus:ring-2 focus:ring-primary/30", className)} {...props} />);
Checkbox.displayName = "Checkbox";
