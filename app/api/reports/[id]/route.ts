import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in to delete a report." }, { status: 401 });
  const { error } = await supabase.from("reports").delete().eq("id", params.id).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: "We couldn't delete this report right now. Please try again." }, { status: 502 });
  return NextResponse.json({ message: "Report deleted." });
}
