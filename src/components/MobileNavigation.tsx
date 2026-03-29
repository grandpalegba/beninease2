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
  
  const { logout } = useVoter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  // Sync with Supabase Auth
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setProfile(profileData);
        const { data: statsData } = await supabase.from("user_stats").select("*").eq("voter_id", user.id).single();
        setUserStats(statsData);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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

  const menuLinkClasses = "font-display text-2xl font-bold text-[#F9F9F7] hover:text-[#E9B113] transition-colors flex items-center gap-4 w-full py-2";

  return (
    <>
      {/* Fixed Header Mobile */}
      <header className="fixed top-0 left-0 right-0 z-[60] bg-[#F9F9F7]/95 backdrop-blur-md border-b border-black/5 h-16 flex items-center md:hidden">
        <div className="container flex items-center justify-between px-6">
          <Link href="/" className="font-display text-2xl font-bold text-[#006B3F]" onClick={() => setIsOpen(false)}>
            Beninease
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
            className="fixed inset-0 z-[55] bg-[#006B3F] flex flex-col md:hidden overflow-y-auto"
          >
            <div className="flex flex-col min-h-full pt-24 pb-10 px-8">
              
              {/* 1. Identity Section (Top) */}
              {user ? (
                <div className="mb-10 bg-white/10 p-6 rounded-[32px] border border-white/10 shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shadow-lg bg-white/5">
                      {profile?.avatar_url ? (
                        <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/40"><User size={28} /></div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-display text-xl font-bold leading-tight">
                        {profile?.prenom || profile?.full_name?.split(' ')[0] || 'Citoyen'}
                      </span>
                      {userGrade && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs font-black uppercase tracking-widest text-[#E9B113]">{userGrade.label}</span>
                          <span className="text-[10px]">{userGrade.icon}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Private Dashboard Link */}
                  <Link
                    href={profile?.role === 'admin' ? '/admin' : (profile?.role === 'candidat' || profile?.role === 'ambassadeur') ? '/profile/dashboard' : '/dashboard/votant'}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#F9F9F7] text-[#006B3F] rounded-full text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
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
                    className="w-full py-4 rounded-full bg-[#F9F9F7] text-[#006B3F] font-display text-lg font-bold shadow-xl flex items-center justify-center"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/postuler"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 rounded-full bg-[#E9B113] text-[#006B3F] font-display text-lg font-bold shadow-xl flex items-center justify-center"
                  >
                    <Star size={20} className="mr-2 fill-current" />
                    Postuler
                  </Link>
                </div>
              )}

              {/* 2. Main Navigation (Middle) */}
              <nav className="flex flex-col gap-4 mb-12 border-y border-white/5 py-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">Concours</p>
                <Link href="/talents" onClick={() => setIsOpen(false)} className={menuLinkClasses}>
                  <Globe size={24} className="text-[#E9B113]" /> Talents
                </Link>
                <Link href="/classement" onClick={() => setIsOpen(false)} className={menuLinkClasses}>
                  <Trophy size={24} className="text-[#E9B113]" /> Classement
                </Link>
                <Link href="/univers" onClick={() => setIsOpen(false)} className={menuLinkClasses}>
                  <Star size={24} className="text-[#E9B113]" /> Univers
                </Link>
              </nav>

              {/* 3. Settings & Logout (Bottom) */}
              {user && (
                <div className="mt-auto space-y-4 pt-6">
                  <Link
                    href="/profile/edit"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-white/70 font-bold text-sm hover:text-white transition-colors"
                  >
                    <Settings size={18} /> Paramètres du compte
                  </Link>
                  <button
                    onClick={() => { logout(); supabase.auth.signOut(); setIsOpen(false); }}
                    className="flex items-center gap-3 text-red-300 font-bold text-sm hover:text-red-200 transition-colors w-full"
                  >
                    <LogOut size={18} /> Déconnexion
                  </button>
                </div>
              )}

              {/* Footer */}
              <div className="mt-10 text-white/20 font-sans text-[10px] uppercase tracking-widest">
                © {new Date().getFullYear()} Beninease — L'Excellence Béninoise
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation;
