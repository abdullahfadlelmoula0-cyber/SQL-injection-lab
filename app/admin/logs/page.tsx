'use client';

import { useEffect, useState } from 'react';

type LogRow = {
  id: number;
  timestamp: string;
  method: string;
  endpoint: string;
  challenge: string | null;
  source_ip: string | null;
  success: number;
  detail: string | null;
};

export default function LabLogsPage() {
  const [logs, setLogs] = useState<LogRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadLogs() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to load logs');
        return;
      }
      setLogs(data.logs || []);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-portal-navy">Lab Logs</h1>
          <button onClick={loadLogs} className="text-sm underline text-portal-navy">
            Refresh
          </button>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Every request to the lab endpoints is recorded here — including
          your injection attempts, successful or not.
        </p>

        {loading && <p className="text-sm text-slate-400">Loading…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {logs && logs.length === 0 && (
          <p className="text-sm text-slate-400">No log entries yet.</p>
        )}

        {logs && logs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-2 pr-3 font-medium">Time</th>
                  <th className="py-2 pr-3 font-medium">Method</th>
                  <th className="py-2 pr-3 font-medium">Endpoint</th>
                  <th className="py-2 pr-3 font-medium">Challenge</th>
                  <th className="py-2 pr-3 font-medium">Result</th>
                  <th className="py-2 pr-3 font-medium">Detail</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b last:border-0 align-top">
                    <td className="py-2 pr-3 whitespace-nowrap text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2 pr-3">{log.method}</td>
                    <td className="py-2 pr-3">
                      <code>{log.endpoint}</code>
                    </td>
                    <td className="py-2 pr-3">{log.challenge ?? '—'}</td>
                    <td className="py-2 pr-3">
                      <span className={log.success ? 'text-green-600' : 'text-red-600'}>
                        {log.success ? 'success' : 'failed'}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-slate-500">{log.detail ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
