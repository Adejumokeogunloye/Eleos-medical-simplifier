"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LoaderCircle, Mail, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

type SettingsFormProps = { initialName: string; initialEmail: string };

export function SettingsForm({ initialName, initialEmail }: SettingsFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<"profile" | "password" | "data" | "account" | null>(null);
  const [confirm, setConfirm] = useState<"data" | "account" | null>(null);

  async function update(event: FormEvent<HTMLFormElement>, action: "profile" | "password") {
    event.preventDefault(); setError(null); setMessage(null); setLoadingAction(action);
    try {
      const body = action === "profile" ? { action, name, email } : { action, password: newPassword };
      const response = await fetch("/api/account", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error ?? "We couldn't update your account right now.");
      const nextMessage = result.message ?? "Your account has been updated."; setMessage(nextMessage); toast({ variant: "success", title: "Account updated", description: nextMessage }); if (action === "password") setNewPassword("");
    } catch (caughtError) { const nextError = caughtError instanceof Error ? caughtError.message : "We couldn't update your account right now."; setError(nextError); toast({ variant: "error", title: "Update couldn’t be saved", description: nextError }); }
    finally { setLoadingAction(null); }
  }

  async function deleteData() {
    setLoadingAction("data"); setError(null); setMessage(null);
    try { const response = await fetch("/api/account/data", { method: "DELETE" }); const result = await response.json() as { error?: string; message?: string }; if (!response.ok) throw new Error(result.error ?? "We couldn't delete your saved reports."); const nextMessage = result.message ?? "Your saved reports have been deleted."; setMessage(nextMessage); toast({ variant: "success", title: "Report data deleted", description: nextMessage }); setConfirm(null); }
    catch (caughtError) { const nextError = caughtError instanceof Error ? caughtError.message : "We couldn't delete your saved reports."; setError(nextError); toast({ variant: "error", title: "Data couldn’t be deleted", description: nextError }); setConfirm(null); }
    finally { setLoadingAction(null); }
  }

  async function deleteAccount() {
    setLoadingAction("account"); setError(null); setMessage(null);
    try { const response = await fetch("/api/account", { method: "DELETE" }); const result = await response.json() as { error?: string }; if (!response.ok) throw new Error(result.error ?? "We couldn't delete your account."); router.replace("/"); router.refresh(); }
    catch (caughtError) { setError(caughtError instanceof Error ? caughtError.message : "We couldn't delete your account."); setConfirm(null); setLoadingAction(null); }
  }

  return <section className="mx-auto max-w-3xl space-y-6"><div><p className="text-sm font-bold text-primary">Eleos Medical</p><h1 className="mt-1 text-3xl font-bold text-healthcare-ink">Settings</h1><p className="mt-2 text-healthcare-soft-ink">Manage your account and the information you choose to keep.</p></div>{error && <p role="alert" className="rounded-xl bg-pink-50 px-4 py-3 text-sm font-semibold text-healthcare-pink">{error}</p>}{message && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-healthcare-success">{message}</p>}
    <Card><CardHeader><span className="flex size-11 items-center justify-center rounded-xl bg-healthcare-lavender text-primary"><UserRound className="size-5" /></span><div><CardTitle>Profile</CardTitle><CardDescription>Update the name and email address connected to your account.</CardDescription></div></CardHeader><CardContent><form onSubmit={(event) => update(event, "profile")} className="space-y-4"><Input label="Name" value={name} onChange={(event) => setName(event.target.value)} icon={<UserRound className="size-4" />} required /><Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} icon={<Mail className="size-4" />} required /><Button type="submit" disabled={loadingAction === "profile"}>{loadingAction === "profile" && <LoaderCircle className="size-4 animate-spin" />}Save profile</Button></form></CardContent></Card>
    <Card><CardHeader><span className="flex size-11 items-center justify-center rounded-xl bg-healthcare-lavender text-primary"><KeyRound className="size-5" /></span><div><CardTitle>Change password</CardTitle><CardDescription>Choose a new password with at least 8 characters.</CardDescription></div></CardHeader><CardContent><form onSubmit={(event) => update(event, "password")} className="space-y-4"><Input label="New password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" required minLength={8} /><Button type="submit" disabled={loadingAction === "password"}>{loadingAction === "password" && <LoaderCircle className="size-4 animate-spin" />}Change password</Button></form></CardContent></Card>
    <Card className="border-primary/15"><CardHeader><span className="flex size-11 items-center justify-center rounded-xl bg-healthcare-lavender text-primary"><ShieldCheck className="size-5" /></span><div><CardTitle>Data privacy</CardTitle><CardDescription>Your reports are private to your account through Supabase row-level security.</CardDescription></div></CardHeader><CardContent className="space-y-4 text-sm leading-6 text-healthcare-ink"><p>Eleos stores your account name and email. When you analyze a report, it stores the original filename, extracted report text, report type, and simplified educational summary so you can revisit it in history. Uploaded files themselves are not retained.</p><Button variant="outline" onClick={() => setConfirm("data")} disabled={loadingAction === "data"} className="border-healthcare-pink/30 text-healthcare-pink hover:bg-pink-50"><Trash2 className="size-4" />Delete all my report data</Button></CardContent></Card>
    <Card className="border-healthcare-pink/30"><CardHeader><span className="flex size-11 items-center justify-center rounded-xl bg-pink-50 text-healthcare-pink"><Trash2 className="size-5" /></span><div><CardTitle>Delete account</CardTitle><CardDescription>This permanently deletes your account, profile, and saved reports.</CardDescription></div></CardHeader><CardContent><Button variant="outline" onClick={() => setConfirm("account")} disabled={loadingAction === "account"} className="border-healthcare-pink/30 text-healthcare-pink hover:bg-pink-50"><Trash2 className="size-4" />Delete account</Button></CardContent></Card>
    <ConfirmDialog open={confirm === "data"} title="Delete all saved report data?" description="This permanently deletes every saved report, extracted text, and educational summary in your history. Your account will remain active." confirmLabel="Delete my data" isConfirming={loadingAction === "data"} onCancel={() => setConfirm(null)} onConfirm={deleteData} /><ConfirmDialog open={confirm === "account"} title="Delete your account?" description="This permanently removes your account, profile, and saved reports. This action cannot be undone." confirmLabel="Delete account" isConfirming={loadingAction === "account"} onCancel={() => setConfirm(null)} onConfirm={deleteAccount} />
  </section>;
}
