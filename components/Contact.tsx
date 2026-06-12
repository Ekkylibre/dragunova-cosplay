import Reveal from "./Reveal";
import SocialLinks from "./SocialLinks";
import { siteConfig } from "@/lib/site";

export default function Contact() {
  return (
    <section id="contact" className="border-t border-paper/10 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-cyan mb-6">
            ✦ Contact
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-medium leading-tight">
            Une demande{" "}
            <span className="text-violet">pro ?</span>
          </h2>
          <p className="mt-5 text-xs uppercase tracking-[0.35em] text-paper-dim font-light">
            Sponsoring · Collab · Event
          </p>
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
          <SocialLinks className="mt-14" />
        </Reveal>
      </div>
    </section>
  );
}
