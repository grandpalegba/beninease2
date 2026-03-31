'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

interface TalentAuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function TalentAuthGuard({ children, fallback }: TalentAuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Step 1: Check session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          router.push('/talent/login');
          return;
        }

        // Step 2: Verify talent exists
        const { data: talent, error: talentError } = await supabase
          .from('talents')
          .select('id')
          .eq('auth_user_id', session.user.id)
          .single();

        if (talentError || !talent) {
          // Sign out invalid user
          await supabase.auth.signOut();
          router.push('/talent/login');
          return;
        }

        setAuthenticated(true);
      } catch (error) {
        console.error('Auth guard error:', error);
        router.push('/talent/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, supabase]);

  if (loading) {
    return fallback || (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#008751] mx-auto mb-4" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
