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
  try {
    const post = (await req.json()) as BlogPost;
    await upsertPost(post);
    revalidatePath("/");
    revalidatePath(`/posts/${post.slug}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/posts] PUT failed", err);
    return NextResponse.json(
      { error: "No se pudo guardar el post", detail: getErrorDetail(err) },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await removePost(id);
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/posts] DELETE failed", err);
    return NextResponse.json(
      { error: "No se pudo eliminar el post", detail: getErrorDetail(err) },
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
