import { NextResponse } from "next/server";
import { topScores } from "@/lib/scoreStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await topScores());
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}