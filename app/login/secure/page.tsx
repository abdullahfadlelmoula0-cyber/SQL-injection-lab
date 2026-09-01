'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SecureLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login-secure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      sessionStorage.setItem('lab_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card border-green-300">
        <h1 className="text-2xl font-bold text-green-700 mb-1">
          Student Portal <span className="text-sm font-normal">(secure build)</span>
        </h1>
        <p className="text-sm text-slate-500 mb-6">Challenge 5 — hardened implementation</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white px-4 py-2 rounded-md font-medium hover:bg-green-800 transition-colors"
          >
            {loading ? 'Signing in…' : 'Login (secure)'}
          </button>
        </form>

        <p className="text-xs text-slate-400 mt-6">
          This endpoint (<code>/api/auth/login-secure</code>) uses parameterized
          queries. Try the same payloads that worked on the{' '}
          <Link href="/login" className="underline">
            vulnerable login
          </Link>{' '}
          and confirm they no longer have any effect.
        </p>
      </div>
    </div>
  );
}
