"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, LayoutDashboard, Settings, Trophy, Globe } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { calculateVoterStatus } from "@/lib/voter-logic";
import Image from "next/image";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type UserStats = {
  voter_id: string;
  total_votes: number;
};

type UserProfile = {
  id: string;
  prenom: string | null;
  nom: string | null;
  avatar_url: string | null;
  role?: string;
  full_name?: string;
};

const MobileNavigation = () => {
  console.log("MOBILE NAV RENDER");

  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isTalent, setIsTalent] = useState(false);

  // ✅ FIX PRINCIPAL ICI
  useEffect(() => {
    const loadUserData = async (currentUser: SupabaseUser | null) => {
      if (!currentUser) {
        setProfile(null);
        setUserStats(null);
        setIsTalent(false);
        return;
      }

      try {
        const [profileRes, statsRes, talentRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", currentUser.id).maybeSingle(),
          supabase.from("user_stats").select("*").eq("voter_id", currentUser.id).single(),
          supabase.from("talents").select("id").eq("auth_user_id", currentUser.id).maybeSingle()
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (statsRes.data) setUserStats(statsRes.data);
        setIsTalent(!!talentRes.data);
      } catch (err) {
        console.log("Erreur load user:", err);
      }
    };

    const init = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      await loadUserData(currentUser);
    };

    init();
  }, []); // ✅ IMPORTANT

  const userGrade = useMemo(() => {
    if (!userStats) return null;
    return calculateVoterStatus(userStats.total_votes || 0, 0, 0);
  }, [userStats]);

  // empêcher scroll quand menu ouvert
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const menuLinkClasses =
    "font-display text-2xl font-bold text-[#1A1A1A] hover:text-[#006B3F] flex items-center gap-4";

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-6 z-[70] p-2 bg-white rounded-full shadow"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-0 bg-white z-[55] flex flex-col p-8"
          >
            <div className="mt-10 space-y-6">

              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    {profile?.avatar_url ? (
                      <Image src={profile.avatar_url} alt="avatar" width={40} height={40} className="rounded-full" />
                    ) : (
                      <User />
                    )}
                    <span>{profile?.prenom || "Utilisateur"}</span>
                  </div>

                  <Link
                    href={
                      profile?.role === "admin"
                        ? "/admin"
                        : profile?.role === "candidat" || profile?.role === "ambassadeur"
                        ? "/profile/dashboard"
                        : "/dashboard/votant"
                    }
                    onClick={() => setIsOpen(false)}
                    className={menuLinkClasses}
                  >
                    <LayoutDashboard /> Dashboard
                  </Link>

                  {isTalent && (
                    <Link
                      href="/talent/dashboard"
                      onClick={() => setIsOpen(false)}
                      className={menuLinkClasses}
                    >
                      <LayoutDashboard /> Ma page
                    </Link>
                  )}

                  <Link href="/settings" onClick={() => setIsOpen(false)} className={menuLinkClasses}>
                    <Settings /> Paramètres
                  </Link>

                  <button onClick={handleSignOut} className="text-red-500 flex items-center gap-2">
                    <LogOut /> Déconnexion
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  Se connecter
                </Link>
              )}

              <Link href="/talents" onClick={() => setIsOpen(false)} className={menuLinkClasses}>
                <Globe /> Talents
              </Link>

              <Link href="/tresors" onClick={() => setIsOpen(false)} className={menuLinkClasses}>
                <Trophy /> Trésors
              </Link>

              <Link href="/classement" onClick={() => setIsOpen(false)} className={menuLinkClasses}>
                <Trophy /> Classement
              </Link>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNavigation;