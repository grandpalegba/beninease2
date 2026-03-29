"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, User, LogOut, LayoutDashboard, Settings, Trophy, UserCheck, Globe, Star } from "lucide-react";
import { useVoter } from "@/lib/auth/use-voter";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { calculateVoterStatus } from "@/lib/voter-logic";
import Image from "next/image";

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  
  const { logout } = useVoter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  // Sync with Supabase Auth
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
        if (currentUser) {
          const [profileRes, statsRes] = await Promise.all([
            supabase.from("profiles").select("*").eq("id", currentUser.id).single(),
            supabase.from("user_stats").select("*").eq("voter_id", currentUser.id).single()
          ]);
          if (profileRes.data) setProfile(profileRes.data);
          if (statsRes.data) setUserStats(statsRes.data);
        }
      } catch (err) {
        console.log("Public mobile user session:", err);
      } finally {
        setLoading(false);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setLoading(true);
        const [profileRes, statsRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", currentUser.id).single(),
          supabase.from("user_stats").select("*").eq("voter_id", currentUser.id).single()
        ]);
        if (profileRes.data) setProfile(profileRes.data);
        if (statsRes.data) setUserStats(statsRes.data);
        setLoading(false);
      } else {
        setProfile(null);
        setUserStats(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Grade calculation
  const userGrade = useMemo(() => {
    if (!userStats) return null;
    return calculateVoterStatus(userStats.unique_candidates_voted || 0, userStats.unique_universes_voted || 0);
  }, [userStats]);

  // Prevent scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuLinkClasses = "font-display text-2xl font-bold text-[#1A1A1A] hover:text-[#006B3F] transition-colors flex items-center gap-4 w-full py-2";

  return (
    <>
      {/* Fixed Header Mobile */}
      <header className="fixed top-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-md border-b border-black/5 h-16 flex items-center md:hidden">
        <div className="container flex items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
            <span className="font-display text-xl font-bold text-[#006B3F]">
              Beninease
            </span>
          </Link>
          <button onClick={toggleMenu} className="p-2 text-[#006B3F] focus:outline-none transition-transform active:scale-90">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[55] bg-white flex flex-col md:hidden overflow-y-auto"
          >
            <div className="flex flex-col min-h-full pt-24 pb-10 px-8">
              
              {/* 1. Identity Section (Top) */}
              {loading ? (
                <div className="mb-10 bg-gray-50 p-6 rounded-[32px] animate-pulse">
                  <div className="h-14 w-14 bg-gray-200 rounded-full mb-4" />
                  <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
                  <div className="h-10 w-full bg-gray-200 rounded-full" />
                </div>
              ) : user ? (
                <div className="mb-10 bg-[#F9F9F7] p-6 rounded-[32px] border border-[#006B3F]/10 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-lg bg-gray-50">
                      {profile?.avatar_url ? (
                        <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#006B3F]/5 text-[#006B3F]"><User size={28} /></div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#1A1A1A] font-display text-xl font-bold leading-tight">
                        {profile?.prenom || profile?.full_name?.split(' ')[0] || 'Citoyen'}
                      </span>
                      {userGrade && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs font-black uppercase tracking-widest text-[#006B3F]/70">{userGrade.label}</span>
                          <span className="text-[10px]">{userGrade.icon}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Private Dashboard Link */}
                  <Link
                    href={profile?.role === 'admin' ? '/admin' : (profile?.role === 'candidat' || profile?.role === 'ambassadeur') ? '/profile/dashboard' : '/dashboard/votant'}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#006B3F] text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                  >
                    <LayoutDashboard size={16} />
                    Mon Dashboard
                  </Link>
                </div>
              ) : (
                <div className="mb-10 flex flex-col gap-4">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 rounded-full bg-[#F9F9F7] text-[#1A1A1A] font-display text-lg font-bold shadow-sm flex items-center justify-center border border-gray-100"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/postuler"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 rounded-full bg-[#006B3F] text-white font-display text-lg font-bold shadow-xl flex items-center justify-center"
                  >
                    <Star size={20} className="mr-2 fill-current" />
                    Postuler
                  </Link>
                </div>
              )}

              {/* 2. Main Navigation (Middle) */}
              <nav className="flex flex-col gap-4 mb-12 border-y border-gray-100 py-8">
                <Link href="/talents" onClick={() => setIsOpen(false)} className={menuLinkClasses}>
                  <Globe size={24} className="text-[#006B3F]" /> Talents
                </Link>
                <Link href="/classement" onClick={() => setIsOpen(false)} className={menuLinkClasses}>
                  <Trophy size={24} className="text-[#006B3F]" /> Classement
                </Link>
              </nav>

              {/* 3. Settings & Logout (Bottom) */}
              {user && (
                <div className="mt-auto space-y-4 pt-6">
                  <Link
                    href="/profile/edit"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-gray-500 font-bold text-sm hover:text-[#006B3F] transition-colors"
                  >
                    <Settings size={18} /> Paramètres du compte
                  </Link>
                  <button
                    onClick={() => { logout(); supabase.auth.signOut(); setIsOpen(false); }}
                    className="flex items-center gap-3 text-red-500 font-bold text-sm hover:text-red-600 transition-colors w-full text-left"
                  >
                    <LogOut size={18} /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation;
