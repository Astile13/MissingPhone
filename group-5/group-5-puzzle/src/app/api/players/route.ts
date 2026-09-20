import { NextResponse } from "next/server";
import { NameInput } from "@/lib/validators";
import { createPlayer } from "@/lib/scoreStore";

export async function POST(req: Request) {
  const parsed = NameInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  try {
    const id = await createPlayer(parsed.data.name);
    return NextResponse.json({ id }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}