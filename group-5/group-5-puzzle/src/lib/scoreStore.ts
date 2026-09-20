import { isValidObjectId } from "mongoose";
import { connectDB } from "./db";
import Score from "@/models/Score";

export type PublicScore = { name: string; time: number; date: string };
export type FinishResult =
  | { ok: true; score: PublicScore & { attempt: number; improved: boolean } }
  | { ok: false; status: number; error: string };

const MIN_SECONDS = 10;   // faster than this is rejected
const MAX_SECONDS = 3600; // slower than this is rejected

// Same format the frontend uses: MM.DD.YY
function fmt(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getUTCMonth() + 1)}.${p(d.getUTCDate())}.${p(d.getUTCFullYear() % 100)}`;
}

// One record per email. Entering the same email again returns the existing
// record, so replays never create a second row. The name from the first
// registration is kept.
export async function createPlayer(name: string, email: string): Promise<string> {
  await connectDB();
  const key = email.trim().toLowerCase();
  const run = () =>
    Score.findOneAndUpdate(
      { email: key },
      { $setOnInsert: { name } },
      { upsert: true, new: true }
    );

  let doc = null;
  try {
    doc = await run();
  } catch (e) {
    // two requests created the same email at once: the second one just reads it
    if ((e as { code?: number }).code === 11000) doc = await run();
    else throw e;
  }
  if (!doc) throw new Error("Could not create player");
  return String(doc._id);
}

export async function finishPlayer(id: string, startedAt: number): Promise<FinishResult> {
  await connectDB();
  if (!isValidObjectId(id)) return { ok: false, status: 400, error: "Invalid id" };

  const doc = await Score.findById(id);
  if (!doc) return { ok: false, status: 404, error: "Player not found" };

  const now = Date.now();
  if (startedAt > now + 2000) return { ok: false, status: 400, error: "Invalid start time" };

  // A game starts after the name was entered or after the previous attempt ended,
  // so its time can't exceed the time since then. This cap also blocks
  // submitting the same attempt twice (the second submit would be under 10 s).
  const since = (doc.lastFinishedAt ?? doc.createdAt).getTime();
  const cap = Math.ceil((now - since) / 1000);
  const time = Math.min(Math.round((now - startedAt) / 1000), cap);
  if (time < MIN_SECONDS || time > MAX_SECONDS) {
    return { ok: false, status: 400, error: "Invalid time" };
  }

  // Keep the best (lowest) time only
  const improved = doc.time == null || time < doc.time;
  const res = await Score.updateOne(
    { _id: doc._id, lastFinishedAt: doc.lastFinishedAt ?? null },
    {
      $set: {
        lastFinishedAt: new Date(now),
        ...(improved ? { time, bestAt: new Date(now) } : {}),
      },
    }
  );
  if (res.modifiedCount === 0) return { ok: false, status: 409, error: "Already submitted" };

  const best = improved ? time : (doc.time as number);
  const bestDate = improved ? new Date(now) : (doc.bestAt ?? doc.createdAt);
  return {
    ok: true,
    score: { name: doc.name, time: best, date: fmt(bestDate), attempt: time, improved },
  };
}

export async function topScores(limit = 20): Promise<PublicScore[]> {
  await connectDB();
  const rows = await Score.find({ time: { $exists: true } }, "name time bestAt createdAt")
    .sort({ time: 1, bestAt: 1 })
    .limit(limit)
    .lean();
  return rows.map((r) => ({
    name: r.name,
    time: r.time as number,
    date: fmt(r.bestAt ?? r.createdAt),
  }));
}