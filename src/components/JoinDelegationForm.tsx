"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { Check, ChevronsUpDown, Code, Globe, Camera, Briefcase, Music2, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCountries } from "@/lib/countries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

const STATUSES = [
  { value: "yony-star", label: "Yony Star — Femme leader" },
  { value: "yony-light", label: "Yony Light — Combattant culturel" },
  { value: "yony-place", label: "Yony Place — Lieu / Ambassade" },
  { value: "yony-brand", label: "Yony Brand — Marque éthique" },
  { value: "yony-designer", label: "Yony Designer — Créateur / Artisan" },
  { value: "yony-guard", label: "Yony Guard — Arbitre des duels" },
] as const;

const SOCIALS = [
  { key: "instagram", label: "Instagram", placeholder: "@pseudo ou URL", icon: Camera },
  { key: "tiktok", label: "TikTok", placeholder: "@pseudo ou URL", icon: Music2 },
  { key: "youtube", label: "YouTube", placeholder: "Chaîne ou URL", icon: PlayCircle },
  { key: "linkedin", label: "LinkedIn", placeholder: "Profil ou URL", icon: Briefcase },
  { key: "x", label: "X (Twitter)", placeholder: "@pseudo ou URL", icon: Code },
  { key: "website", label: "Site web", placeholder: "https://…", icon: Globe },
] as const;

const schema = z.object({
  country: z.string().min(1, "Choisis un pays"),
  firstName: z.string().trim().min(1, "Prénom requis").max(80),
  lastName: z.string().trim().min(1, "Nom requis").max(80),
  status: z.string().min(1, "Choisis un statut"),
  bio: z.string().trim().min(20, "Au moins 20 caractères").max(280),
  languages: z.string().trim().min(2, "Indique au moins une langue").max(160),
});

export function JoinDelegationForm() {
  const countries = useMemo(() => getCountries("fr"), []);
  const [countryOpen, setCountryOpen] = useState(false);

  const [form, setForm] = useState({
    country: "",
    firstName: "",
    lastName: "",
    status: "",
    bio: "",
    languages: "",
  });
  const [socials, setSocials] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Formulaire invalide");
      return;
    }
    toast.success("Candidature reçue", {
      description: `Bienvenue dans la délégation ${
        countries.find((c) => c.code === form.country)?.name ?? ""
      }.`,
    });
    setForm({ country: "", firstName: "", lastName: "", status: "", bio: "", languages: "" });
    setSocials({});
  };

  const selectedCountry = countries.find((c) => c.code === form.country);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-left">
      <div className="mb-8">
        <p className="text-eyebrow text-[color:var(--yony-orange)] uppercase tracking-[0.2em] font-bold text-sm mb-2">Rejoindre une délégation</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[color:var(--yony-deep)]">
          Porte les couleurs de ta nation
        </h2>
        <p className="mt-3 text-muted-foreground">
          Renseigne ton profil pour rejoindre l'aventure des Jeux mondiaux des Traditions & Cultures.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* Pays */}
        <div className="grid gap-2">
          <Label>Pays</Label>
          <Popover open={countryOpen} onOpenChange={setCountryOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                className="justify-between h-12 font-normal text-base"
              >
                {selectedCountry ? selectedCountry.name : "Choisis un pays…"}
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command>
                <CommandInput placeholder="Rechercher un pays…" />
                <CommandList>
                  <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
                  <CommandGroup>
                    {countries.map((c) => (
                      <CommandItem
                        key={c.code}
                        value={c.name}
                        onSelect={() => {
                          setForm((f) => ({ ...f, country: c.code }));
                          setCountryOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            form.country === c.code ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {c.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="grid gap-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              className="h-12"
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              maxLength={80}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              className="h-12"
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              maxLength={80}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Statut dans la délégation</Label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Choisis ton rôle…" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">Bio courte</Label>
          <Textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            maxLength={280}
            rows={4}
            className="resize-none py-3"
            placeholder="Qui es-tu, ce que tu portes pour ta nation…"
          />
          <p className="text-xs text-muted-foreground text-right">{form.bio.length}/280</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="languages">Langues parlées</Label>
          <Input
            id="languages"
            className="h-12"
            value={form.languages}
            onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))}
            placeholder="Français, Anglais, Fon, Quechua…"
            maxLength={160}
          />
        </div>

        <div className="grid gap-4 mt-2">
          <div className="flex items-baseline justify-between">
            <Label>Réseaux sociaux</Label>
            <span className="text-xs text-muted-foreground">Optionnels</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {SOCIALS.map(({ key, label, placeholder, icon: Icon }) => (
              <div key={key} className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  aria-label={label}
                  placeholder={`${label} — ${placeholder}`}
                  className="pl-11 h-12"
                  value={socials[key] ?? ""}
                  onChange={(e) =>
                    setSocials((s) => ({ ...s, [key]: e.target.value }))
                  }
                  maxLength={200}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <Button
            type="submit"
            className="btn-yony rounded-full h-14 px-10 text-lg font-bold"
          >
            Envoyer ma candidature
          </Button>
        </div>
      </form>
    </div>
  );
}
