"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { Code, Globe, Camera, Briefcase, Music2, PlayCircle } from "lucide-react";
import { getCountries } from "@/lib/countries";
import { toast } from "sonner";
import { translations, Language } from "@/lib/data/yonygames-translations";

const inputClass =
  "w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-[color:var(--yony-deep)] text-base placeholder-gray-400 focus:outline-none focus:border-[color:var(--yony-orange)] focus:ring-2 focus:ring-[color:var(--yony-orange)]/20 transition";

const labelClass = "block text-sm font-semibold text-[color:var(--yony-deep)] mb-1.5";

export function JoinDelegationForm({ lang = "Français" }: { lang?: Language }) {
  const t = translations[lang].form;
  const locale = translations[lang].locale;
  const countries = useMemo(() => getCountries(locale), [locale]);
  const [loading, setLoading] = useState(false);

  const STATUSES = useMemo(() => [
    { value: "yony-star", label: t.statusOptions.star },
    { value: "yony-light", label: t.statusOptions.light },
    { value: "yony-place", label: t.statusOptions.place },
    { value: "yony-brand", label: t.statusOptions.brand },
    { value: "yony-designer", label: t.statusOptions.designer },
    { value: "yony-guard", label: t.statusOptions.guard },
  ], [t]);

  const SOCIALS = useMemo(() => [
    { key: "instagram", label: "Instagram", placeholder: t.socialsLabels.instagram, icon: Camera },
    { key: "tiktok", label: "TikTok", placeholder: t.socialsLabels.tiktok, icon: Music2 },
    { key: "youtube", label: "YouTube", placeholder: t.socialsLabels.youtube, icon: PlayCircle },
    { key: "linkedin", label: "LinkedIn", placeholder: t.socialsLabels.linkedin, icon: Briefcase },
    { key: "facebook", label: "Facebook", placeholder: t.socialsLabels.facebook, icon: Globe },
    { key: "website", label: "Site web", placeholder: t.socialsLabels.website, icon: Globe },
  ], [t]);

  const schema = useMemo(() => z.object({
    country: z.string().min(1, t.validation.country),
    firstName: z.string().trim().min(1, t.validation.firstName).max(80),
    lastName: z.string().trim().min(1, t.validation.lastName).max(80),
    status: z.string().min(1, t.validation.status),
    bio: z.string().trim().min(20, t.validation.bio).max(280),
    languages: z.string().trim().min(2, t.validation.languages).max(160),
  }), [t]);

  const [form, setForm] = useState({
    country: "",
    firstName: "",
    lastName: "",
    status: "",
    bio: "",
    languages: "",
  });
  const [socials, setSocials] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const result = schema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? t.validation.invalid);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/delegation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, socials }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? t.validation.error);
        return;
      }

      const countryName = countries.find((c) => c.code === form.country)?.name ?? "";
      toast.success(t.validation.success, {
        description: t.validation.successDesc.replace("{country}", countryName),
      });

      // Reset form
      setForm({ country: "", firstName: "", lastName: "", status: "", bio: "", languages: "" });
      setSocials({});
    } catch {
      toast.error(t.validation.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
      <div className="mb-8">
        <p className="text-[color:var(--yony-orange)] uppercase tracking-[0.25em] font-bold text-[0.78rem] mb-2">
          {translations[lang].nav.join}
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[color:var(--yony-deep)]">
          {t.title}
        </h2>
        <p className="mt-3 text-gray-500">
          {t.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">

        {/* Pays */}
        <div>
          <label htmlFor="country" className={labelClass}>{t.country}</label>
          <select
            id="country"
            value={form.country}
            onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            className={inputClass}
            disabled={loading}
          >
            <option value="">{t.countryPlaceholder}</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Prénom / Nom */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="firstName" className={labelClass}>{t.firstName}</label>
            <input
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              placeholder={t.firstNamePlaceholder}
              maxLength={80}
              className={inputClass}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>{t.lastName}</label>
            <input
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              placeholder={t.lastNamePlaceholder}
              maxLength={80}
              className={inputClass}
              disabled={loading}
            />
          </div>
        </div>

        {/* Statut */}
        <div>
          <label htmlFor="status" className={labelClass}>{t.status}</label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            className={inputClass}
            disabled={loading}
          >
            <option value="">{t.statusPlaceholder}</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className={labelClass}>{t.bio}</label>
          <textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            maxLength={280}
            rows={4}
            placeholder={t.bioPlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[color:var(--yony-deep)] text-base placeholder-gray-400 focus:outline-none focus:border-[color:var(--yony-orange)] focus:ring-2 focus:ring-[color:var(--yony-orange)]/20 transition resize-none"
            disabled={loading}
          />
          <p className="text-xs text-gray-400 text-right mt-1">{form.bio.length}/280</p>
        </div>

        {/* Langues */}
        <div>
          <label htmlFor="languages" className={labelClass}>{t.languages}</label>
          <input
            id="languages"
            type="text"
            value={form.languages}
            onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))}
            placeholder={t.languagesPlaceholder}
            maxLength={160}
            className={inputClass}
            disabled={loading}
          />
        </div>

        {/* Réseaux sociaux */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <label className={labelClass + " mb-0"}>{t.socials}</label>
            <span className="text-xs text-gray-400">{t.optional}</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {SOCIALS.map(({ key, label, placeholder, icon: Icon }) => (
              <div key={key} className="relative">
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  aria-label={label}
                  placeholder={`${label} — ${placeholder}`}
                  value={socials[key] ?? ""}
                  onChange={(e) => setSocials((s) => ({ ...s, [key]: e.target.value }))}
                  maxLength={200}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white text-[color:var(--yony-deep)] text-base placeholder-gray-400 focus:outline-none focus:border-[color:var(--yony-orange)] focus:ring-2 focus:ring-[color:var(--yony-orange)]/20 transition"
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-yony rounded-full h-14 px-10 text-lg font-bold text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {loading ? (
              <>
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t.btnSending}
              </>
            ) : (
              t.btnSubmit
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
