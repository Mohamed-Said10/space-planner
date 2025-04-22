// src/app/admin/page.tsx
'use client';

import { useUserWithRole } from '@/hooks/useUserWithRole';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user, loading } = useUserWithRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== 'admin') {
      router.push('/unauthorized');
    }
  }, [loading, user, router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Only visible to admins</p>
    </div>
  );
}
