"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, CheckCircle2, ChevronDown, Download, HeartPulse, Save, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SimplifiedReport } from "@/types/report";

const reveal = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

export function ReportResults({ result, savedReportId, saveError }: { result: SimplifiedReport; savedReportId?: string | null; saveError?: string | null }) {
  const [openTerms, setOpenTerms] = useState<string[]>([]);
  const [checkedQuestions, setCheckedQuestions] = useState<number[]>([]);

  const toggleTerm = (term: string) => setOpenTerms((current) => current.includes(term) ? current.filter((item) => item !== term) : [...current, term]);
  const toggleQuestion = (index: number) => setCheckedQuestions((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);

  function downloadPdf() { window.print(); }

  return <motion.section initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }} className="mx-auto max-w-3xl space-y-6 pb-10" aria-live="polite">
    <motion.div variants={reveal}><Card className="border-white/80 bg-white/90 shadow-healthcare backdrop-blur-xl">
      <CardHeader><span className="flex size-12 items-center justify-center rounded-2xl gradient-healthcare text-white"><Sparkles className="size-6" /></span><div><CardTitle>What this says</CardTitle><CardDescription>Your plain-language educational summary</CardDescription></div></CardHeader>
      <CardContent className="space-y-6 text-sm leading-7 text-healthcare-ink"><p>{result.summary}</p>
        <div className="flex flex-wrap gap-3 print:hidden">{savedReportId && <Button asChild><Link href={`/dashboard/history/${savedReportId}`}><Save className="size-4" />Saved to history</Link></Button>}<Button variant="outline" onClick={downloadPdf}><Download className="size-4" />Download as PDF</Button></div>
        {saveError && <p role="alert" className="rounded-xl bg-pink-50 px-4 py-3 font-semibold text-healthcare-pink">{saveError}</p>}
      </CardContent>
    </Card></motion.div>

    {result.keyFindings.length > 0 && <motion.div variants={reveal}><Card><CardHeader><div><CardTitle>Key findings</CardTitle><CardDescription>What this might mean, in everyday language</CardDescription></div></CardHeader><CardContent><ul className="space-y-3">{result.keyFindings.map((finding, index) => <li key={index} className="flex gap-3 rounded-xl bg-healthcare-lavender/60 p-4 text-sm leading-6 text-healthcare-ink"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" /><span>{finding}</span></li>)}</ul></CardContent></Card></motion.div>}

    {result.termsExplained.length > 0 && <motion.div variants={reveal}><Card><CardHeader><div><CardTitle>Terms explained</CardTitle><CardDescription>Open a term to see its plain-language meaning.</CardDescription></div></CardHeader><CardContent className="space-y-3">{result.termsExplained.map(({ term, explanation }) => { const isOpen = openTerms.includes(term); return <div key={term} className="rounded-xl border border-healthcare-lilac"><button type="button" onClick={() => toggleTerm(term)} className="flex w-full items-center justify-between gap-4 p-4 text-left font-bold text-primary" aria-expanded={isOpen}><span>{term}</span><ChevronDown className={`size-5 transition-transform ${isOpen ? "rotate-180" : ""}`} /></button>{isOpen && <p className="border-t border-healthcare-lilac px-4 py-3 text-sm leading-6 text-healthcare-soft-ink">{explanation}</p>}</div>; })}</CardContent></Card></motion.div>}

    {result.questionsForDoctor.length > 0 && <motion.div variants={reveal}><Card><CardHeader><div><CardTitle>Questions to ask your doctor</CardTitle><CardDescription>Keep track of questions you may want to raise in a future conversation.</CardDescription></div></CardHeader><CardContent><ul className="space-y-3">{result.questionsForDoctor.map((question, index) => { const isChecked = checkedQuestions.includes(index); return <li key={index}><button type="button" onClick={() => toggleQuestion(index)} className="flex w-full items-start gap-3 rounded-xl p-2 text-left text-sm leading-6 text-healthcare-ink hover:bg-healthcare-lavender/70"><span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border ${isChecked ? "border-primary bg-primary text-white" : "border-healthcare-lilac bg-white"}`}>{isChecked && <Check className="size-3.5" />}</span><span className={isChecked ? "text-healthcare-soft-ink line-through" : ""}>{question}</span></button></li>; })}</ul></CardContent></Card></motion.div>}

    <motion.div variants={reveal} className="flex gap-3 rounded-2xl border-2 border-healthcare-pink/30 bg-gradient-to-r from-healthcare-lavender to-pink-50 px-5 py-5 text-sm font-semibold leading-6 text-healthcare-ink"><ShieldCheck className="mt-0.5 size-6 shrink-0 text-primary" /><p>{result.disclaimer}</p></motion.div>
    <motion.div variants={reveal}><Card className="border-primary/15 bg-white/90"><CardHeader><span className="flex size-11 items-center justify-center rounded-xl bg-pink-50 text-healthcare-pink"><HeartPulse className="size-5" /></span><div><CardTitle>Want help putting this in context?</CardTitle><CardDescription>A doctor or pharmacist can help you understand how report wording relates to your personal health and medications.</CardDescription></div></CardHeader><CardContent><Button asChild variant="outline"><Link href="/consult"><Stethoscope className="size-4" />Talk to a doctor</Link></Button></CardContent></Card></motion.div>
  </motion.section>;
}
