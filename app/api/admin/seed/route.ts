import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";
import { mozelloPosts } from "@/lib/mozello-posts";

async function isAdmin() {
  const jar = await cookies();
  return jar.get("pmag_admin")?.value === process.env.ADMIN_PASSWORD;
}

export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const db = getSupabase();
  const rows = mozelloPosts.map((post) => ({
    id: post.id,
    slug: post.slug,
    category: post.category,
    status: post.status,
    cover_image: post.coverImage,
    featured: post.featured,
    published_at: post.publishedAt,
    created_at: post.createdAt,
    updated_at: post.updatedAt,
    translations: post.translations,
  }));

  const { error } = await db.from("posts").upsert(rows);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, count: rows.length });
}
