// AUTHORIZED CYBERSECURITY TRAINING LAB
// Manually (re)seeds the demo database from schema.sql + seed.sql.
// Note: `npm run dev` also auto-seeds automatically on first run if
// database/lab.db doesn't exist yet — this script is for explicitly
// resetting the lab back to its initial state.

import { resetDb } from '../lib/db';

resetDb();
console.log('[lab-db] Seed complete.');
