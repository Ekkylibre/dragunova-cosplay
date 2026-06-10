import Reveal from "./Reveal";
import { siteConfig } from "@/lib/site";

const reseaux = [
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "TikTok", href: siteConfig.social.tiktok },
  { label: "X / Twitter", href: siteConfig.social.twitter },
];

export default function Contact() {
  return (
    <section id="contact" className="border-t border-paper/10 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-cyan mb-6">
            ✦ Contact
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-medium leading-tight">
            Sponsoring, collaboration,
            <br />
            <span className="text-violet">événement ou demande pro ?</span>
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <a
            href={`mailto:${siteConfig.email}`}
            className="group inline-block mt-12 font-light text-xl md:text-2xl text-paper hover:text-cyan transition-colors duration-300"
          >
            {siteConfig.email}
            <span className="block h-px w-full bg-paper-dim/40 group-hover:bg-cyan transition-colors duration-300 mt-2" />
          </a>
        </Reveal>
        <Reveal delay={250}>
          <ul className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {reseaux.map((r) => (
              <li key={r.label}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.3em] text-paper-dim hover:text-violet transition-colors duration-300"
                >
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
