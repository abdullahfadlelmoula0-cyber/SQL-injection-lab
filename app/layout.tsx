import type { Metadata } from 'next';
import './globals.css';
import WarningBanner from '@/components/WarningBanner';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Student Portal — Cybersecurity Training Environment',
  description:
    'AUTHORIZED CYBERSECURITY TRAINING LAB — intentionally vulnerable SQL Injection lab for education.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WarningBanner />
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="text-center text-xs text-slate-500 py-6">
          Student Portal — Cybersecurity Training Environment. All data is
          fictional. Built for authorized educational use only.
        </footer>
      </body>
    </html>
  );
}
