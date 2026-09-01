// AUTHORIZED CYBERSECURITY TRAINING LAB
// Minimal lab activity logger. NEVER pass passwords, tokens, or secrets
// into `detail` — this table is readable from the /admin/logs lab page.

import { getDb } from './db';

export type LabLogEntry = {
  method: string;
  endpoint: string;
  challenge?: string;
  sourceIp?: string | null;
  success: boolean;
  detail?: string;
};

export function logLabEvent(entry: LabLogEntry) {
  const db = getDb();
  db.prepare(
    `INSERT INTO lab_logs (timestamp, method, endpoint, challenge, source_ip, success, detail)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    new Date().toISOString(),
    entry.method,
    entry.endpoint,
    entry.challenge ?? null,
    entry.sourceIp ?? null,
    entry.success ? 1 : 0,
    entry.detail ?? null
  );
}

export function getRecentLogs(limit = 100) {
  const db = getDb();
  return db
    .prepare(`SELECT * FROM lab_logs ORDER BY id DESC LIMIT ?`)
    .all(limit);
}

export function getClientIp(headers: Headers): string | null {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    null
  );
}
