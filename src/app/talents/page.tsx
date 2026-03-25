/**
 * PAGE PUBLIQUE - LISTE DES TALENTS
 * Role: Galerie des candidats avec système de vote.
 */
"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Image as ImageIcon, Heart, X } from "lucide-react";

type TalentProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  city: string | null;
  description: string | null;
  votes_count: number | null;
};

function TalentsList() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [signupOpen, setSignupOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const { data, error: supaError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, city, description, votes_count")
        .order("votes_count", { ascending: false })
        .limit(200);

      if (supaError) {
        setError(supaError.message);
        setTalents([]);
      } else {
        setTalents((data ?? []) as TalentProfile[]);
      }
      setLoading(false);
    };
    load();
  }, [supabase]);

  const openSignup = () => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem("beninease_auth") : null;
      if (raw) {
        const parsed = JSON.parse(raw) as { firstName?: string; phone?: string };
        setFirstName(parsed.firstName ?? "");
        setPhone(parsed.phone ?? "");
      }
    } catch {
      setFirstName("");
      setPhone("");
    }
    setSignupError(null);
    setSignupOpen(true);
  };

  const closeSignup = () => {
    setSignupOpen(false);
    setSignupError(null);
  };

  const generateCode = () => {
    const bytes = new Uint8Array(6);
    if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(bytes)
      .map((b) => (b % 36).toString(36))
      .join("")
      .toUpperCase();
  };

  const handleWhatsappSignup = () => {
    const fn = firstName.trim();
    const ph = phone.trim();
    if (!fn || !ph) {
      setSignupError("Veuillez renseigner votre prénom et votre numéro WhatsApp.");
      return;
    }

    const code = generateCode();
    const message = `Je valide mon inscription sur Beninease (ID: ${code})`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;

    try {
      window.localStorage.setItem(
        "beninease_auth",
        JSON.stringify({ firstName: fn, phone: ph, code, createdAt: new Date().toISOString() }),
      );
    } catch {
      // ignore storage issues
    }

    window.open(url, "_blank", "noopener,noreferrer");
    closeSignup();
  };

  const handleVote = async (profileId: string) => {
    try {
      setVotingId(profileId);
      const { data, error: voteError } = await supabase.rpc("increment_votes", {
        profile_id: profileId,
      });
      if (voteError) throw voteError;

      const nextVotes = typeof data === "number" ? data : null;
      setTalents((prev) =>
        prev.map((t) =>
          t.id === profileId ? { ...t, votes_count: nextVotes ?? (t.votes_count ?? 0) + 1 } : t,
        ),
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : "Erreur inconnue";
      setError(message);
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1A1A1A]">
          Les Candidats
        </h1>
        <p className="mt-3 text-sm md:text-base text-[#8E8E8E]">
          Lancement imminent — découvrez les premiers profils et préparez votre soutien.
        </p>
      </div>

      {!loading && talents.length === 0 ? (
        <div className="mb-8 rounded-[30px] border border-[#F2EDE4] bg-white p-8 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#C5A267] uppercase tracking-[0.25em]">
                Appel à candidatures
              </p>
              <p className="mt-3 font-display text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                Rejoignez Beninease dès maintenant
              </p>
              <p className="mt-2 text-sm text-[#8E8E8E]">
                Inscription flash via WhatsApp — profil premium, vidéos, et visibilité.
              </p>
            </div>
            <button
              type="button"
              onClick={openSignup}
              className="rounded-full bg-[#C5A267] px-7 py-4 text-xs font-bold tracking-[0.15em] uppercase text-white shadow-md transition-colors hover:bg-[#B38F56]"
            >
              S&apos;inscrire comme Candidat
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mb-6 rounded-2xl border border-[#F2EDE4] bg-white px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-3xl border border-[#F2EDE4] bg-white p-10 text-center text-[#8E8E8E]">
          Chargement des talents…
        </div>
      ) : talents.length === 0 ? (
        <div className="rounded-3xl border border-[#F2EDE4] bg-white p-10 text-center text-[#8E8E8E]">
          Aucun candidat n&apos;est encore affiché. Soyez le premier à rejoindre l&apos;aventure.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {talents.map((talent) => {
            const votes = talent.votes_count ?? 0;
            const name = talent.full_name?.trim() || "Talent";
            const subtitle = talent.description?.trim() || talent.city?.trim() || "Découvrir le sanctuaire";

            return (
              <div
                key={talent.id}
                className="group rounded-[28px] border border-[#F2EDE4] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => router.push(`/talents/${talent.id}`)}
                  className="block w-full text-left"
                  aria-label={`Voir le profil de ${name}`}
                >
                  <div className="relative aspect-[4/3] bg-[#2A2A2A]">
                    {talent.avatar_url ? (
                      <img
                        src={talent.avatar_url}
                        alt=""
                        className="h-full w-full object-cover rounded-none"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-[#C5A267]/45" />
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-display text-xl font-bold leading-snug">
                        {name}
                      </p>
                      <p className="mt-1 text-white/80 text-xs font-semibold tracking-normal">
                        {subtitle}
                      </p>
                    </div>
                  </div>
                </button>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-[#1A1A1A]">{name}</p>
                        <span className="text-[10px] font-semibold text-[#8E8E8E] tracking-widest uppercase">
                          {votes} votes
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#C5A267]">
                      <Heart className="h-4 w-4" />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleVote(talent.id);
                    }}
                    disabled={votingId === talent.id}
                    className="mt-5 w-full rounded-full border border-[#E9E2D6] px-5 py-3 text-xs font-semibold tracking-[0.15em] uppercase text-[#8E8E8E] transition-colors hover:bg-[#C5A267] hover:text-white hover:border-[#C5A267] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {votingId === talent.id ? "…" : "Voter"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {signupOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Inscription WhatsApp Beninease"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeSignup();
          }}
        >
          <div className="w-full max-w-lg rounded-[30px] border border-[#F2EDE4] bg-[#FDFBF7] shadow-[0_30px_80px_rgba(0,0,0,0.25)] overflow-hidden">
            <div className="flex items-start justify-between gap-4 p-6 md:p-8">
              <div>
                <p className="text-[10px] font-bold text-[#C5A267] uppercase tracking-[0.25em]">
                  Inscription flash
                </p>
                <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                  Validez via WhatsApp
                </h2>
                <p className="mt-2 text-sm text-[#8E8E8E]">
                  Entrez votre prénom et votre numéro WhatsApp. Le bouton ouvrira WhatsApp avec un code unique.
                </p>
              </div>
              <button
                type="button"
                onClick={closeSignup}
                className="rounded-full border border-[#E9E2D6] bg-white p-2 text-[#8E8E8E] hover:text-[#1A1A1A] transition-colors"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 pb-6 md:px-8 md:pb-8">
              {signupError ? (
                <div className="mb-4 rounded-2xl border border-[#F2EDE4] bg-white px-4 py-3 text-sm text-red-700">
                  {signupError}
                </div>
              ) : null}

              <div className="grid gap-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#8E8E8E]">
                    Prénom
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#E9E2D6] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#C5A267]/30"
                    placeholder="Aïcha"
                    autoComplete="given-name"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#8E8E8E]">
                    Numéro WhatsApp
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#E9E2D6] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#C5A267]/30"
                    placeholder="+229 90 00 00 00"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeSignup}
                  className="rounded-full border border-[#E9E2D6] bg-white px-6 py-3 text-xs font-semibold tracking-[0.15em] uppercase text-[#8E8E8E] hover:bg-[#FFFDF9] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleWhatsappSignup}
                  className="rounded-full bg-[#C5A267] px-7 py-3 text-xs font-bold tracking-[0.15em] uppercase text-white shadow-md transition-colors hover:bg-[#B38F56]"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function TalentsListPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] px-4 py-10 md:py-14">
      <Suspense fallback={<div className="text-center text-[#8E8E8E]">Chargement des talents...</div>}>
        <TalentsList />
      </Suspense>
    </div>
  );
}
