// AUTHORIZED CYBERSECURITY TRAINING LAB
// Demo database access layer. Uses a local SQLite file so the lab runs with
// zero external infrastructure. Swap this module out for pg/mysql2 if you
// want to point the lab at a hosted Postgres/MySQL instance instead — the
// vulnerable/secure query patterns elsewhere in the app stay the same shape.

import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';

// On Vercel (and other read-only serverless filesystems), only /tmp is
// writable, and it's wiped on every cold start. Locally, we keep using the
// project's database/ folder so the file persists across dev server restarts.
const isServerless = Boolean(process.env.VERCEL);
const DEFAULT_DB_FILE = isServerless ? '/tmp/lab.db' : './database/lab.db';
const DB_FILE = process.env.DATABASE_FILE || DEFAULT_DB_FILE;
const resolvedPath = isServerless ? DB_FILE : path.resolve(process.cwd(), DB_FILE);

let db: DatabaseSync;

function ensureSeeded() {
  const isNewFile = !fs.existsSync(resolvedPath);
  db = new DatabaseSync(resolvedPath);
  db.exec('PRAGMA journal_mode = WAL');

  if (isNewFile) {
    const schema = fs.readFileSync(
      path.resolve(process.cwd(), 'database/schema.sql'),
      'utf-8'
    );
    const seed = fs.readFileSync(
      path.resolve(process.cwd(), 'database/seed.sql'),
      'utf-8'
    );
    db.exec(schema);
    db.exec(seed);
    console.log('[lab-db] Initialized fresh demo database at', resolvedPath);
  }
}

// Reuse a single connection across hot reloads in dev.
declare global {
  // eslint-disable-next-line no-var
  var __labDb: DatabaseSync | undefined;
}

export function getDb(): DatabaseSync {
  if (global.__labDb) return global.__labDb;
  ensureSeeded();
  global.__labDb = db;
  return db;
}

/** Fully resets the demo database back to its seeded state. Lab-only utility. */
export function resetDb() {
  if (fs.existsSync(resolvedPath)) fs.unlinkSync(resolvedPath);
  if (fs.existsSync(resolvedPath + '-wal')) fs.unlinkSync(resolvedPath + '-wal');
  if (fs.existsSync(resolvedPath + '-shm')) fs.unlinkSync(resolvedPath + '-shm');
  global.__labDb = undefined;
  return getDb();
}
