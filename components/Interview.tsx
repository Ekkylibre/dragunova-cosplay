"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const questions = [
  {
    question: "Comment as-tu découvert le cosplay ?",
    reponse:
      "Fan de Lara Croft depuis des années, je trainais souvent sur le site Captain Alban à chercher toutes sortes d'infos sur Lara et je suis tombée sur les « Lara Amateurs ». Une cosplayeuse en particulier a retenu mon attention : Illyne. Je me suis ensuite intéressée à ce qu'elle faisait, ses costumes, etc., et je me suis dit : pourquoi pas moi ? Je me suis tout simplement lancée.",
  },
  {
    question: "Comment choisis-tu tes personnages ?",
    reponse:
      "Donnée manquante. Le sujet de test n'a pas encore rempli ce questionnaire. Un gâteau est offert en échange de la réponse. Le gâteau n'est pas un mensonge. (Enfin, presque.)",
  },
  {
    question: "Que ressens-tu devant l'objectif ?",
    reponse:
      "[RÉPONSE CHIFFRÉE] Décryptage en cours… 42 %… Échec. Seule l'intéressée possède la clé. Correctif prévu dans la version 1.1 du site.",
  },
  {
    question: "Plutôt manette ou clavier-souris ?",
    reponse:
      "Pour obtenir la réponse, nous avons interrogé un certain Sergei Dragunov, de chez Tekken (un nom pareil, ça ne pouvait pas être un hasard). Fidèle à lui-même, il n'a pas prononcé un seul mot. La vraie réponse arrivera dans le prochain DLC.",
  },
  {
    question: "Ton meilleur et ton pire souvenir en convention ?",
    reponse:
      "Mon meilleur : je ne sais pas… chaque convention est unique et j'ai souvent passé de très bons moments ! Je dirais peut-être la Clermont Geek Convention 2016, quand j'ai gagné le concours de chant avec mon interprétation de The Dragonborn Comes de Skyrim, dans mon costume d'Aela. Mon pire : le Montpellier E-Sport de cette année, une organisation inexistante, un malaise… bref, à éviter !",
  },
  {
    question: "Un conseil pour celles et ceux qui veulent se lancer ?",
    reponse:
      "Google est votre ami ! N'hésitez pas à regarder des tutoriels, il y en a vraiment pour TOUT sur le net, c'est top de nos jours pour débuter sans trop se prendre la tête ! Et ne vous découragez pas : nous ne sommes pas des pros de la couture ou de la mousse dès nos débuts. Il faut persévérer et ne jamais lâcher, même si parfois, je vous l'accorde, c'est chiant !",
  },
];

export default function Interview() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="interview"
      className="relative border-t border-paper/10 py-20 md:py-32 overflow-hidden"
    >
      <div
        aria-hidden
        className="aurora absolute top-0 left-1/4 h-[24rem] w-[24rem] rounded-full bg-cyan/5 blur-[100px]"
      />
      <div className="mx-auto max-w-4xl px-6">
        <Reveal className="mb-16 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan mb-5">
            ✦ Questions &amp; Réponses
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-medium">
            L&apos;Interview
          </h2>
          <p className="mt-6 text-sm text-paper-dim font-light max-w-md mx-auto leading-relaxed">
            Six quêtes annexes pour découvrir la cosplayeuse derrière les
            personnages.
          </p>
        </Reveal>

        <div className="divide-y divide-paper/10 border-y border-paper/10">
          {questions.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.question} delay={i * 80}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-baseline gap-6 py-7 text-left cursor-pointer"
                >
                  <span className="font-display text-xl text-paper/25 group-hover:text-cyan transition-colors duration-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`flex-1 font-display text-lg md:text-2xl transition-colors duration-300 ${
                      isOpen ? "text-violet" : "group-hover:text-violet"
                    }`}
                  >
                    {item.question}
                  </span>
                  <span
                    className={`text-cyan text-xl transition-transform duration-500 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-500 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-8 pl-[3.25rem] pr-4 md:pr-10 text-paper-dim font-light leading-relaxed max-w-2xl">
                      {item.reponse}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
