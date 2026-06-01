"use client";

import { useMemo, useState, type ReactNode } from "react";
import { z } from "zod";
import { Check, ChevronsUpDown, Github, Globe, Instagram, Linkedin, Music2, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCountries } from "@/lib/countries";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  { key: "instagram", label: "Instagram", placeholder: "@pseudo ou URL", icon: Instagram },
  { key: "tiktok", label: "TikTok", placeholder: "@pseudo ou URL", icon: Music2 },
  { key: "youtube", label: "YouTube", placeholder: "Chaîne ou URL", icon: Youtube },
  { key: "linkedin", label: "LinkedIn", placeholder: "Profil ou URL", icon: Linkedin },
  { key: "x", label: "X (Twitter)", placeholder: "@pseudo ou URL", icon: Github },
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

export function JoinDelegationDialog({
  children,
}: {
  children: ReactNode;
}) {
  const countries = useMemo(() => getCountries("fr"), []);
  const [open, setOpen] = useState(false);
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
    setOpen(false);
    setForm({ country: "", firstName: "", lastName: "", status: "", bio: "", languages: "" });
    setSocials({});
  };

  const selectedCountry = countries.find((c) => c.code === form.country);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <p className="text-eyebrow">Rejoindre une délégation</p>
          <DialogTitle className="text-3xl text-[color:var(--yony-deep)]">
            Porte les couleurs de ta nation
          </DialogTitle>
          <DialogDescription>
            Renseigne ton profil pour rejoindre l'aventure des Jeux mondiaux des Traditions & Cultures.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5 pt-2">
          {/* Pays */}
          <div className="grid gap-2">
            <Label>Pays</Label>
            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  className="justify-between h-11 font-normal"
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

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                maxLength={80}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
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
              <SelectTrigger className="h-11">
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
              rows={3}
              placeholder="Qui es-tu, ce que tu portes pour ta nation…"
            />
            <p className="text-xs text-muted-foreground text-right">{form.bio.length}/280</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="languages">Langues parlées</Label>
            <Input
              id="languages"
              value={form.languages}
              onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))}
              placeholder="Français, Anglais, Fon, Quechua…"
              maxLength={160}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex items-baseline justify-between">
              <Label>Réseaux sociaux</Label>
              <span className="text-xs text-muted-foreground">Optionnels</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {SOCIALS.map(({ key, label, placeholder, icon: Icon }) => (
                <div key={key} className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    aria-label={label}
                    placeholder={`${label} — ${placeholder}`}
                    className="pl-9 h-11"
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

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              className="btn-yony rounded-full h-12 px-8 text-base font-semibold"
            >
              Envoyer ma candidature
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
