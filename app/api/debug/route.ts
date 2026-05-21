import { NextResponse } from "next/server";
import { fetchPublishedPosts } from "@/lib/db";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    const posts = await fetchPublishedPosts();
    return NextResponse.json({ ok: true, count: posts.length, url: url ?? "missing", keyPrefix: key?.slice(0, 12) ?? "missing" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err), url: url ?? "missing", keyPrefix: key?.slice(0, 12) ?? "missing" }, { status: 500 });
  }
}
