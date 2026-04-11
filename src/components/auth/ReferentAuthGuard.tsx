'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

interface ReferentAuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ReferentAuthGuard({ children, fallback }: ReferentAuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Step 1: Check session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          window.location.href = '/referent/login';
          return;
        }

        // Step 2: Verify ambassadeur exists
        const { data: ambassadeur, error: ambassadeurError } = await supabase
          .from('ambassadeurs')
          .select('id')
          .eq('auth_user_id', session.user.id)
          .single();

        if (ambassadeurError || !ambassadeur) {
          // Sign out invalid user
          await supabase.auth.signOut();
          window.location.href = '/referent/login';
          return;
        }

        setAuthenticated(true);
      } catch (error) {
        console.error('Auth guard error:', error);
        window.location.href = '/referent/login';
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

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
