import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = request.nextUrl.searchParams.get("next") ?? "/dashboard";
  let destination = next.startsWith("/") ? next : "/dashboard";
  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = user ? await supabase.from("users").select("onboarding_completed").eq("id", user.id).maybeSingle() : { data: null };
    if (destination === "/onboarding" && profile?.onboarding_completed) destination = "/dashboard";
  }
  return NextResponse.redirect(new URL(destination, request.url));
}
