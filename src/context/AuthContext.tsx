"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import type { Votant, Talent } from "@/types";

type UserProfile = Votant | Talent;

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async (currentUser: User) => {
      try {
        // 🔎 1. Chercher votant
        const { data: votant } = await supabase
          .from("votants")
          .select("*")
          .eq("id", currentUser.id)
          .maybeSingle(); // ✅ FIX

        if (votant) {
          setProfile(votant);
          return;
        }

        // 🔎 2. Chercher talent
        const { data: talent } = await supabase
          .from("talents")
          .select("*")
          .eq("id", currentUser.id)
          .maybeSingle(); // ✅ FIX

        if (talent) {
          setProfile(talent);
          return;
        }

        // 🆕 3. Créer votant si rien trouvé
        const { data: newProfile } = await supabase
          .from("votants")
          .upsert({
            id: currentUser.id,
            full_name:
              currentUser.user_metadata.full_name ||
              currentUser.email,
            avatar_url: currentUser.user_metadata.avatar_url,
            role: "votant",
          })
          .select()
          .maybeSingle(); // ✅ FIX

        setProfile(newProfile ?? null);
      } catch (error) {
        console.error("Erreur loadProfile:", error);
        setProfile(null);
      }
    };

    const init = async () => {
      try {
        const { data: { session: initialSession } } =
          await supabase.auth.getSession();

        const currentUser = initialSession?.user ?? null;

        setSession(initialSession);
        setUser(currentUser);

        if (currentUser) {
          await loadProfile(currentUser);
        }
      } catch (error) {
        console.error("Erreur init auth:", error);
      } finally {
        setLoading(false);
      }
    };

    init();

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        const currentUser = newSession?.user ?? null;

        // ✅ éviter re-render inutile
        if (currentUser?.id !== user?.id) {
          setSession(newSession);
          setUser(currentUser);

          if (currentUser) {
            await loadProfile(currentUser);
          } else {
            setProfile(null);
          }
        }

        setLoading(false);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // ✅ IMPORTANT

  const value = {
    user,
    profile,
    session,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};