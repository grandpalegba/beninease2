"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { User as UserIcon, LogOut, LayoutDashboard, ChevronDown, Trophy, UserCheck, Settings } from "lucide-react";
import Image from "next/image";
import { calculateVoterStatus } from "@/lib/voter-logic";

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

const Header = () => {
  console.log('HEADER RENDER');

  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isTalent, setIsTalent] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);


  const userGrade = useMemo(() => {
    if (!userStats) return null;
    return calculateVoterStatus(userStats.total_votes || 0, 0, 0);
  }, [userStats]);

  // 👉 fermer dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && !(event.target as Element).closest('.user-menu-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // ✅ USEEFFECT CORRIGÉ (LE PLUS IMPORTANT)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);

    const loadUserData = async (currentUser: User | null) => {
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

        const isTalentFromTable = !!talentRes.data;
        const isTalentFromRole =
          profileRes.data?.role === 'candidate' ||
          profileRes.data?.role === 'candidat' ||
          profileRes.data?.role === 'ambassadeur';

        setIsTalent(isTalentFromTable || isTalentFromRole);
      } catch (err) {
        console.error("Erreur load user:", err);
      }
    };

    // 🔹 Chargement initial
    const init = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      await loadUserData(currentUser);
    };

    init();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []); // ✅ TRÈS IMPORTANT

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const navLinkClasses = "text-sm font-bold text-[#1A1A1A] hover:text-[#006B3F] transition-colors";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${scrolled ? "bg-white shadow-sm py-3" : "bg-white py-5"}`}>
      <div className="container max-w-7xl mx-auto flex items-center justify-between px-6">

        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <span className="text-xl font-bold text-[#006B3F]">BeninEase</span>
        </Link>

        <div className="flex items-center gap-6">

          <Link href="/talents" className={navLinkClasses}>Talents</Link>
          <Link href="/tresors" className={navLinkClasses}>Trésors</Link>
          <Link href="/classement" className={navLinkClasses}>Classement</Link>

          {user ? (
            <div className="relative user-menu-container">
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2">

                {profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt="avatar" width={30} height={30} className="rounded-full" />
                ) : (
                  <UserIcon />
                )}

                <ChevronDown size={14} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white shadow rounded p-3">

                  <Link href="/dashboard" className="block py-1">Dashboard</Link>
                  <Link href="/settings" className="block py-1">Paramètres</Link>

                  {isTalent && (
                    <Link href="/talent/dashboard" className="block py-1">
                      Ma Page
                    </Link>
                  )}

                  <button onClick={handleSignOut} className="block py-1 text-red-500">
                    Déconnexion
                  </button>
                </div>
              )}

            </div>
          ) : (
            <Link href="/login">Connexion</Link>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;