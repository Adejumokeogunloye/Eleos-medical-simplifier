import Link from "next/link";
import { HeartPulse, MessageCircleQuestion, Sparkles, Stethoscope } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SimplifiedReport } from "@/types/report";

export function ReportResults({ result }: { result: SimplifiedReport }) {
  return <section className="mx-auto max-w-3xl space-y-6 pb-10" aria-live="polite">
    <Card className="border-white/80 bg-white/90 shadow-healthcare backdrop-blur-xl">
      <CardHeader><span className="flex size-12 items-center justify-center rounded-2xl gradient-healthcare text-white"><Sparkles className="size-6" /></span><div><CardTitle>What this says</CardTitle><CardDescription>Your plain-language educational summary</CardDescription></div></CardHeader>
      <CardContent className="space-y-6 text-sm leading-7 text-healthcare-ink"><p>{result.summary}</p>
        {result.keyFindings.length > 0 && <div><h3 className="font-bold">What this might mean</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-healthcare-soft-ink">{result.keyFindings.map((finding, index) => <li key={index}>{finding}</li>)}</ul></div>}
        {result.termsExplained.length > 0 && <div><h3 className="font-bold">Terms explained</h3><dl className="mt-3 space-y-3">{result.termsExplained.map(({ term, explanation }) => <div key={term} className="rounded-xl bg-healthcare-lavender/70 p-3"><dt className="font-bold text-primary">{term}</dt><dd className="mt-1 text-healthcare-soft-ink">{explanation}</dd></div>)}</dl></div>}
        {result.questionsForDoctor.length > 0 && <div><h3 className="font-bold">Questions to ask your doctor</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-healthcare-soft-ink">{result.questionsForDoctor.map((question, index) => <li key={index}>{question}</li>)}</ul></div>}
      </CardContent>
    </Card>
    <div className="rounded-2xl border border-primary/15 bg-healthcare-lavender px-5 py-4 text-sm font-medium leading-6 text-healthcare-ink">{result.disclaimer}</div>
    <Card className="border-primary/15 bg-white/90"><CardHeader><span className="flex size-11 items-center justify-center rounded-xl bg-pink-50 text-healthcare-pink"><HeartPulse className="size-5" /></span><div><CardTitle>Want help putting this in context?</CardTitle><CardDescription>A doctor or pharmacist can help you understand how report wording relates to your personal health and medications.</CardDescription></div></CardHeader><CardContent><Button asChild variant="outline"><Link href="/consult"><Stethoscope className="size-4" />Talk to a doctor</Link></Button></CardContent></Card>
  </section>;
}
