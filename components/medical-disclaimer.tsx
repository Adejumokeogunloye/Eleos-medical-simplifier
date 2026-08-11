import { ShieldCheck } from "lucide-react";
import { REPORT_DISCLAIMER } from "@/types/report";

export function MedicalDisclaimer() {
  return <aside className="border-t border-primary/20 bg-healthcare-lavender/80 px-5 py-3" aria-label="Medical disclaimer"><div className="mx-auto flex max-w-5xl items-start justify-center gap-2 text-center text-xs font-semibold leading-5 text-healthcare-ink"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-healthcare-purple-ink" aria-hidden="true" /><p>{REPORT_DISCLAIMER}</p></div></aside>;
}
