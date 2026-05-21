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
  try {
    const posts = await fetchAllPosts();
    return NextResponse.json(posts);
  } catch (err) {
    console.error("[admin/posts] GET failed", err);
    return NextResponse.json(
      { error: "No se pudieron cargar los posts", detail: getErrorDetail(err) },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const post = (await req.json()) as BlogPost;
    await upsertPost(post);
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/posts] POST failed", err);
    return NextResponse.json(
      { error: "No se pudo crear el post", detail: getErrorDetail(err) },
      { status: 500 },
    );
  }
}

function getErrorDetail(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    return String((err as { message?: unknown }).message);
  }
  return String(err);
}
