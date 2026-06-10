import ProtectedImage from "./ProtectedImage";
import Reveal from "./Reveal";

const fiche = [
  { cle: "Classe", valeur: "Cosplayeuse" },
  { cle: "Niveau", valeur: "13 années d'aventure" },
  { cle: "Guilde", valeur: "Pop culture : fantasy, gaming, anime" },
  { cle: "Personnages débloqués", valeur: "40+" },
  { cle: "Conventions explorées", valeur: "25" },
];

export default function About() {
  return (
    <section id="apropos" className="relative py-20 md:py-32 overflow-hidden">
      <div
        aria-hidden
        className="aurora absolute top-1/3 right-0 h-[26rem] w-[26rem] rounded-full bg-violet/8 blur-[110px]"
      />
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-12 items-center">
        <Reveal className="md:col-span-5">
          <div className="hud-corners relative aspect-[4/5] -rotate-2 hover:rotate-0 transition-transform duration-700">
            <ProtectedImage
              src="/photos/dragunova.png"
              alt="Portrait de Dragunova en backstage"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover pointer-events-none"
            />
          </div>
        </Reveal>

        <div className="md:col-span-7 md:pl-8">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.4em] text-cyan mb-5">
              ✦ À propos
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-medium leading-tight">
              Derrière le costume,
              <br />
              une passionnée.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-8 text-paper-dim font-light leading-relaxed max-w-xl">
              Bonjour à tous ! Je suis Dragunova (ou Nova), une cosplayeuse,
              musicienne et geekette passionnée ! J&apos;aime m&apos;investir
              dans ce que je fais, dépasser mes limites et relever de gros
              défis. Je suis depuis toute petite une grande fan de jeux vidéo.
              Mes préférés : la saga des Half-Life, Portal, Fire Emblem, Tomb
              Raider, Final Fantasy, Bioshock… et beaucoup d&apos;autres ! Je
              suis également musicienne, et ça a une place particulière dans
              mon cœur : c&apos;est ce que j&apos;aime le plus faire à vrai
              dire. Je fais du piano depuis mes six ans et je chante depuis
              toute petite !
            </p>
          </Reveal>

          {/* Fiche de personnage */}
          <Reveal delay={250}>
            <div className="mt-12 border border-paper/10 bg-ink-soft/60 backdrop-blur-sm relative hud-corners">
              <p className="px-6 pt-5 text-[0.6rem] uppercase tracking-[0.4em] text-paper-dim">
                Fiche de personnage
              </p>
              <dl className="px-6 py-5 divide-y divide-paper/5">
                {fiche.map((ligne) => (
                  <div
                    key={ligne.cle}
                    className="flex items-baseline justify-between gap-6 py-3"
                  >
                    <dt className="text-[0.65rem] uppercase tracking-[0.25em] text-paper-dim shrink-0">
                      {ligne.cle}
                    </dt>
                    <dd className="text-sm text-right text-paper">
                      {ligne.valeur}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
