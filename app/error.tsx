"use client";

import { useEffect } from "react";
import ErrorPage from "@/components/ErrorPage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPage
      code="ERR"
      title="Quelque chose s'est mal passé"
      description="Une erreur inattendue s'est produite. Tu peux réessayer ou revenir à l'accueil du book."
      action={{ label: "↻ Réessayer", onClick: reset }}
      secondaryAction={{ label: "← Accueil", href: "/" }}
    />
  );
}
