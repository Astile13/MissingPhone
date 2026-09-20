import { NextResponse } from "next/server";
import { FinishInput } from "@/lib/validators";
import { finishPlayer } from "@/lib/scoreStore";

export async function POST(req: Request) {
  const parsed = FinishInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  try {
    const result = await finishPlayer(parsed.data.id, parsed.data.startedAt);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result.score);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}