import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { upsertPost, removePost } from "@/lib/db";
import { BlogPost } from "@/lib/content-types";

async function isAdmin() {
  const jar = await cookies();
  return jar.get("pmag_admin")?.value === process.env.ADMIN_PASSWORD;
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const post = (await req.json()) as BlogPost;
  await upsertPost(post);
  revalidatePath("/");
  revalidatePath(`/posts/${post.slug}`);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  await removePost(id);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
