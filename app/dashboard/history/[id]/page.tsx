import { notFound } from "next/navigation";
import { SavedReportDetail } from "@/components/history/saved-report-detail";
import { createClient } from "@/lib/supabase/server";
import type { SimplifiedReport } from "@/types/report";

type SavedReport = { id: string; report_type: string; simplified_summary_json: SimplifiedReport };

export default async function SavedReportPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();
  const { data } = await supabase.from("reports").select("id, report_type, simplified_summary_json").eq("id", params.id).eq("user_id", user.id).maybeSingle();
  if (!data) notFound();
  const report = data as unknown as SavedReport;
  return <main className="min-h-screen gradient-healthcare-soft p-6"><SavedReportDetail id={report.id} reportType={report.report_type} result={report.simplified_summary_json} /></main>;
}
