'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type LabUser = {
  username: string;
  role: string;
  studentId: string;
  department: string;
  academicYear: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<LabUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('lab_user');
    if (raw) setUser(JSON.parse(raw));
    setChecked(true);
  }, []);

  if (checked && !user) {
    return (
      <div className="card max-w-md mx-auto text-center">
        <p className="mb-4">You're not logged in.</p>
        <button className="btn-primary" onClick={() => router.push('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto">
      <div className="card">
        <h1 className="text-xl font-bold text-portal-navy mb-4">
          Welcome, {user.username}
        </h1>
        <dl className="grid grid-cols-2 gap-y-3 text-sm">
          <dt className="text-slate-500">Role</dt>
          <dd className="font-medium">{user.role}</dd>
          <dt className="text-slate-500">Student ID</dt>
          <dd className="font-medium">{user.studentId}</dd>
          <dt className="text-slate-500">Department</dt>
          <dd className="font-medium">{user.department}</dd>
          <dt className="text-slate-500">Academic Year</dt>
          <dd className="font-medium">{user.academicYear}</dd>
        </dl>
        <button
          className="mt-6 text-sm underline text-slate-500"
          onClick={() => {
            sessionStorage.removeItem('lab_user');
            router.push('/login');
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
