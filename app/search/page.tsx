'use client';

import { useState } from 'react';
import Link from 'next/link';

type SearchRow = {
  student_id: string | number;
  department: string;
  academic_year: string | number;
};

export default function SearchPage() {
  const [term, setTerm] = useState('');
  const [rows, setRows] = useState<SearchRow[] | null>(null);
  const [rawKeys, setRawKeys] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setRows(null);
    setRawKeys(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/search?department=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Search failed');
        return;
      }
      const results: SearchRow[] = data.results || [];
      setRows(results);
      // Show whatever keys actually came back — useful when a UNION payload
      // pulls in columns the UI never expected (e.g. username/password).
      if (results.length > 0) setRawKeys(Object.keys(results[0]));
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-portal-navy mb-1">Directory Search</h1>
        <p className="text-sm text-slate-500 mb-6">
          Search the student directory by department name.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            className="input-field flex-1"
            placeholder="e.g. Engineering"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-600 mb-4">
            Search failed. (debug: {error} — see server logs)
          </p>
        )}

        {rows && rows.length === 0 && !error && (
          <p className="text-sm text-slate-400">No results.</p>
        )}

        {rows && rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  {(rawKeys ?? []).map((key) => (
                    <th key={key} className="py-2 pr-4 font-medium">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {(rawKeys ?? []).map((key) => (
                      <td key={key} className="py-2 pr-4">
                        {String((row as any)[key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-slate-400 mt-6">
          This search endpoint (<code>/api/search</code>) is part of the SQL
          Injection training lab and is intentionally vulnerable. See{' '}
          <Link href="/challenges" className="underline">
            Challenges
          </Link>{' '}
          for details, or try the hardened version at{' '}
          <code>/api/search/secure</code> for comparison.
        </p>
      </div>
    </div>
  );
}
