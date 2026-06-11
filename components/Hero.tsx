import ProtectedImage from "./ProtectedImage";
import Particles from "./Particles";
import PressStart from "./PressStart";

export default function Hero() {
  return (
    <section className="relative min-h-dvh flex items-center justify-center overflow-hidden">
      {/* Photo de fond, fondue dans la nuit */}
      <ProtectedImage
        src="/photos/lucy.png"
        alt="Cosplay de Lucy, Cyberpunk Edgerunners — ambiance néon en arrière-plan"
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover object-top opacity-[0.22] pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink via-ink/40 to-ink"
      />

      {/* Nappes de brume arcanique */}
      <div
        aria-hidden
        className="aurora absolute -top-32 left-1/4 h-[30rem] w-[30rem] rounded-full bg-violet/15 blur-[130px]"
      />
      <div
        aria-hidden
        className="aurora absolute bottom-0 right-1/5 h-[26rem] w-[26rem] rounded-full bg-cyan/10 blur-[120px]"
        style={{ animationDelay: "-8s" }}
      />
      <div
        aria-hidden
        className="aurora absolute top-1/2 -left-24 h-[20rem] w-[20rem] rounded-full bg-ember/8 blur-[110px]"
        style={{ animationDelay: "-4s" }}
      />

      <Particles />

      {/* Repères de coins, façon interface */}
      <div aria-hidden className="absolute inset-8 hidden md:block pointer-events-none">
        <span className="absolute top-0 left-0 h-6 w-6 border-t border-l border-paper/25" />
        <span className="absolute top-0 right-0 h-6 w-6 border-t border-r border-paper/25" />
        <span className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-paper/25" />
        <span className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-paper/25" />
      </div>

      {/* Contenu central */}
      <div className="relative z-20 px-6 py-24 pb-28 md:py-32 md:pb-32 text-center max-w-5xl mx-auto">
        <p
          className="rise text-[0.65rem] md:text-xs uppercase tracking-[0.55em] text-cyan"
          style={{ animationDelay: "0.15s" }}
        >
          ✦ Cosplay · Fantasy · Gaming ✦
        </p>

        <h1
          className="rise font-display font-semibold text-[clamp(2.75rem,11.5vw,8.5rem)] leading-none mt-8 text-arcane select-none"
          style={{ animationDelay: "0.35s" }}
        >
          DRAGUNOVA
        </h1>

        <p
          className="rise mt-8 font-light text-paper-dim text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          style={{ animationDelay: "0.6s" }}
        >
          Donner vie aux personnages que l&apos;on aime, le temps
          d&apos;un costume, d&apos;une pose, d&apos;une photo.
        </p>

        {/* Mobile : dans le flux pour rester visible sans scroller */}
        <div className="rise mt-10 md:hidden" style={{ animationDelay: "1s" }}>
          <PressStart />
        </div>
      </div>

      {/* Desktop : ancré en bas de l'écran */}
      <div
        className="rise absolute bottom-20 left-1/2 -translate-x-1/2 z-20 hidden md:block"
        style={{ animationDelay: "1s" }}
      >
        <PressStart />
      </div>
    </section>
  );
}
