// AUTHORIZED CYBERSECURITY TRAINING LAB
// CHALLENGE 1 & 2: this endpoint is INTENTIONALLY VULNERABLE to SQL Injection.
// User-supplied input is concatenated directly into a raw SQL string instead
// of using parameter binding. This mirrors a real-world classic auth-bypass
// bug. Only ever exercise this against the local demo database.
//
// See /app/api/auth/login-secure/route.ts for the corrected implementation.

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { logLabEvent, getClientIp } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const sourceIp = getClientIp(req.headers);
  let username = '';
  let password = '';

  try {
    const body = await req.json();
    username = String(body.username ?? '');
    password = String(body.password ?? '');
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const db = getDb();

  // --- VULNERABLE QUERY ---
  // Raw string concatenation. Do NOT copy this pattern outside of this lab.
  const sql = `SELECT id, username, role, student_id, department, academic_year
               FROM users
               WHERE username = '${username}' AND password = '${password}'`;

  let row: any;
  let queryError: string | null = null;

  try {
    row = db.prepare(sql).get();
  } catch (err: any) {
    // A raw SQL error is itself a useful signal for Challenge 1
    // (error-based injection detection). We surface a generic message to
    // the user but keep the real error out of the client response.
    queryError = err.message;
  }

  logLabEvent({
    method: 'POST',
    endpoint: '/api/auth/login',
    challenge: 'challenge-1-2-sql-injection-auth-bypass',
    sourceIp,
    success: Boolean(row),
    detail: queryError
      ? 'query error (possible injection probe)'
      : row
      ? `login result for username field length ${username.length}`
      : 'no matching row',
  });

  if (queryError) {
    return NextResponse.json(
      { error: 'Login failed. (debug: query error — see server logs)' },
      { status: 500 }
    );
  }

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
