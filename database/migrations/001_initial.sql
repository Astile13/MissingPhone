CREATE TABLE sessions (
  token_hash text PRIMARY KEY CHECK (length(token_hash) = 64),
  puzzles jsonb NOT NULL CHECK (jsonb_array_length(puzzles) = 5),
  state jsonb NOT NULL,
  version integer NOT NULL DEFAULT 0 CHECK (version >= 0),
  score integer NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 500),
  nickname varchar(20),
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  CHECK (nickname IS NULL OR completed_at IS NOT NULL)
);
CREATE TABLE requests (
  session_hash text NOT NULL REFERENCES sessions(token_hash) ON DELETE CASCADE,
  request_id uuid NOT NULL,
  fingerprint text NOT NULL,
  result jsonb NOT NULL,
  PRIMARY KEY(session_hash, request_id)
);
CREATE INDEX leaderboard_order ON sessions(score DESC, completed_at ASC)
  WHERE completed_at IS NOT NULL AND nickname IS NOT NULL;
