"use client";

import { motion } from "framer-motion";
import { ArrowRight, Eye, HeartPulse, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup" | "forgot" | "update";
const copy = { login: ["Welcome back", "Sign in to continue to Eleos Medical."], signup: ["Create your account", "A clearer way to understand your reports starts here."], forgot: ["Reset your password", "We will email you a secure reset link."], update: ["Choose a new password", "Use a secure password you have not used before."] } as const;

export function AuthCard({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isSignup = mode === "signup";
  const hasPassword = mode === "login" || isSignup || mode === "update";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null); setMessage(null);
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");
    if (mode !== "update" && !email) { setError("Enter your email address."); return; }
    if (hasPassword && password.length < 8) { setError("Your password must be at least 8 characters."); return; }
    if ((isSignup || mode === "update") && password !== confirmPassword) { setError("Your passwords do not match."); return; }
    setLoading(true);
    const supabase = createClient();
    if (isSignup) {
      const { error: authError } = await supabase.auth.signUp({ email, password, options: { data: { name: String(data.get("name") ?? "").trim() }, emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding` } });
      if (authError) setError(authError.message); else setMessage("Check your email to confirm your account, then sign in.");
    } else if (mode === "login") {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) { setError(authError.message); } else {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: profile } = user ? await supabase.from("users").select("onboarding_completed").eq("id", user.id).maybeSingle() : { data: null };
        router.push(profile?.onboarding_completed ? new URLSearchParams(window.location.search).get("next") || "/dashboard" : "/onboarding");
      }
    } else if (mode === "forgot") {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/callback?next=/update-password` });
      if (authError) setError(authError.message); else setMessage("If that email has an account, a reset link is on its way.");
    } else {
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) setError(authError.message); else { setMessage("Password updated. Redirecting to your dashboard..."); router.push("/dashboard"); }
    }
    setLoading(false);
  }

  async function googleSignIn() {
    setError(null); setLoading(true);
    const { error: authError } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback?next=/onboarding` } });
    if (authError) { setError(authError.message); setLoading(false); }
  }

  const [title, subtitle] = copy[mode];
  return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="w-full max-w-md"><a href="/" className="mb-6 flex items-center justify-center gap-2 text-lg font-extrabold tracking-tight text-healthcare-ink"><span className="flex size-9 items-center justify-center rounded-xl gradient-healthcare text-white shadow-healthcare"><HeartPulse className="size-5" /></span>Eleos Medical</a><Card className="border-white/80 bg-white/85 shadow-healthcare backdrop-blur-xl"><CardHeader><span className="flex size-11 items-center justify-center rounded-2xl gradient-healthcare text-white"><HeartPulse className="size-5" /></span><CardTitle className="mt-4 text-2xl">{title}</CardTitle><CardDescription>{subtitle}</CardDescription></CardHeader><CardContent><form className="space-y-4" onSubmit={submit}>{isSignup && <Input name="name" label="Full name" placeholder="Your name" icon={<UserRound className="size-4" />} required />}{mode !== "update" && <Input name="email" label="Email address" type="email" placeholder="you@example.com" icon={<Mail className="size-4" />} required />}{hasPassword && <Input name="password" label="Password" type="password" placeholder="At least 8 characters" icon={<LockKeyhole className="size-4" />} required />}{(isSignup || mode === "update") && <Input name="confirmPassword" label="Confirm password" type="password" placeholder="Repeat your password" icon={<Eye className="size-4" />} required />}{error && <p className="rounded-xl bg-pink-50 px-3 py-2 text-sm font-medium text-healthcare-pink" role="alert">{error}</p>}{message && <p className="rounded-xl bg-healthcare-lavender px-3 py-2 text-sm font-medium text-primary" role="status">{message}</p>}<Button className="w-full" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="size-4 animate-spin" />Please wait</> : <>{mode === "forgot" ? "Send reset link" : mode === "update" ? "Update password" : mode === "signup" ? "Create account" : "Sign in"}<ArrowRight className="size-4" /></>}</Button></form>{(mode === "login" || isSignup) && <><div className="my-5 flex items-center gap-3 text-xs font-medium text-healthcare-soft-ink"><span className="h-px flex-1 bg-healthcare-lilac" />OR<span className="h-px flex-1 bg-healthcare-lilac" /></div><Button className="w-full" type="button" variant="outline" disabled={loading} onClick={googleSignIn}>Continue with Google</Button></>}<div className="mt-6 text-center text-sm text-healthcare-soft-ink">{mode === "login" && <><a className="font-semibold text-primary hover:underline" href="/forgot-password">Forgot password?</a><span className="mx-2">·</span><a className="font-semibold text-primary hover:underline" href="/signup">Create account</a></>}{mode === "signup" && <a className="font-semibold text-primary hover:underline" href="/login">Already have an account? Sign in</a>}{mode === "forgot" && <a className="font-semibold text-primary hover:underline" href="/login">Back to sign in</a>}</div></CardContent></Card></motion.div>;
}
