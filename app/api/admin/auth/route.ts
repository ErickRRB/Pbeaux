import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE = "pmag_admin";

export async function POST(req: Request) {
  const { password } = (await req.json()) as { password: string };
  const correct = process.env.ADMIN_PASSWORD;

  if (!correct || password !== correct) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(COOKIE, correct, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(COOKIE);
  return NextResponse.json({ ok: true });
}
