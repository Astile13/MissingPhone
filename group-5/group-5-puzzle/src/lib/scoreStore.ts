import { isValidObjectId } from "mongoose";
import { connectDB } from "./db";
import Score from "@/models/Score";

export type PublicScore = { name: string; time: number; date: string };
export type FinishResult =
  | { ok: true; score: PublicScore }
  | { ok: false; status: number; error: string };

const MIN_SECONDS = 10;   // faster than this is rejected
const MAX_SECONDS = 3600; // slower than this is rejected

// Same format the frontend uses: MM.DD.YY
function fmt(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getUTCMonth() + 1)}.${p(d.getUTCDate())}.${p(d.getUTCFullYear() % 100)}`;
}

export async function createPlayer(name: string): Promise<string> {
  await connectDB();
  const doc = await Score.create({ name });
  return String(doc._id);
}

export async function finishPlayer(id: string, startedAt: number): Promise<FinishResult> {
  await connectDB();
  if (!isValidObjectId(id)) return { ok: false, status: 400, error: "Invalid id" };

  const doc = await Score.findById(id);
  if (!doc) return { ok: false, status: 404, error: "Player not found" };
  if (doc.time != null) return { ok: false, status: 409, error: "Already submitted" };

  const now = Date.now();
  if (startedAt > now + 2000) return { ok: false, status: 400, error: "Invalid start time" };

  // The game starts after the name is entered, so the real time can never
  // exceed the time since this record was created. Cap the time at that.
  const cap = Math.ceil((now - doc.createdAt.getTime()) / 1000);
  const time = Math.min(Math.round((now - startedAt) / 1000), cap);
  if (time < MIN_SECONDS || time > MAX_SECONDS) {
    return { ok: false, status: 400, error: "Invalid time" };
  }

  // Only update if it hasn't been finished already (guards against double submit)
  const res = await Score.updateOne({ _id: doc._id, time: { $exists: false } }, { $set: { time } });
  if (res.modifiedCount === 0) return { ok: false, status: 409, error: "Already submitted" };

  return { ok: true, score: { name: doc.name, time, date: fmt(doc.createdAt) } };
}

export async function topScores(limit = 20): Promise<PublicScore[]> {
  await connectDB();
  const rows = await Score.find({ time: { $exists: true } }).sort({ time: 1 }).limit(limit).lean();
  return rows.map((r) => ({ name: r.name, time: r.time as number, date: fmt(r.createdAt) }));
}