"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, FileText, LoaderCircle, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { SimplifiedReport } from "@/types/report";

type ReportListItem = { id: string; report_type: string; original_filename: string; simplified_summary_json: SimplifiedReport; created_at: string };

export default function HistoryPage() {
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { let isActive = true; fetch("/api/reports").then(async (response) => { const data = await response.json() as { reports?: ReportListItem[]; error?: string }; if (!response.ok) throw new Error(data.error ?? "We couldn't load your report history."); if (isActive) setReports(data.reports ?? []); }).catch((caughtError) => { if (isActive) setError(caughtError instanceof Error ? caughtError.message : "We couldn't load your report history."); }).finally(() => { if (isActive) setIsLoading(false); }); return () => { isActive = false; }; }, []);

  const types = useMemo(() => Array.from(new Set(reports.map((report) => report.report_type))), [reports]);
  const filteredReports = useMemo(() => { const now = Date.now(); const rangeMs = dateRange === "7" ? 7 * 86400000 : dateRange === "30" ? 30 * 86400000 : 0; return reports.filter((report) => { const matchesSearch = `${report.original_filename} ${report.simplified_summary_json.summary}`.toLowerCase().includes(search.toLowerCase()); const matchesType = type === "all" || report.report_type === type; const matchesDate = !rangeMs || now - new Date(report.created_at).getTime() <= rangeMs; return matchesSearch && matchesType && matchesDate; }); }, [dateRange, reports, search, type]);

  return <main className="min-h-screen gradient-healthcare-soft p-6"><section className="mx-auto max-w-3xl space-y-5"><div><h1 className="text-3xl font-bold text-healthcare-ink">Your report history</h1><p className="mt-2 text-healthcare-soft-ink">Your saved report text and educational summaries are private to your account.</p></div><Card><CardContent className="grid gap-4 pt-6 sm:grid-cols-3"><Input label="Search reports" placeholder="File name or summary" icon={<Search className="size-4" />} value={search} onChange={(event) => setSearch(event.target.value)} /><Select label="Report type" value={type} onChange={(event) => setType(event.target.value)}><option value="all">All types</option>{types.map((reportType) => <option key={reportType} value={reportType}>{reportType}</option>)}</Select><Select label="Saved date" value={dateRange} onChange={(event) => setDateRange(event.target.value)}><option value="all">Any time</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option></Select></CardContent></Card>{isLoading && <div className="flex justify-center py-12 text-primary"><LoaderCircle className="size-6 animate-spin" /></div>}{error && <p role="alert" className="rounded-xl bg-pink-50 px-4 py-3 text-sm font-semibold text-healthcare-pink">{error}</p>}{!isLoading && !error && filteredReports.length === 0 && <Card className="text-center"><span className="mx-auto flex size-12 items-center justify-center rounded-2xl gradient-healthcare text-white"><FileText className="size-6" /></span><CardTitle className="mt-6">No matching reports</CardTitle><CardDescription className="mt-2">Your saved reports will appear here after you analyze a file.</CardDescription></Card>}{filteredReports.map((report) => <Link key={report.id} href={`/dashboard/history/${report.id}`} className="block"><Card className="transition hover:-translate-y-0.5 hover:shadow-lg"><CardHeader><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-healthcare-lavender text-primary"><FileText className="size-5" /></span><div className="min-w-0"><CardTitle className="truncate">{report.original_filename}</CardTitle><CardDescription className="mt-1 flex items-center gap-1"><CalendarDays className="size-3.5" />{report.report_type} · {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(report.created_at))}</CardDescription></div></CardHeader><CardContent><p className="line-clamp-2 text-sm leading-6 text-healthcare-soft-ink">{report.simplified_summary_json.summary}</p></CardContent></Card></Link>)}</section></main>;
}
