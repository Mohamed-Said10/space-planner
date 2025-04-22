// src/hooks/useUserWithRole.ts
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type UserWithRole = {
  id: string;
  email: string;
  role: string;
};

export function useUserWithRole() {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: profile?.role || 'user',
        });
      }

      setLoading(false);
    };

    getUser();
  }, []);

  return { user, loading };
}
