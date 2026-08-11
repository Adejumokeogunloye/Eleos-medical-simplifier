import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function AuthFooter() {
  return <footer className="border-t border-healthcare-lilac bg-white/90 px-5 py-3 text-center backdrop-blur" aria-label="Medical-use notice"><div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-healthcare-soft-ink"><span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-healthcare-lavender px-2.5 py-1 font-semibold text-healthcare-purple-ink"><ShieldCheck className="size-3.5" aria-hidden="true" />Not a medical device · Educational use only</span><Link href="/privacy" className="font-semibold text-healthcare-purple-ink underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Disclaimer &amp; privacy</Link></div></footer>;
}
