"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { User as UserIcon, LogOut, LayoutDashboard, ChevronDown, Trophy, UserCheck, Settings } from "lucide-react";
import Image from "next/image";
import { calculateVoterStatus } from "@/lib/voter-logic";
import { cn } from "@/lib/utils";

import UserBadge from "./UserBadge";

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
  total_points: number;
  player_grade: string;
  power_multiplier: number;
  voter_status: string;
  voter_weight: number;
};

const Header = () => {
  const pathname = usePathname();
  const isBottomNav = pathname === "/talents" || pathname === "/tresors";

  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isTalent, setIsTalent] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

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

  // ✅ USEEFFECT CORRIGÉ
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);

    const loadUserData = async (currentUser: User | null) => {
      if (!currentUser) {
        setProfile(null);
        setIsTalent(false);
        return;
      }

      try {
        const [profileRes, talentRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", currentUser.id).maybeSingle(),
          supabase.from("talents").select("id").eq("auth_user_id", currentUser.id).maybeSingle()
        ]);

        if (profileRes.data) setProfile(profileRes.data);

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
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const navLinkClasses = "text-sm font-bold text-[#1A1A1A] hover:text-[#006B3F] transition-colors";

  return (
    <header className={cn(
      "fixed left-0 right-0 z-50 transition-all duration-300",
      isBottomNav 
        ? "bottom-0 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.08)] py-3 md:py-4 rounded-t-[2.5rem] border-t border-gray-100" 
        : `top-0 bg-white ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-2" : "py-4"}`
    )}>
      <div className="container max-w-7xl mx-auto flex items-center justify-between px-6">

        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="text-xl font-bold text-[#006B3F] font-display">BeninEase</span>
        </Link>

        <div className="flex items-center gap-6">

          <Link href="/talents" className={navLinkClasses}>Talents</Link>
          <Link href="/tresors" className={navLinkClasses}>Trésors</Link>

          {user ? (
            <div className="flex items-center gap-4">
              <UserBadge 
                status={profile?.voter_status || "Citoyen"} 
                weight={profile?.voter_weight || 1} 
                multiplier={profile?.power_multiplier || 1}
                className="hidden md:flex"
              />

              <div className="relative user-menu-container">
                <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 group">
                  <div className="relative">
                    {profile?.avatar_url ? (
                      <Image src={profile.avatar_url} alt="avatar" width={36} height={36} className="rounded-full ring-2 ring-transparent group-hover:ring-[#008751]/20 transition-all" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#008751]/10 group-hover:text-[#008751] transition-all">
                        <UserIcon size={20} />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                       <ChevronDown size={10} className={cn("text-gray-400 transition-transform", showDropdown && "rotate-180")} />
                    </div>
                  </div>
                </button>

                {showDropdown && (
                  <div className={cn(
                    "absolute right-0 bg-white shadow-2xl rounded-2xl p-4 border border-gray-100 min-w-[220px] z-50 animate-in fade-in duration-200",
                    isBottomNav ? "bottom-full mb-4 slide-in-from-bottom-2" : "top-full mt-3 slide-in-from-top-2"
                  )}>
                    <div className="px-2 py-2 mb-3 border-b border-gray-50 pb-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{profile?.voter_status || 'Votant'}</p>
                      <p className="text-base font-bold text-gray-900 truncate">{profile?.prenom || 'Explorateur'}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-[#008751]" style={{ width: `${Math.min((profile?.total_points || 0) / 10, 100)}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-[#008751]">{profile?.total_points || 0} pts</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="md:hidden px-2 py-2 mb-2 bg-[#008751]/5 rounded-lg border border-[#008751]/10">
                        <p className="text-[10px] font-bold text-[#008751] uppercase tracking-widest">Poids : +{profile?.voter_weight || 1} pts</p>
                      </div>

                      <button 
                        onClick={handleSignOut} 
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-all">
                          <LogOut size={16} />
                        </div>
                        <span className="font-bold">Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="px-6 py-2.5 rounded-full bg-[#008751] text-white text-sm font-bold shadow-lg shadow-[#008751]/20 hover:bg-[#006B3F] hover:-translate-y-0.5 transition-all active:translate-y-0"
            >
              Connexion
            </Link>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;