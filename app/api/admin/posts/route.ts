import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { fetchAllPosts, upsertPost } from "@/lib/db";
import { BlogPost } from "@/lib/content-types";

async function isAdmin() {
  const jar = await cookies();
  return jar.get("pmag_admin")?.value === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const posts = await fetchAllPosts();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const post = (await req.json()) as BlogPost;
  await upsertPost(post);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
