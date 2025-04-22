'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      // Get the auth code and state from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      // Ensure that both 'code' and 'state' are available
      if (!code || !state) {
        console.error('Missing code or state in the URL');
        return;
      }

      // Use the code to exchange for a session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);

      if (exchangeError) {
        console.error('Error during code exchange:', exchangeError.message);
        return;
      }

      // Fetch the user after the code exchange
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Error fetching user:', userError?.message);
        return;
      }

      // Fetch the user's profile to get their role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError?.message);
        return;
      }

      // Redirect based on user role
      const role = profile?.role;
      if (role === 'admin') {
        router.push('/dashboard/admin');
      } else if (role === 'photographer') {
        router.push('/dashboard/photographer');
      } else {
        router.push('/dashboard/client');
      }
    };

    handleRedirect();
  }, [router]);

  return <p className="p-4">Logging in with Google...</p>;
}
