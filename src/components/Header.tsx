"use client";

import { useEffect, useState, useMemo } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
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
        scrolled ? "bg-white backdrop-blur-md shadow-sm py-3" : "bg-white py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span
            className="font-display text-2xl font-bold text-[#000000]"
            style={{ letterSpacing: "0.12em" }}
          >
            Beninease
          </span>
        </a>

        <div className="flex items-center gap-4">
          <a
            href="/talents"
            className="text-sm font-medium text-[#1A1A1A] hover:text-[#C5A267] transition-colors"
          >
            Talents du Bénin
          </a>
          {!loading && (
            <>
              {user ? (
                <>
                  <a
                    href="/profile/edit"
                    className="text-sm font-medium text-[#1A1A1A] hover:text-[#C5A267] transition-colors"
                  >
                    Mon Profil
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="rounded-full border border-[#E9E2D6] px-5 py-2 text-xs font-bold tracking-[0.1em] uppercase text-[#1A1A1A] hover:bg-[#FDFBF7] transition-all"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="text-sm font-medium text-[#1A1A1A] hover:text-[#C5A267] transition-colors"
                  >
                    Se connecter
                  </a>
                  <a
                    href="/postuler"
                    className="rounded-full border border-[#C5A267] px-6 py-2 text-xs font-bold tracking-[0.1em] uppercase text-[#C5A267] hover:bg-[#C5A267] hover:text-white transition-all shadow-sm"
                  >
                    Postuler
                  </a>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
