import type { Metadata } from "next";
import "./globals.css";
import { PageTransition } from "@/components/page-transition";
import { MedicalDisclaimer } from "@/components/medical-disclaimer";
import { ToastProvider } from "@/components/ui/toast";
export const metadata: Metadata = { title: "Eleos Medical", description: "A plain-language medical report simplifier." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" /></head><body><a href="#main-content" className="sr-only fixed left-4 top-4 z-[70] rounded-lg bg-white px-4 py-2 font-semibold text-healthcare-purple-ink shadow-healthcare focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-primary">Skip to main content</a><ToastProvider><PageTransition>{children}</PageTransition><MedicalDisclaimer /></ToastProvider></body></html>; }
