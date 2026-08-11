import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type AccountUpdate = { action?: unknown; name?: unknown; email?: unknown; password?: unknown };

async function authenticatedUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json() as AccountUpdate;
    const { supabase, user } = await authenticatedUser();
    if (!user) return NextResponse.json({ error: "Please log in to update your account." }, { status: 401 });

    if (body.action === "profile") {
      const name = typeof body.name === "string" ? body.name.trim() : "";
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      if (!name || name.length > 100) return NextResponse.json({ error: "Enter a name with no more than 100 characters." }, { status: 400 });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
      const { error } = await supabase.auth.updateUser({ email, data: { name } });
      if (error) return NextResponse.json({ error: "We couldn't update your profile right now. Please try again." }, { status: 502 });
      return NextResponse.json({ message: email === user.email ? "Your name has been updated." : "Your profile has been updated. Check your email to confirm the new address." });
    }

    if (body.action === "password") {
      const password = typeof body.password === "string" ? body.password : "";
      if (password.length < 8) return NextResponse.json({ error: "Use a password with at least 8 characters." }, { status: 400 });
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return NextResponse.json({ error: "We couldn't change your password right now. Please try again." }, { status: 502 });
      return NextResponse.json({ message: "Your password has been changed." });
    }

    return NextResponse.json({ error: "Unknown account update." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "We couldn't update your account right now. Please try again." }, { status: 500 });
  }
}

export async function DELETE() {
  const { user } = await authenticatedUser();
  if (!user) return NextResponse.json({ error: "Please log in to delete your account." }, { status: 401 });
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: "Account deletion is not configured yet." }, { status: 503 });

  const admin = createAdminClient();
  // This optional interest-list record is not linked by user_id, so remove it before deleting the account.
  if (user.email) await admin.from("consult_interest").delete().eq("email", user.email);
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: "We couldn't delete your account right now. Please try again." }, { status: 502 });
  return NextResponse.json({ message: "Your account has been deleted." });
}
