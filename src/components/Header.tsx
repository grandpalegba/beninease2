"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { User as UserIcon, LogOut, ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import UserBadge from "./UserBadge";
import { HeaderSwipe } from "./HeaderSwipe";

type UserProfile = {
  id: string;
  prenom: string | null;
  avatar_url: string | null;
  total_points: number;
  voter_status: string;
  voter_weight: number;
  power_multiplier: number;
};

const Header = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      if (currentUser) {
        const { data } = await supabase.from("profiles").select("*").eq("id", currentUser.id).maybeSingle();
        if (data) setProfile(data);
      }
    };
    init();

    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && !(event.target as Element).closest('.user-menu-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // List of main pages where we show the HeaderSwipe
  const isMainPage = ["/sagesses", "/savoirs", "/histoires", "/ambassadeurs", "/tresors"].includes(pathname);

  return (
    <>
      {/* HEADER SWIPE (Top) */}
      {isMainPage && <HeaderSwipe />}

      {/* DOCK (Bottom) */}
      <footer className="fixed bottom-0 left-0 right-0 z-[100] h-20 bg-black/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-8 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] font-sans">
        
        {/* Logo à gauche */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={28} height={28} />
          <span className="text-lg font-black tracking-[2px] uppercase">
            <span className="text-white">Benin</span>
            <span className="text-[#FCD116]">Ease</span>
          </span>
        </Link>

        {/* Actions à droite */}
        <div className="flex items-center gap-6">
          <button className="text-white/50 hover:text-white transition-colors">
            <Search size={22} />
          </button>

          {user ? (
            <div className="relative user-menu-container">
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 group">
                <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#008751] transition-all">
                  {profile?.avatar_url ? (
                    <Image src={profile.avatar_url} alt="avatar" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/40">
                      <UserIcon size={20} />
                    </div>
                  )}
                </div>
                <ChevronDown size={14} className={cn("text-white/30 transition-transform", showDropdown && "rotate-180")} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 bottom-full mb-4 bg-white shadow-2xl rounded-2xl p-4 border border-gray-100 min-w-[220px] animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="px-2 py-2 mb-3 border-b border-gray-50 pb-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{profile?.voter_status || 'Citoyen'}</p>
                    <p className="text-base font-black text-gray-900 truncate uppercase">{profile?.prenom || 'Explorateur'}</p>
                  </div>

                  <button 
                    onClick={handleSignOut} 
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                  >
                    <LogOut size={16} />
                    <span className="font-black uppercase tracking-wider">Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="px-6 py-2 bg-[#008751] text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-[#006b40] transition-all"
            >
              Connexion
            </Link>
          )}
        </div>
      </footer>
    </>
  );
};

export default Header;