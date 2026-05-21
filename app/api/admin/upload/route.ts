import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const jar = await cookies();
  if (jar.get("pmag_admin")?.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "webp";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const buffer = await file.arrayBuffer();
  const db = getSupabase();

  const { error } = await db.storage.from("media").upload(safeName, buffer, {
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = db.storage.from("media").getPublicUrl(safeName);
  return NextResponse.json({ url: data.publicUrl });
}
