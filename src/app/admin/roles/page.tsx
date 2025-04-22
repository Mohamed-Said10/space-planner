'use client';

import { useEffect, useState } from 'react';
import { useUserWithRole } from '@/hooks/useUserWithRole';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Profile = {
  id: string;
  email: string;
  role: string;
};

export default function RoleEditorPage() {
  const { user, loading } = useUserWithRole();
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user?.role !== 'admin') {
      router.push('/unauthorized');
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role')
        .order('created_at', { ascending: true });

      if (!error && data) {
        // get emails from auth.users
        const { data: users } = await supabase
          .from('users_view') // you can also make a SQL view joining auth.users + profiles
          .select('id, email');

        const enriched = data.map((profile) => ({
          ...profile,
          email: users?.find((u) => u.id === profile.id)?.email || 'unknown',
        }));

        setProfiles(enriched);
      }
    };

    fetchProfiles();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    setUpdating(id);
    await supabase.from('profiles').update({ role: newRole }).eq('id', id);
    setProfiles((prev) =>
      prev.map((profile) =>
        profile.id === id ? { ...profile, role: newRole } : profile
      )
    );
    setUpdating(null);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage User Roles</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Current Role</th>
            <th className="p-2 border">Change Role</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id}>
              <td className="p-2 border">{profile.email}</td>
              <td className="p-2 border">{profile.role}</td>
              <td className="p-2 border">
                <select
                  value={profile.role}
                  onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                  disabled={updating === profile.id}
                  className="border p-1"
                >
                  <option value="admin">admin</option>
                  <option value="editor">editor</option>
                  <option value="user">user</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
