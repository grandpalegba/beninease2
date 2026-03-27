"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
          data: {
            full_name: `${firstName} ${lastName}`,
          },
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Vérifiez vos emails pour confirmer l'inscription !");
      }
    } catch (err: any) {
      setMessage("Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full rounded-2xl bg-white border border-[#D9A036]/20 p-4 text-[#1A1A1A] placeholder:text-gray-300 outline-none focus:ring-1 focus:ring-[#D9A036] focus:border-[#D9A036] transition-all font-sans";
  const labelClasses = "text-xs font-sans font-medium text-[#B25E3B] uppercase tracking-wider ml-1";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDF8F1] px-6 pt-24 pb-12">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="mb-10 text-center text-4xl font-bold font-display text-[#B25E3B] animate-fade-up">
          Rejoindre l&apos;Excellence Béninoise
        </h1>

        <form onSubmit={handleSignup} className="w-full space-y-5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClasses}>Prénom</label>
              <input
                type="text"
                placeholder="Ex: Koffi"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClasses}
                required
              />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}>Nom</label>
              <input
                type="text"
                placeholder="Ex: Dossou"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClasses}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClasses}>Email</label>
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              required
            />
          </div>

          <div className="space-y-2">
            <label className={labelClasses}>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
              required
            />
          </div>

          <div className="space-y-2">
            <label className={labelClasses}>Confirmation</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClasses}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#B25E3B] p-4 font-sans font-bold text-[#FDFBF7] hover:bg-[#9A4D2F] transition-all shadow-lg active:scale-[0.98] disabled:opacity-60 mt-4"
          >
            {loading ? "Création du compte..." : "S'inscrire"}
          </button>
        </form>

        <Link
          href="/login"
          className="mt-8 text-sm font-sans text-[#B25E3B] hover:text-[#9A4D2F] transition-colors border-b border-[#B25E3B]/30 pb-0.5 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          Déjà un compte ? Connexion
        </Link>

        {message ? (
          <p
            className={`mt-6 text-center text-sm font-sans px-4 py-2 rounded-lg animate-shake ${
              message.includes("Vérifiez") ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"
            }`}
            role="status"
          >
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
