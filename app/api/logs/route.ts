// AUTHORIZED CYBERSECURITY TRAINING LAB
// Read-only endpoint for the lab activity log. Never stores passwords,
// tokens, or secrets — see lib/logger.ts.

import { NextResponse } from 'next/server';
import { getRecentLogs } from '@/lib/logger';

export async function GET() {
  const logs = getRecentLogs(200);
  return NextResponse.json({ logs });
}
