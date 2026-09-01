// AUTHORIZED CYBERSECURITY TRAINING LAB
// CHALLENGE 5: SECURE implementation of the directory search endpoint.
// Compare with /app/api/search/route.ts.
//
// Fixes applied:
//   1. Parameterized query — the department filter is bound, never
//      concatenated.
//   2. A fixed, explicit column allowlist is selected — even if something
//      went wrong upstream, there is no way to widen the returned columns
//      via input.
//   3. Server-side validation of the search term (length + character set).
//   4. Generic error message on failure — no internal SQL detail exposed.

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { logLabEvent, getClientIp } from '@/lib/logger';

const SAFE_TERM = /^[a-zA-Z0-9 .'-]{0,64}$/;

export async function GET(req: NextRequest) {
  const sourceIp = getClientIp(req.headers);
  const term = req.nextUrl.searchParams.get('department') ?? '';

  if (!SAFE_TERM.test(term)) {
    logLabEvent({
      method: 'GET',
      endpoint: '/api/search/secure',
      challenge: 'challenge-5-secure-search',
      sourceIp,
      success: false,
      detail: 'rejected: search term failed validation',
    });
    return NextResponse.json({ error: 'Invalid search term' }, { status: 400 });
  }

  const db = getDb();

  // --- SECURE QUERY: parameter binding + explicit column allowlist ---
  const rows = db
    .prepare(
      `SELECT student_id, department, academic_year
       FROM users
       WHERE department LIKE '%' || ? || '%'`
    )
    .all(term);

  logLabEvent({
    method: 'GET',
    endpoint: '/api/search/secure',
    challenge: 'challenge-5-secure-search',
    sourceIp,
    success: true,
    detail: `returned ${rows.length} row(s)`,
  });

  return NextResponse.json({ results: rows });
}
