"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { useVoter } from "@/lib/auth/use-voter";
import { Heart, User as UserIcon, LogOut, LayoutDashboard, ChevronDown, Trophy, UserCheck, Settings, Globe } from "lucide-react";
import Image from "next/image";
import { calculateVoterStatus } from "@/lib/voter-logic";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { session: voterSession, isAuthenticated: isVoterAuthenticated } = useVoter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();

  // Calculate grade dynamically
  const userGrade = useMemo(() => {
    if (!userStats) return null;
    return calculateVoterStatus(userStats.unique_candidates_voted || 0, userStats.unique_universes_voted || 0);
  }, [userStats]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && !(event.target as Element).closest('.user-menu-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    
    // Check initial session
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profileData);

        // Fetch user stats for grade
        const { data: statsData } = await supabase
          .from("user_stats")
          .select("*")
          .eq("voter_id", user.id)
          .single();
        setUserStats(statsData);
      }
      
      setLoading(false);
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();
        setProfile(profileData);

        const { data: statsData } = await supabase
          .from("user_stats")
          .select("*")
          .eq("voter_id", currentUser.id)
          .single();
        setUserStats(statsData);
      } else {
        setProfile(null);
        setUserStats(null);
      }

      if (event === 'SIGNED_OUT') {
        router.push('/');
        router.refresh();
      }
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const navLinkClasses = "text-sm font-bold text-[#1A1A1A] hover:text-[#006B3F] transition-colors font-display tracking-wide";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden md:block ${
        scrolled ? "bg-white shadow-sm py-3" : "bg-white py-5"
      }`}
    >
      <div className="container max-w-7xl mx-auto flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <span
            className="font-display text-2xl font-bold text-[#006B3F]"
            style={{ letterSpacing: "0.12em" }}
          >
            Beninease
          </span>
        </Link>

        <div className="flex items-center gap-10">
          <nav className="flex items-center gap-8">
            <Link href="/talents" className={navLinkClasses}>
              Talents
            </Link>
            <Link href="/classement" className={navLinkClasses}>
              Classement
            </Link>
          </nav>

          <div className="flex items-center gap-4 border-l border-[#006B3F]/10 pl-8">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4 user-menu-container relative">
                    {/* User Identity Block */}
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full hover:bg-white transition-all border border-transparent hover:border-gray-100 group shadow-sm hover:shadow-md"
                    >
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-gray-900 group-hover:text-[#006B3F] transition-colors font-sans leading-tight">
                          {profile?.prenom || profile?.full_name?.split(' ')[0] || 'Mon Compte'}
                        </span>
                        {userGrade && (
                          <span className="text-[9px] font-black uppercase tracking-tighter text-[#006B3F]/70">
                            {userGrade.label}
                          </span>
                        )}
                      </div>
                      
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-inner bg-gray-50">
                        {profile?.avatar_url ? (
                          <Image 
                            src={profile.avatar_url} 
                            alt="Profile" 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#006B3F]/5">
                            <UserIcon className="w-5 h-5 text-[#006B3F]" />
                          </div>
                        )}
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu - 32px rounded */}
                    {showDropdown && (
                      <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-50 py-3 animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden">
                        <div className="px-6 py-3 border-b border-gray-50 mb-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Espace Personnel</p>
                          <div className="flex items-center gap-2">
                            {profile?.role === 'candidat' || profile?.role === 'ambassadeur' ? (
                              <Trophy className="w-3.5 h-3.5 text-[#E9B113]" />
                            ) : (
                              <UserCheck className="w-3.5 h-3.5 text-[#006B3F]" />
                            )}
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {profile?.role === 'candidat' || profile?.role === 'ambassadeur' ? 'Talent' : 'Votant'}
                            </p>
                          </div>
                        </div>
                        
                        <Link
                          href={
                            profile?.role === 'admin' ? '/admin' :
                            (profile?.role === 'candidat' || profile?.role === 'ambassadeur') ? '/profile/dashboard' :
                            '/dashboard/votant'
                          }
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-4 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-[#006B3F]/5 hover:text-[#006B3F] transition-all group"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#006B3F]/10 transition-colors">
                            <LayoutDashboard className="w-4 h-4" />
                          </div>
                          📊 Mon Dashboard
                        </Link>
                        
                        <Link
                          href="/profile/edit"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-4 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-[#006B3F]/5 hover:text-[#006B3F] transition-all group"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#006B3F]/10 transition-colors">
                            <Settings className="w-4 h-4" />
                          </div>
                          ⚙️ Paramètres
                        </Link>

                        <div className="h-px bg-gray-50 my-2 mx-6" />

                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            handleSignOut();
                          }}
                          className="flex items-center gap-4 w-full px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <LogOut className="w-4 h-4" />
                          </div>
                          🚪 Déconnexion
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link
                      href="/login"
                      className="text-sm font-bold text-[#1A1A1A] hover:text-[#006B3F] transition-colors font-display tracking-wide"
                    >
                      Se connecter
                    </Link>
                    <Link
                      href="/postuler"
                      className="rounded-full bg-[#006B3F] px-8 py-3.5 text-[11px] font-black tracking-[0.15em] uppercase text-white transition-all hover:bg-[#008751] active:scale-95 shadow-lg shadow-[#006B3F]/20"
                    >
                      Postuler
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
