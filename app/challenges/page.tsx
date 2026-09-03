import Link from 'next/link';

const challenges = [
  {
    id: '1-2',
    title: 'Challenges 1 & 2 — Authentication Bypass',
    endpoint: '/api/auth/login',
    description:
      'The login query concatenates the username and password directly into a SQL string. Log in without knowing a real password.',
    hints: [
      `Username: admin' --`,
      `Username: ' OR '1'='1' --`,
    ],
    link: '/login',
    linkLabel: 'Go to Login',
  },
  {
    id: '3-4',
    title: 'Challenges 3 & 4 — Enumeration & Data Exposure',
    endpoint: '/api/search',
    description:
      "The department filter on the directory search is injectable. Use a UNION-based injection to read the database schema, then pull columns the UI never intended to expose (like usernames and passwords).",
    hints: [
      `nonexistent' UNION SELECT NULL,NULL,NULL --`,
      `nonexistent' UNION SELECT sql,NULL,NULL FROM sqlite_master WHERE name='users' --`,
      `nonexistent' UNION SELECT username, password, role FROM users --`,
    ],
    link: '/search',
    linkLabel: 'Go to Directory Search',
  },
  {
    id: '5',
    title: 'Challenge 5 — Compare the Secure Version',
    endpoint: '/api/auth/login-secure and /api/search/secure',
    description:
      'Try the same payloads above against the hardened endpoints. They use parameterized queries, so the injection no longer works — this is the fix.',
    hints: [
      'Try the same login payloads at /login/secure',
      'Try the same search payloads by calling /api/search/secure directly',
    ],
    link: '/login/secure',
    linkLabel: 'Go to Secure Login',
  },
];

export default function ChallengesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-portal-navy mb-1">Challenges</h1>
        <p className="text-sm text-slate-500">
          A guided walkthrough of the SQL injection vulnerabilities in this
          lab, and their secure counterparts.
        </p>
      </div>

      {challenges.map((c) => (
        <div key={c.id} className="card">
          <h2 className="text-lg font-semibold text-portal-navy mb-1">{c.title}</h2>
          <p className="text-xs text-slate-400 mb-3">
            <code>{c.endpoint}</code>
          </p>
          <p className="text-sm text-slate-600 mb-4">{c.description}</p>
          <div className="bg-slate-50 border rounded-md p-3 mb-4 space-y-1">
            {c.hints.map((h) => (
              <code key={h} className="block text-xs text-slate-700">
                {h}
              </code>
            ))}
          </div>
          <Link href={c.link} className="text-sm underline text-portal-navy">
            {c.linkLabel} →
          </Link>
        </div>
      ))}

      <p className="text-xs text-slate-400 text-center">
        See also{' '}
        <Link href="/admin/logs" className="underline">
          Lab Logs
        </Link>{' '}
        to watch your attempts recorded in real time.
      </p>
    </div>
  );
}
