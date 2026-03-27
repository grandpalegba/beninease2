"use client";

import { useEffect, useMemo, useState, type FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setMessage("Identifiants invalides. Veuillez réessayer.");
        } else {
          setMessage(error.message);
        }
      } else {
        router.replace("/");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <h1 className="mb-10 text-center text-4xl font-bold font-display text-[#FDFBF7] animate-fade-up">
        Connexion Beninease
      </h1>
      
      <form onSubmit={handleAuth} className="w-full space-y-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="space-y-2">
          <label className="text-xs font-sans font-medium text-[#FDFBF7]/70 uppercase tracking-wider ml-1">
            Email
          </label>
          <input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded-2xl bg-white/10 border-0 p-4 text-[#FDFBF7] placeholder:text-[#FDFBF7]/30 outline-none focus:ring-1 focus:ring-[#D9A036] transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-sans font-medium text-[#FDFBF7]/70 uppercase tracking-wider ml-1">
            Mot de passe
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-2xl bg-white/10 border-0 p-4 text-[#FDFBF7] placeholder:text-[#FDFBF7]/30 outline-none focus:ring-1 focus:ring-[#D9A036] transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#D9A036] p-4 font-sans font-bold text-white hover:bg-[#C58F2E] transition-all shadow-lg active:scale-[0.98] disabled:opacity-60 mt-4"
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>

      <Link
        href="/signup"
        className="mt-8 text-sm font-sans text-[#FDFBF7] hover:text-white transition-colors border-b border-[#FDFBF7]/30 pb-0.5 animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        Pas de compte ? Créer un profil
      </Link>

      {message ? (
        <p
          className="mt-6 text-center text-sm font-sans text-[#FDFBF7] bg-white/10 px-4 py-2 rounded-lg animate-shake"
          role="status"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#B25E3B] px-6 pt-20">
      <Suspense fallback={<div className="text-[#FDFBF7] animate-pulse">Chargement...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
