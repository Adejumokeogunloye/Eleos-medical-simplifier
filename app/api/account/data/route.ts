import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in to delete your reports." }, { status: 401 });
  const { error } = await supabase.from("reports").delete().eq("user_id", user.id);
  if (error) return NextResponse.json({ error: "We couldn't delete your saved reports right now. Please try again." }, { status: 502 });
  return NextResponse.json({ message: "Your saved reports have been deleted." });
}
