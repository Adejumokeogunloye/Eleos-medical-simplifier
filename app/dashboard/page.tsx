import { HeartPulse, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <main className="min-h-screen gradient-healthcare-soft p-6"><section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-healthcare"><div className="flex size-12 items-center justify-center rounded-2xl gradient-healthcare text-white"><HeartPulse className="size-6" /></div><h1 className="mt-6 text-3xl font-extrabold text-healthcare-ink">Welcome to Eleos Medical</h1><p className="mt-2 text-healthcare-soft-ink">Signed in as {user?.email}.</p><div className="mt-8 flex items-start gap-3 rounded-2xl bg-healthcare-lavender p-4 text-sm font-medium text-healthcare-ink"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />Your dashboard is protected. Report uploads and AI summaries are not enabled yet.</div></section></main>;
}
