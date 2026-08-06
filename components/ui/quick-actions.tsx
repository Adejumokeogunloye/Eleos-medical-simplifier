import { Activity, FileText, Info, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QuickActions({ className }: { className?: string }) {
  return <div className={cn("flex flex-wrap gap-3", className)}><Button asChild><a href="/dashboard/activity"><Activity className="size-4" />View activity</a></Button><Button asChild variant="secondary"><a href="/dashboard/history"><FileText className="size-4" />Records</a></Button><Button asChild variant="outline"><a href="/dashboard/analyze"><Upload className="size-4" />Upload file</a></Button><Button asChild variant="ghost"><a href="/about"><Info className="size-4" />Learn more</a></Button></div>;
}
