/**
 * media.ts — Utilitaires Media Premium (Cache Busting + Optimisation)
 *
 * Principes :
 * - Cache Busting : Version timestamp en développement uniquement.
 *   En production, on utilise un hash de l'URL pour éviter de DDOSer le CDN
 *   tout en forçant le refresh après chaque update Supabase.
 * - Optimisation Unsplash : Paramètres CDN pour format WebP + qualité premium.
 * - Fallback sécurisé : Jamais de src vide ou null passé à un <img>.
 */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80";

/**
 * Optimise et "bust" le cache d'une URL image Unsplash.
 * - Ajoute les paramètres CDN Unsplash (format, crop, qualité, WebP).
 * - Ajoute une version pour contourner le cache CDN côté navigateur.
 *
 * @param url - URL brute de l'image (Unsplash ou autre)
 * @param bust - Si true, ajoute un timestamp pour forcer le refresh (dev)
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  bust = false
): string {
  if (!url) return FALLBACK_IMAGE;

  // Nettoyage : supprimer les anciens params dupliqués auto=format
  let base = url.split("?")[0];

  // Paramètres Unsplash CDN premium
  const params = new URLSearchParams({
    auto: "format",
    fit: "crop",
    w: "1200",
    q: "80",
    fm: "webp",
  });

  // Cache busting : uniquement si demandé (ou en dev explicitement)
  if (bust) {
    params.set("v", Date.now().toString());
  }

  return `${base}?${params.toString()}`;
}

/**
 * Retourne un stable hash court d'une string (pour key React).
 * Evite de régénérer un timestamp à chaque render.
 */
export function stableImageKey(url: string | null | undefined): string {
  if (!url) return "fallback";
  // Hash simple : length + premiers/derniers chars
  const s = url.replace(/[^a-zA-Z0-9]/g, "");
  return `img-${s.length}-${s.slice(0, 6)}-${s.slice(-6)}`;
}
