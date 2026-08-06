import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json() as { name?: unknown; email?: unknown };
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!name || name.length > 100) return NextResponse.json({ error: "Enter your name to join the interest list." }, { status: 400 });
    if (!emailPattern.test(email) || email.length > 254) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: "Interest notifications are not configured yet." }, { status: 503 });

    const { error } = await createAdminClient().from("consult_interest").upsert({ name, email }, { onConflict: "email" });
    if (error) return NextResponse.json({ error: "We couldn't save your request right now. Please try again later." }, { status: 502 });
    return NextResponse.json({ message: "You’re on the list. We’ll email you when this feature is ready." });
  } catch {
    return NextResponse.json({ error: "We couldn't save your request right now. Please try again later." }, { status: 500 });
  }
}
