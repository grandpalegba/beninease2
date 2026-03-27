"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, MessageSquare, ChevronDown } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";
import PhoneInput from "@/components/PhoneInput";
import { universes } from "@/lib/data/universes";

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];
const years = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - 15 - i);

export default function PostulerPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+229");
  const [selectedUniverse, setSelectedUniverse] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  
  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fullPhoneNumber = useMemo(() => {
    return `${countryCode}${phone}`;
  }, [countryCode, phone]);

  const availableSubCategories = useMemo(() => {
    const universe = universes.find(u => u.name === selectedUniverse);
    return universe ? universe.subs : [];
  }, [selectedUniverse]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;
      
      setOtpSent(true);
    } catch {
      setError("Une erreur est survenue lors de l'envoi du code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
        phone: fullPhoneNumber,
        token: otpCode,
        type: 'sms'
      });

      if (verifyError) throw verifyError;

      if (session?.user) {
        // Insert application data
        const { error: appError } = await supabase
          .from("applications")
          .insert({
            user_id: session.user.id,
            full_name: `${firstName} ${lastName}`,
            city: "", 
            phone: fullPhoneNumber,
            category: selectedUniverse,
            sub_category: selectedSubCategory,
            dob: `${dobYear}-${months.indexOf(dobMonth) + 1}-${dobDay}`,
            status: 'pending'
          });

        if (appError) throw appError;
        setSuccess(true);
      }
    } catch {
      setError("Code invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full rounded-2xl bg-white border border-[#008751]/10 p-4 text-[#1A1A1A] placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-[#008751] focus:border-[#008751] transition-all font-sans text-sm appearance-none";
  const labelClasses = "text-[10px] font-sans font-bold text-[#008751] uppercase tracking-[0.2em] ml-1";

  if (success) {
    return (
      <div className="min-h-screen bg-[#FDF8F1] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center animate-fade-up">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#1A1A1A] mb-4">
            Bienvenue parmi les Visages du Bénin ! 🎉
          </h2>
          <p className="text-gray-500 font-sans leading-relaxed mb-8">
            Votre compte est créé et votre candidature est en cours d&apos;examen. 
            Vous recevrez un message très prochainement.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-4 rounded-full bg-[#E8112D] text-white font-bold font-sans hover:bg-[#C40D26] transition-all shadow-lg active:scale-95"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F1] py-16 md:py-24 px-4 flex flex-col items-center">
      <div className="max-w-xl w-full text-center mb-12 animate-fade-in">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#008751] mb-4 leading-tight">
          Candidature pour l&apos;Excellence
        </h1>
        <p className="text-gray-500 font-sans text-lg">
          Rejoignez la vitrine de l&apos;excellence béninoise.
        </p>
      </div>

      <div className="max-w-xl w-full animate-fade-up">
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-8">
            {/* Identity Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClasses}>Prénom</label>
                <input
                  type="text"
                  placeholder="Koffi"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Nom</label>
                <input
                  type="text"
                  placeholder="Dossou"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>Date de naissance</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="relative">
                  <select
                    value={dobDay}
                    onChange={(e) => setDobDay(e.target.value)}
                    required
                    className={inputClasses}
                  >
                    <option value="" disabled>Jour</option>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D9A036] pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={dobMonth}
                    onChange={(e) => setDobMonth(e.target.value)}
                    required
                    className={inputClasses}
                  >
                    <option value="" disabled>Mois</option>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D9A036] pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={dobYear}
                    onChange={(e) => setDobYear(e.target.value)}
                    required
                    className={inputClasses}
                  >
                    <option value="" disabled>Année</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D9A036] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* WhatsApp Section */}
            <div className="space-y-2">
              <label className={labelClasses}>Numéro WhatsApp</label>
              <PhoneInput
                value={phone}
                onChange={setPhone}
                onCountryChange={setCountryCode}
                className="h-[56px]"
              />
            </div>

            {/* Universe & Category Section */}
            <div className="space-y-6 pt-4 border-t border-[#D9A036]/10">
              <p className="text-xs font-sans font-bold text-[#B25E3B] tracking-wider">VOTRE UNIVERS & CATÉGORIE</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className={labelClasses}>UNIVERS</label>
                  <div className="relative">
                    <select
                      value={selectedUniverse}
                      onChange={(e) => {
                        setSelectedUniverse(e.target.value);
                        setSelectedSubCategory("");
                      }}
                      required
                      className={inputClasses}
                    >
                      <option value="" disabled>Sélectionner un univers</option>
                      {universes.map((u) => (
                        <option key={u.name} value={u.name}>{u.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D9A036] pointer-events-none" />
                  </div>
                </div>

                {selectedUniverse && (
                  <div className="space-y-2 animate-fade-in">
                    <label className={labelClasses}>SOUS-CATÉGORIE</label>
                    <div className="relative">
                      <select
                        value={selectedSubCategory}
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                        required
                        className={inputClasses}
                      >
                        <option value="" disabled>Sélectionner une sous-catégorie</option>
                        {availableSubCategories.map((sub) => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D9A036] pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center font-sans animate-shake bg-red-50 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-full bg-[#E8112D] text-white font-bold font-sans text-base hover:bg-[#C40D26] transition-all shadow-xl active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? "Envoi en cours..." : "Recevoir mon code sur WhatsApp"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-8 animate-fade-up">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#008751]/10 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="w-8 h-8 text-[#008751]" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">Code de vérification</h2>
              <p className="text-sm text-gray-400 font-sans">
                Nous avons envoyé un code de vérification à <br />
                <span className="text-[#008751] font-bold">{fullPhoneNumber}</span>
              </p>
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>Entrez le code à 6 chiffres</label>
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                className={`${inputClasses} text-center text-3xl tracking-[0.5em] font-bold py-6 appearance-none focus:ring-2 focus:ring-[#008751]`}
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center font-sans animate-shake">{error}</p>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full py-5 rounded-full bg-[#E8112D] text-white font-bold font-sans text-base hover:bg-[#C40D26] transition-all shadow-xl active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? "Vérification..." : "Confirmer et postuler"}
              </button>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-sm text-[#008751] font-sans hover:underline"
              >
                Retourner au formulaire
              </button>
            </div>
          </form>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/login"
            className="text-sm font-sans text-[#008751] hover:text-[#00683D] transition-colors border-b border-[#008751]/30 pb-0.5"
          >
            Déjà inscrit ? Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
