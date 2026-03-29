"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { VoterSession, UserRole } from "@/types";

export function useVoter() {
  const [session, setSession] = useState<VoterSession | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

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

  const login = useCallback(async (whatsapp: string, fullName: string) => {
    setLoading(true);
    try {
      // Use the RPC to get or register the voter
      const { data: voterId, error } = await supabase.rpc("register_or_get_voter", {
        p_full_name: fullName,
        p_whatsapp: whatsapp,
      });

      if (error) throw error;

      const newSession: VoterSession = {
        voter_id: voterId,
        whatsapp: whatsapp,
        role: 'votant', // Default role for voters
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

  const checkHasVoted = useCallback(async (candidateId: string) => {
    if (!session?.voter_id) return false;
    
    try {
      const { data, error } = await supabase
        .from("votes")
        .select("id")
        .eq("voter_id", session.voter_id)
        .eq("candidate_id", candidateId)
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
    isAuthenticated: !!session?.voter_id,
  };
}
