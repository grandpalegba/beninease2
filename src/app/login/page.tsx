"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    if (searchParams?.get("signup") === "true") {
      setIsSignUp(true);
    }
  }, [searchParams]);

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (isSignUp) {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
          },
        });
        if (error) setMessage(error.message);
        else setMessage("Vérifiez vos emails pour confirmer l'inscription !");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setMessage(error.message);
        else {
          router.replace("/");
          router.refresh();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          {isSignUp ? "Inscription Beninease" : "Connexion Beninease"}
        </h1>
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded border border-gray-300 p-2 text-gray-900 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            className="w-full rounded border border-gray-300 p-2 text-gray-900 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-yellow-500 p-2 font-bold text-white hover:bg-yellow-600 disabled:opacity-60"
          >
            {loading ? "…" : isSignUp ? "S'inscrire" : "Se connecter"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setMessage("");
          }}
          className="mt-4 w-full text-sm text-blue-600 underline hover:text-blue-800"
        >
          {isSignUp ? "Déjà un compte ? Connexion" : "Pas de compte ? Créer un profil"}
        </button>
        {message ? (
          <p
            className={`mt-4 text-center text-sm ${message.includes("Vérifiez") ? "text-green-600" : "text-red-500"}`}
            role="status"
          >
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
