import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { Votant, Talent } from '@/types';

type UserProfile = Votant | Talent;

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Utiliser le singleton directement pour éviter les boucles
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('votants')
          .select('*')
          .eq('id', initialSession.user.id)
          .single();

        if (profileError) {
          const { data: talentProfile, error: talentError } = await supabase
            .from('talents')
            .select('*')
            .eq('id', initialSession.user.id)
            .single();

          if (talentError) {
            const { data: newProfile } = await supabase
              .from('votants')
              .upsert({
                id: initialSession.user.id,
                full_name: initialSession.user.user_metadata.full_name || initialSession.user.email,
                avatar_url: initialSession.user.user_metadata.avatar_url,
                role: 'votant'
              })
              .select()
              .single();
            setProfile(newProfile as UserProfile | null);
          } else {
            setProfile(talentProfile as UserProfile | null);
          }
        } else {
          setProfile(profile as UserProfile | null);
        }
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setTimeout(async () => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            const { data: profile, error: profileError } = await supabase
              .from('votants')
              .select('*')
              .eq('id', newSession.user.id)
              .single();

            if (profileError) {
              const { data: talentProfile, error: talentError } = await supabase
                .from('talents')
                .select('*')
                .eq('id', newSession.user.id)
                .single();

              if (talentError) {
                const { data: newProfile } = await supabase
                  .from('votants')
                  .upsert({
                    id: newSession.user.id,
                    full_name: newSession.user.user_metadata.full_name || newSession.user.email,
                    avatar_url: newSession.user.user_metadata.avatar_url,
                    role: 'votant'
                  })
                  .select()
                  .single();
                setProfile(newProfile as UserProfile | null);
              } else {
                setProfile(talentProfile as UserProfile | null);
              }
            } else {
              setProfile(profile as UserProfile | null);
            }
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      }, 0);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Pas de dépendances pour éviter les boucles

  const value = {
    user,
    profile,
    session,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};