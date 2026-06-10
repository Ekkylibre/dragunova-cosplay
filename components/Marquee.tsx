const mots = [
  "Fantasy",
  "Jeux vidéo",
  "Anime",
  "Conventions",
  "Shooting",
  "Craft",
  "Pop culture",
];

/** Répété pour remplir les grands écrans sans trou dans le défilement. */
const COPIES_PAR_PISTE = 3;

function MarqueePiste({ idPrefix }: { idPrefix: string }) {
  return (
    <div className="flex shrink-0 items-center gap-10">
      {Array.from({ length: COPIES_PAR_PISTE }, (_, copy) =>
        mots.map((mot, i) => (
          <span
            key={`${idPrefix}-${copy}-${i}`}
            className="flex shrink-0 items-center gap-10"
          >
            <span className="font-display text-xl md:text-2xl text-paper/60 whitespace-nowrap">
              {mot}
            </span>
            <span className="shrink-0 text-violet text-base" aria-hidden>
              ◆
            </span>
          </span>
        ))
      ).flat()}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="relative border-y border-paper/10 py-5 overflow-hidden">
      <div className="animate-marquee flex w-max shrink-0 items-center">
        <MarqueePiste idPrefix="a" />
        <MarqueePiste idPrefix="b" />
      </div>
    </div>
  );
}
