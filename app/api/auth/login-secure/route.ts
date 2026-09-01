// AUTHORIZED CYBERSECURITY TRAINING LAB
// CHALLENGE 5: SECURE implementation of the login endpoint.
// Compare this file with /app/api/auth/login/route.ts.
//
// Fixes applied:
//   1. Parameterized query (prepared statement) — user input is never
//      concatenated into the SQL string.
//   2. Server-side input validation (type + basic length checks).
//   3. Generic error messages — no internal error detail leaks to the client.
//   4. Same interface, so students can point identical injection payloads at
//      this endpoint and observe that they no longer have any effect.

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { logLabEvent, getClientIp } from '@/lib/logger';

function isValidCredentialField(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= 128;
}

export async function POST(req: NextRequest) {
  const sourceIp = getClientIp(req.headers);
  let username: unknown;
  let password: unknown;

  try {
    const body = await req.json();
    username = body.username;
    password = body.password;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!isValidCredentialField(username) || !isValidCredentialField(password)) {
    logLabEvent({
      method: 'POST',
      endpoint: '/api/auth/login-secure',
      challenge: 'challenge-5-secure-login',
      sourceIp,
      success: false,
      detail: 'rejected: invalid field type/length',
    });
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 400 });
  }

  const db = getDb();

  // --- SECURE QUERY: parameter binding, no string concatenation ---
  const row = db
    .prepare(
      `SELECT id, username, role, student_id, department, academic_year
       FROM users
       WHERE username = ? AND password = ?`
    )
    .get(username, password) as any;

  logLabEvent({
    method: 'POST',
    endpoint: '/api/auth/login-secure',
    challenge: 'challenge-5-secure-login',
    sourceIp,
    success: Boolean(row),
    detail: row ? 'login succeeded' : 'login failed',
  });

  if (!row) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      username: row.username,
      role: row.role,
      studentId: row.student_id,
      department: row.department,
      academicYear: row.academic_year,
    },
  });
}
