import { FileText } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function HistoryPage() { return <main className="min-h-screen gradient-healthcare-soft p-6"><Card className="mx-auto max-w-2xl text-center"><span className="mx-auto flex size-12 items-center justify-center rounded-2xl gradient-healthcare text-white"><FileText className="size-6" /></span><CardTitle className="mt-6">Your report history</CardTitle><CardDescription className="mt-2">No reports have been saved yet. When report history is enabled, your completed summaries will appear here.</CardDescription></Card></main>; }
