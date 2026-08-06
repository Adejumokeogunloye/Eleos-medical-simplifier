"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, LoaderCircle, ShieldCheck, Stethoscope } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase/client";

const preferences = ["X-ray", "Lab Report", "Discharge Summary", "Imaging"] as const;

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [preference, setPreference] = useState<(typeof preferences)[number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function finish() {
    if (!preference) { setError("Choose the report type you review most often."); return; }
    setLoading(true); setError(null);
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) { setError("Your session has expired. Please sign in again."); setLoading(false); return; }
    const { error: updateError } = await supabase.from("users").update({ report_preference: preference, onboarding_completed: true }).eq("id", user.id);
    if (updateError) { setError(updateError.message); setLoading(false); return; }
    router.push("/dashboard");
  }

  return <div className="w-full max-w-lg"><div className="mb-7 flex items-center justify-between"><a href="/" className="flex items-center gap-2 font-extrabold text-healthcare-ink"><span className="flex size-9 items-center justify-center rounded-xl gradient-healthcare text-white"><Stethoscope className="size-5" /></span>Eleos Medical</a><p className="text-sm font-semibold text-healthcare-soft-ink">Step {step} of 2</p></div><div className="mb-6 h-2 overflow-hidden rounded-full bg-healthcare-lilac"><motion.div className="h-full gradient-healthcare" animate={{ width: `${step * 50}%` }} transition={{ duration: 0.35 }} /></div><Card className="min-h-[390px] border-white/80 bg-white/90 shadow-healthcare backdrop-blur-xl"><CardHeader><span className="flex size-11 items-center justify-center rounded-2xl gradient-healthcare text-white">{step === 1 ? <ShieldCheck className="size-5" /> : <FileText className="size-5" />}</span><CardTitle className="mt-4 text-2xl">{step === 1 ? "A quick note before we begin" : "Make your dashboard yours"}</CardTitle><CardDescription>{step === 1 ? "Please confirm how Eleos Medical is designed to help." : "This helps us tailor your dashboard. You can change it later."}</CardDescription></CardHeader><CardContent><AnimatePresence mode="wait"><motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }} className="space-y-5">{step === 1 ? <><div className="rounded-2xl bg-healthcare-lavender p-4 text-sm leading-6 text-healthcare-ink">Eleos Medical explains medical report wording in clearer language. It does not diagnose, treat, or replace a doctor.</div><label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-healthcare-lilac p-4"><Checkbox checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /><span className="text-sm font-semibold leading-6 text-healthcare-ink">I understand this tool is educational only and does not replace medical advice from a doctor.</span></label><Button className="w-full" disabled={!confirmed} onClick={() => setStep(2)}>Continue <ArrowRight className="size-4" /></Button></> : <><div className="grid gap-3 sm:grid-cols-2">{preferences.map((item) => <button key={item} type="button" onClick={() => { setPreference(item); setError(null); }} className={`rounded-2xl border p-4 text-left text-sm font-bold transition ${preference === item ? "border-primary bg-healthcare-lavender text-primary ring-2 ring-primary/15" : "border-healthcare-lilac bg-white text-healthcare-ink hover:bg-healthcare-lavender"}`}><CheckCircle2 className={`mb-3 size-5 ${preference === item ? "text-primary" : "text-healthcare-soft-ink"}`} />{item}</button>)}</div>{error && <p className="rounded-xl bg-pink-50 px-3 py-2 text-sm font-medium text-healthcare-pink" role="alert">{error}</p>}<div className="flex gap-3"><Button variant="outline" onClick={() => setStep(1)} disabled={loading}><ArrowLeft className="size-4" />Back</Button><Button className="flex-1" onClick={finish} disabled={loading}>{loading ? <><LoaderCircle className="size-4 animate-spin" />Saving</> : <>Finish setup <ArrowRight className="size-4" /></>}</Button></div></>}</motion.div></AnimatePresence></CardContent></Card></div>;
}
