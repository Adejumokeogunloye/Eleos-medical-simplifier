import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { REPORT_DISCLAIMER, type SimplifiedReport } from "@/types/report";

type CreateReportRequest = { reportType?: unknown; originalFilename?: unknown; extractedText?: unknown; result?: Partial<SimplifiedReport> };

function isSummary(value: Partial<SimplifiedReport> | undefined): value is SimplifiedReport {
  return Boolean(value?.summary && Array.isArray(value.keyFindings) && Array.isArray(value.termsExplained) && Array.isArray(value.questionsForDoctor));
}

async function currentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function GET() {
  const { supabase, user } = await currentUser();
  if (!user) return NextResponse.json({ error: "Please log in to view your saved reports." }, { status: 401 });
  const { data, error } = await supabase.from("reports").select("id, report_type, original_filename, simplified_summary_json, created_at").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "We couldn't load your report history right now." }, { status: 502 });
  return NextResponse.json({ reports: data });
}

export async function POST(request: Request) {
  try {
    const { reportType, originalFilename, extractedText, result } = await request.json() as CreateReportRequest;
    if (typeof reportType !== "string" || typeof originalFilename !== "string" || typeof extractedText !== "string" || !isSummary(result)) {
      return NextResponse.json({ error: "This report is not ready to save." }, { status: 400 });
    }
    const { supabase, user } = await currentUser();
    if (!user) return NextResponse.json({ error: "Please log in to save a report." }, { status: 401 });

    const savedSummary: SimplifiedReport = { ...result, disclaimer: REPORT_DISCLAIMER };
    const { data, error } = await supabase.from("reports").insert({ user_id: user.id, report_type: reportType, original_filename: originalFilename, extracted_text: extractedText, simplified_summary_json: savedSummary }).select("id").single();
    if (error) return NextResponse.json({ error: "We couldn't save this report right now. Please try again." }, { status: 502 });
    return NextResponse.json({ id: data.id, message: "Report saved to your history." });
  } catch {
    return NextResponse.json({ error: "We couldn't save this report right now. Please try again." }, { status: 500 });
  }
}
