import { createHash, randomBytes } from "node:crypto";
import { GameError, initialState, publicSession, applyAction } from "./game.js";
const hash = (text) => createHash("sha256").update(text).digest("hex");
function tokenHash(token) {
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token))
    throw new GameError(
      401,
      "INVALID_SESSION",
      "Your saved journey is unavailable. Start a new journey.",
    );
  return hash(token);
}
export async function createSession(pool, puzzles) {
  const token = randomBytes(32).toString("hex");
  const { rows } = await pool.query(
    "INSERT INTO sessions(token_hash,puzzles,state) VALUES($1,$2,$3) RETURNING *",
    [
      hash(token),
      JSON.stringify(puzzles),
      JSON.stringify(initialState(puzzles)),
    ],
  );
  return { token, session: publicSession(rows[0]) };
}
export async function getRow(pool, token) {
  const { rows } = await pool.query(
    "SELECT * FROM sessions WHERE token_hash=$1",
    [tokenHash(token)],
  );
  if (!rows[0])
    throw new GameError(
      401,
      "INVALID_SESSION",
      "Your saved journey is unavailable. Start a new journey.",
    );
  return rows[0];
}
export async function getSession(pool, token) {
  return publicSession(await getRow(pool, token));
}
export async function mutateSession(pool, token, kind, body) {
  const key = tokenHash(token);
  if (
    !body ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      body.requestId ?? "",
    ) ||
    !Number.isSafeInteger(body.version) ||
    body.version < 0
  )
    throw new GameError(
      400,
      "INVALID_REQUEST",
      "Provide a UUID v4 requestId and a non-negative integer version.",
    );
  // Canonical selected fields avoid sensitivity to JSON property order.
  const fingerprint = hash(
    JSON.stringify([
      kind,
      body.version,
      body.levelId ?? null,
      body.answer ?? null,
      body.nickname ?? null,
    ]),
  );
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT * FROM sessions WHERE token_hash=$1 FOR UPDATE",
      [key],
    );
    const row = rows[0];
    if (!row)
      throw new GameError(
        401,
        "INVALID_SESSION",
        "Your saved journey is unavailable. Start a new journey.",
      );
    const previous = await client.query(
      "SELECT * FROM requests WHERE session_hash=$1 AND request_id=$2",
      [key, body.requestId],
    );
    if (previous.rowCount) {
      if (previous.rows[0].fingerprint !== fingerprint)
        throw new GameError(
          409,
          "REUSED_REQUEST",
          "This request ID was already used for a different action.",
        );
      await client.query("COMMIT");
      return {
        session: publicSession(row),
        result: previous.rows[0].result,
        replayed: true,
      };
    }
    if (row.version !== body.version)
      throw new GameError(
        409,
        "STALE_VERSION",
        "Your saved journey changed. Refresh progress and try again.",
      );
    const result = applyAction(row, kind, body);
    row.version++;
    await client.query(
      "UPDATE sessions SET state=$2,version=$3,score=$4,nickname=$5,completed_at=$6 WHERE token_hash=$1",
      [
        key,
        JSON.stringify(row.state),
        row.version,
        row.score,
        row.nickname,
        row.completed_at,
      ],
    );
    await client.query(
      "INSERT INTO requests(session_hash,request_id,fingerprint,result) VALUES($1,$2,$3,$4)",
      [key, body.requestId, fingerprint, JSON.stringify(result)],
    );
    await client.query("COMMIT");
    return { session: publicSession(row), result, replayed: false };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
