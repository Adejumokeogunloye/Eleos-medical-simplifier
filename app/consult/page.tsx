"use client";

import { FormEvent, useState } from "react";
import { BellRing, HeartHandshake, LoaderCircle, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ConsultPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null); setMessage(null); setIsSubmitting(true);
    try {
      const response = await fetch("/api/consult-interest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email }) });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error ?? "We couldn't save your request right now.");
      setMessage(result.message ?? "You’re on the list."); setName(""); setEmail("");
    } catch (caughtError) { setError(caughtError instanceof Error ? caughtError.message : "We couldn't save your request right now."); }
    finally { setIsSubmitting(false); }
  }

  return <main className="min-h-screen bg-healthcare-lavender/40 px-5 py-16 sm:py-24"><Card className="mx-auto max-w-lg border-white/80 bg-white/90 shadow-healthcare backdrop-blur-xl"><CardHeader><span className="flex size-14 items-center justify-center rounded-2xl gradient-healthcare text-white"><HeartHandshake className="size-7" /></span><div><CardTitle className="mt-4 text-2xl">Consultations are coming soon</CardTitle><CardDescription className="mt-2">Eleos Medical does not offer live doctor chat today, and no licensed providers are connected through this page.</CardDescription></div></CardHeader><CardContent className="space-y-6"><div className="rounded-2xl bg-healthcare-lavender p-4 text-sm leading-6 text-healthcare-ink"><Stethoscope className="mb-2 size-5 text-primary" /><p>We’re exploring a future option to help you find the right kind of professional conversation. Join the interest list and we’ll let you know if that launches.</p></div><form className="space-y-4" onSubmit={submit}><Input label="Name" value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" /><Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />{error && <p role="alert" className="rounded-xl bg-pink-50 px-4 py-3 text-sm font-semibold text-healthcare-pink">{error}</p>}{message && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-healthcare-success">{message}</p>}<Button className="w-full" type="submit" disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className="size-4 animate-spin" />Saving your request</> : <><BellRing className="size-4" />Notify me when this launches</>}</Button></form><p className="text-xs leading-5 text-healthcare-soft-ink">This form only records your request for future updates. Please do not include report details or other medical information.</p></CardContent></Card></main>;
}
