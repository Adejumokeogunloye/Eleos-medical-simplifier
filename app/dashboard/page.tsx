import { HeartPulse, ShieldCheck } from "lucide-react";
import { QuickActions } from "@/components/ui/quick-actions";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user ? await supabase.from("users").select("report_preference, onboarding_completed").eq("id", user.id).maybeSingle() : { data: null };
  return <main className="min-h-screen gradient-healthcare-soft p-6"><section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-healthcare"><div className="flex size-12 items-center justify-center rounded-2xl gradient-healthcare text-white"><HeartPulse className="size-6" /></div><h1 className="mt-6 text-3xl font-extrabold text-healthcare-ink">Welcome to Eleos Medical</h1><p className="mt-2 text-healthcare-soft-ink">Signed in as {user?.email}.</p>{profile?.report_preference && <p className="mt-5 rounded-2xl bg-healthcare-lavender p-4 text-sm font-semibold text-primary">Your dashboard is tailored for {profile.report_preference.toLowerCase()} reports.</p>}{!profile?.onboarding_completed && <a href="/onboarding" className="mt-5 inline-flex text-sm font-bold text-primary hover:underline">Complete your dashboard setup</a>}<div className="mt-8 border-t border-healthcare-lilac pt-7"><h2 className="text-lg font-bold text-healthcare-ink">Quick actions</h2><p className="mt-1 text-sm text-healthcare-soft-ink">Choose where you would like to go next.</p><QuickActions className="mt-4" /></div><div className="mt-8 flex items-start gap-3 rounded-2xl bg-healthcare-lavender p-4 text-sm font-medium text-healthcare-ink"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />Your dashboard is protected. Report uploads and AI summaries are not enabled yet.</div></section></main>;
}
