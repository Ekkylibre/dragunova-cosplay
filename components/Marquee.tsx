const mots = [
  "Fantasy",
  "Jeux vidéo",
  "Anime",
  "Conventions",
  "Shooting",
  "Pop culture",
];

export default function Marquee() {
  const ligne = [...mots, ...mots];
  return (
    <div className="relative border-y border-paper/10 py-5 overflow-hidden">
      <div className="animate-marquee flex w-max items-center gap-10">
        {ligne.map((mot, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-xl md:text-2xl text-paper/60">
              {mot}
            </span>
            <span className="text-violet text-base" aria-hidden>
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
