import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings/settings-form";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const name = typeof user.user_metadata.name === "string" ? user.user_metadata.name : "";
  return <main className="min-h-screen gradient-healthcare-soft p-6"><SettingsForm initialName={name} initialEmail={user.email ?? ""} /></main>;
}
