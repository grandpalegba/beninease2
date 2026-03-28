"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { useVoter } from "@/lib/auth/use-voter";
import { Heart } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { session: voterSession, isAuthenticated: isVoterAuthenticated } = useVoter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    
    // Check initial session
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden md:block ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-[#F9F9F7] py-5"
      }`}
    >
      <div className="container max-w-7xl mx-auto flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="font-display text-2xl font-bold text-[#006B3F]"
            style={{ letterSpacing: "0.12em" }}
          >
            Beninease
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6">
            <Link
              href="/talents"
              className="text-sm font-medium text-[#1A1A1A] hover:text-[#006B3F] transition-colors"
            >
              Talents du Bénin
            </Link>
            <Link
              href="/classement"
              className="text-sm font-medium text-[#1A1A1A] hover:text-[#006B3F] transition-colors"
            >
              Classement
            </Link>
            {isVoterAuthenticated && (
              <Link
                href="/talentssoutenus"
                className="flex items-center gap-1.5 text-sm font-bold text-[#006B3F] hover:opacity-80 transition-opacity"
              >
                <Heart className="w-4 h-4 fill-[#006B3F]" />
                Mes Soutiens
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4 border-l border-[#006B3F]/10 pl-8">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/profile/edit"
                      className="text-sm font-medium text-[#1A1A1A] hover:text-[#006B3F] transition-colors"
                    >
                      Mon Profil
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="rounded-full border border-[#E9E2D6] px-5 py-2 text-xs font-bold tracking-[0.1em] uppercase text-[#1A1A1A] hover:bg-[#F9F9F7] transition-all"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    {!isVoterAuthenticated && (
                      <Link
                        href="/login"
                        className="text-sm font-medium text-[#1A1A1A] hover:text-[#006B3F] transition-colors"
                      >
                        Se connecter
                      </Link>
                    )}
                    <Link
                      href="/postuler"
                      className="rounded-full bg-[#006B3F] px-8 py-3 text-xs font-bold tracking-[0.12em] uppercase text-white transition-all hover:bg-[#008751] active:scale-95 shadow-lg"
                    >
                      Postuler
                    </Link>
                  </>
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
