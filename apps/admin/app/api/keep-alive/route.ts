import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  await supabase.from("categories").select("id").limit(1);
  return NextResponse.json({ ok: true, pinged_at: new Date().toISOString() });
}
