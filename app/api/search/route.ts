// AUTHORIZED CYBERSECURITY TRAINING LAB
// CHALLENGE 3 & 4: INTENTIONALLY VULNERABLE directory search.
//
// Intended functionality: search the (fake) student directory by department
// name, returning only student_id / department / academic_year — never
// username or password.
//
// The vulnerability: the department filter is concatenated directly into
// the SQL string, so a participant can use UNION-based injection to:
//   - enumerate schema info from sqlite_master (Challenge 3)
//   - pull columns that the UI never intended to expose, e.g. usernames and
//     passwords from the users table, including hidden/admin accounts
//     (Challenge 4)
//
// See /app/api/search/secure/route.ts for the corrected implementation.

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { logLabEvent, getClientIp } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const sourceIp = getClientIp(req.headers);
  const term = req.nextUrl.searchParams.get('department') ?? '';

  const db = getDb();

  // --- VULNERABLE QUERY ---
  const sql = `SELECT student_id, department, academic_year
               FROM users
               WHERE department LIKE '%${term}%'`;

  let rows: any[] = [];
  let queryError: string | null = null;

  try {
    rows = db.prepare(sql).all();
  } catch (err: any) {
    queryError = err.message;
  }

  logLabEvent({
    method: 'GET',
    endpoint: '/api/search',
    challenge: 'challenge-3-4-enumeration-data-exposure',
    sourceIp,
    success: !queryError,
    detail: queryError
      ? 'query error (possible injection probe)'
      : `returned ${rows.length} row(s)`,
  });

  if (queryError) {
    return NextResponse.json(
      { error: 'Search failed. (debug: query error — see server logs)' },
      { status: 500 }
    );
  }

  return NextResponse.json({ results: rows });
}
