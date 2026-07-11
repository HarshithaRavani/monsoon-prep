CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS families (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id TEXT NOT NULL REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS family_members (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL REFERENCES families(id),
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  location TEXT
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'community-submission',
  verification_status TEXT NOT NULL DEFAULT 'unverified',
  created_at TEXT NOT NULL
);
