import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function Home() {
  return <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground"><section className="max-w-xl space-y-6 text-center"><div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-6" /></div><h1 className="text-4xl font-bold tracking-tight">Next.js 14 starter</h1><p className="text-muted-foreground">TypeScript, Tailwind CSS, shadcn/ui, and the essentials are ready to go.</p><Button asChild><a href="https://nextjs.org/docs"><span>Start building</span><ArrowRight className="ml-2 size-4" /></a></Button></section></main>;
}
