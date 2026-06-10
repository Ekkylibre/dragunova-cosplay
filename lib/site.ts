/** Config SEO et infos du site — une seule source de vérité. */

export const siteConfig = {
  name: "Dragunova Cosplay",
  title: "Dragunova Cosplay",
  description:
    "Book photo de Dragunova Cosplay : portraits et personnages incarnés entre fantasy, gaming, comics et pop culture. Cosplayeuse et musicienne depuis 2013.",
  locale: "fr_FR",
  email: "dragunova.cos@gmail.com",
  ogImage: "/photos/dragunova.png",
  ogImageAlt:
    "Portrait de Dragunova, cosplayeuse et musicienne — book photo fantasy et gaming",
  keywords: [
    "Dragunova",
    "Dragunova Cosplay",
    "cosplay",
    "book photo",
    "cosplayeuse",
    "fantasy",
    "gaming",
    "jeux vidéo",
    "pop culture",
    "portfolio cosplay",
    "convention",
  ],
  social: {
    instagram: "https://www.instagram.com/dragunova_cos",
    tiktok: "https://www.tiktok.com/@dragunova_cos",
    twitter: "https://x.com/dragunova_cos",
  },
  twitterHandle: "@dragunova_cos",
} as const;

/**
 * URL publique du site.
 * Sur Vercel : détectée automatiquement (domaine custom ou *.vercel.app).
 * Override possible via NEXT_PUBLIC_SITE_URL si besoin.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
