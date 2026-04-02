"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from '@/utils/supabase/client';
import type { VoterSession } from "@/types";

export function useVoter() {
  const [session, setSession] = useState<VoterSession | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem("beninease_voter_session");
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing stored session", e);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, fullName: string) => {
    setLoading(true);
    try {
      // Direct login without RPC - use auth.users directly
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password: "voter123", // Fixed password for all voters
      });

      if (error) throw error;

      // CORRECT Structure: session.user.id (auth.users.id)
      const newSession: VoterSession = {
        user: {
          id: user.id,
          email: user.email || email,
        },
        role: 'votant',
      };

      localStorage.setItem("beninease_voter_session", JSON.stringify(newSession));
      setSession(newSession);
      return { success: true, session: newSession };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const logout = useCallback(() => {
    localStorage.removeItem("beninease_voter_session");
    setSession(null);
  }, []);

  const checkHasVoted = useCallback(async (talentId: string) => {
    if (!session?.email) return false;
    
    try {
      const { data, error } = await supabase
        .from("votes")
        .select("id")
        .eq("voter_id", session.user.id) // CORRECT: session.user.id (auth.users.id)
        .eq("talent_id", talentId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (err) {
      console.error("Error checking vote status:", err);
      return false;
    }
  }, [session, supabase]);

  return {
    session,
    loading,
    login,
    logout,
    checkHasVoted,
    isAuthenticated: !!session?.email,
  };
}
