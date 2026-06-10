import type { Metadata } from "next";
import ErrorPage from "@/components/ErrorPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: siteConfig.title,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      title="Page introuvable"
      description="Erreur 404 : souvenir non trouvé. Cette page n'existe pas ou a été déplacée."
      action={{ label: "← Retour à l'accueil", href: "/" }}
    />
  );
}
