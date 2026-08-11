"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ReportResults } from "@/components/results/report-results";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import type { SimplifiedReport } from "@/types/report";

export function SavedReportDetail({ id, reportType, result }: { id: string; reportType: string; result: SimplifiedReport }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteReport() {
    setIsDeleting(true); setError(null);
    try {
      const response = await fetch(`/api/reports/${id}`, { method: "DELETE" });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "We couldn't delete this report right now.");
      router.push("/dashboard/history"); router.refresh();
    } catch (caughtError) { setError(caughtError instanceof Error ? caughtError.message : "We couldn't delete this report right now."); setIsDeleting(false); setIsOpen(false); }
  }

  return <><div className="mx-auto mb-5 flex max-w-3xl items-center justify-between gap-4"><div><p className="text-sm font-semibold text-primary">Saved {reportType} report</p><h1 className="text-3xl font-bold text-healthcare-ink">Your educational summary</h1></div><Button variant="outline" onClick={() => setIsOpen(true)} className="border-healthcare-pink/30 text-healthcare-pink hover:bg-pink-50"><Trash2 className="size-4" />Delete</Button></div>{error && <p role="alert" className="mx-auto mb-5 max-w-3xl rounded-xl bg-pink-50 px-4 py-3 text-sm font-semibold text-healthcare-pink">{error}</p>}<ReportResults result={result} /><ConfirmDialog open={isOpen} title="Delete this saved report?" description="This permanently removes the saved report text and educational summary from your history." confirmLabel="Delete report" isConfirming={isDeleting} onCancel={() => setIsOpen(false)} onConfirm={deleteReport} /></>;
}
