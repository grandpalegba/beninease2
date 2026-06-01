import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  country: z.string().min(1, "Pays requis"),
  firstName: z.string().trim().min(1, "Prénom requis").max(80),
  lastName: z.string().trim().min(1, "Nom requis").max(80),
  status: z.string().min(1, "Statut requis"),
  bio: z.string().trim().min(20, "Bio trop courte (min. 20 caractères)").max(280),
  languages: z.string().trim().min(2, "Indique au moins une langue").max(160),
  socials: z
    .object({
      instagram: z.string().max(200).optional(),
      tiktok: z.string().max(200).optional(),
      youtube: z.string().max(200).optional(),
      linkedin: z.string().max(200).optional(),
      x: z.string().max(200).optional(),
      website: z.string().max(200).optional(),
    })
    .optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const { country, firstName, lastName, status, bio, languages, socials } =
      result.data;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json(
        { error: "Configuration serveur manquante" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/delegation_members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          country_code: country,
          first_name: firstName,
          last_name: lastName,
          status,
          bio,
          languages,
          instagram: socials?.instagram || null,
          tiktok: socials?.tiktok || null,
          youtube: socials?.youtube || null,
          linkedin: socials?.linkedin || null,
          x_twitter: socials?.x || null,
          website: socials?.website || null,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Supabase error:", errorText);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Candidature enregistrée avec succès" },
      { status: 201 }
    );
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
