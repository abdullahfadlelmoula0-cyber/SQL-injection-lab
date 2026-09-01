import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-portal-navy text-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/login" className="font-bold text-lg tracking-tight">
          Student Portal <span className="text-portal-gold">· Training Lab</span>
        </Link>
        <div className="flex gap-5 text-sm">
          <Link href="/login" className="hover:text-portal-gold">Login</Link>
          <Link href="/challenges" className="hover:text-portal-gold">Challenges</Link>
          <Link href="/search" className="hover:text-portal-gold">Directory Search</Link>
          <Link href="/admin/logs" className="hover:text-portal-gold">Lab Logs</Link>
        </div>
      </div>
    </nav>
  );
}
