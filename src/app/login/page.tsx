"use client";

import { useMemo, useState, type FormEvent, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";
import PhoneInput from "@/components/PhoneInput";
import { MessageSquare, ArrowRight } from "lucide-react";

function LoginContent() {
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+229");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState<React.ReactNode>("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const fullPhone = useMemo(() => `${countryCode}${phone}`, [countryCode, phone]);

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhone,
        options: {
          shouldCreateUser: false, // Login only
        },
      });

      if (error) {
        if (error.message.includes("User not found")) {
          setMessage(
            <span>
              Numéro inconnu. Souhaitez-vous{" "}
              <Link href="/postuler" className="underline font-bold hover:text-white transition-colors">
                créer un profil ?
              </Link>
            </span>
          );
        } else {
          setMessage(error.message);
        }
      } else {
        setOtpSent(true);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors de l'envoi du code.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { data: { session }, error } = await supabase.auth.verifyOtp({
        phone: fullPhone,
        token: otpCode,
        type: 'sms'
      });

      if (error) {
        setMessage("Code invalide ou expiré.");
      } else if (session) {
        router.replace("/");
        router.refresh();
      }
    } catch {
      setMessage("Une erreur est survenue lors de la vérification.");
    } finally {
      setLoading(false);
    }
  };

  const labelClasses = "text-[10px] font-sans font-bold text-[#F9F9F7]/70 uppercase tracking-[0.2em] ml-1";

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <h1 className="mb-10 text-center text-4xl font-bold font-display text-[#F9F9F7] animate-fade-up">
        Connexion Beninease
      </h1>
      
      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="w-full space-y-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="space-y-3">
            <label className={labelClasses}>
              Numéro WhatsApp
            </label>
            <PhoneInput
              value={phone}
              onChange={setPhone}
              onCountryChange={setCountryCode}
              className="bg-black/20 border-white/10 text-white h-[58px] focus-within:ring-2 focus-within:ring-[#008751]"
              placeholder="Numéro de téléphone"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !phone}
            className="w-full rounded-full bg-[#004d3d] p-4 font-sans font-bold text-white hover:bg-[#004d3d]/90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-60 mt-4 flex items-center justify-center gap-2"
          >
            {loading ? "Envoi en cours..." : "Recevoir mon code sur WhatsApp"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="w-full space-y-8 animate-fade-up">
          <div className="text-center space-y-3 mb-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-[#F9F9F7]" />
            </div>
            <p className="text-sm text-[#F9F9F7]/80 font-sans">
              Code envoyé au <span className="text-[#F9F9F7] font-bold">{fullPhone}</span>
            </p>
          </div>

          <div className="space-y-3">
            <label className={labelClasses}>Code de vérification</label>
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-2xl bg-black/20 border-0 p-6 text-[#F9F9F7] text-center text-3xl tracking-[0.5em] font-bold placeholder:text-[#F9F9F7]/20 outline-none focus:ring-2 focus:ring-[#008751] transition-all"
              required
            />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="w-full rounded-full bg-[#004d3d] p-4 font-sans font-bold text-white hover:bg-[#004d3d]/90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Vérification..." : "Vérifier le code"}
            </button>
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-sm text-[#F9F9F7]/60 font-sans hover:text-[#F9F9F7] transition-colors"
            >
              Changer de numéro
            </button>
          </div>
        </form>
      )}

      <Link
        href="/postuler"
        className="mt-12 text-sm font-sans text-[#F9F9F7]/80 hover:text-white transition-colors border-b border-[#F9F9F7]/30 pb-0.5 animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        Pas de compte ? Créer un profil
      </Link>

      {message ? (
        <p
          className="mt-8 text-center text-sm font-sans text-[#F9F9F7] bg-white/10 px-6 py-3 rounded-xl animate-shake border border-white/5"
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#008751] px-6 pt-20">
      <Suspense fallback={<div className="text-[#F9F9F7] animate-pulse">Chargement...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
