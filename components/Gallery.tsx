"use client";

import ProtectedImage from "./ProtectedImage";
import { useCallback, useEffect, useRef, useState } from "react";
import { photos, type Photo } from "@/lib/photos";
import Reveal from "./Reveal";

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  const close = useCallback(() => setSelected(null), []);
  const next = useCallback(
    () => setSelected((s) => (s === null ? null : (s + 1) % photos.length)),
    []
  );
  const prev = useCallback(
    () =>
      setSelected((s) =>
        s === null ? null : (s - 1 + photos.length) % photos.length
      ),
    []
  );

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, close, next, prev]);

  return (
    <section id="book" className="mx-auto max-w-7xl px-6 py-20 md:py-32">
      <Reveal className="mb-12 md:mb-20">
        <p className="text-xs uppercase tracking-[0.4em] text-cyan mb-5">
          ✦ Galerie
        </p>
        <h2 className="font-display text-4xl md:text-6xl font-medium">
          La Galerie
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {photos.map((photo, i) => (
          <Reveal key={photo.src} className={photo.span} delay={(i % 3) * 120}>
            <PhotoCard photo={photo} index={i} onClick={() => setSelected(i)} />
          </Reveal>
        ))}
      </div>

      {selected !== null && (
        <Lightbox
          photo={photos[selected]}
          index={selected}
          onClose={close}
          onNext={next}
          onPrev={prev}
        />
      )}
    </section>
  );
}

function PhotoCard({
  photo,
  index,
  onClick,
}: {
  photo: Photo;
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 7}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 9}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="holo-card group relative block w-full text-left cursor-pointer"
      aria-label={`Agrandir : ${photo.personnage}`}
    >
      <div
        className={`relative ${photo.ratio} overflow-hidden bg-ink-soft`}
        onContextMenu={(e) => e.preventDefault()}
      >
        <ProtectedImage
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
        />
        {/* Reflet holographique qui suit la souris */}
        <div className="holo-glare absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute bottom-0 inset-x-0 p-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <p className="font-display text-xl md:text-2xl">{photo.personnage}</p>
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-paper-dim mt-1">
            {photo.serie} · {photo.annee}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between text-paper-dim">
        <span className="text-[0.65rem] uppercase tracking-[0.3em]">
          {String(index + 1).padStart(2, "0")} / {photo.serie}
        </span>
        <span className="text-xs">{photo.annee}</span>
      </div>
    </button>
  );
}

function Lightbox({
  photo,
  index,
  onClose,
  onNext,
  onPrev,
}: {
  photo: Photo;
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={photo.personnage}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 cursor-pointer text-paper-dim hover:text-violet text-sm uppercase tracking-[0.3em] transition-colors"
      >
        Fermer ✕
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute z-10 bottom-4 left-6 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-10 cursor-pointer text-4xl font-display text-paper-dim hover:text-cyan transition-colors"
        aria-label="Photo précédente"
      >
        ←
      </button>

      <figure
        className="max-h-[85vh] max-w-4xl w-full pb-10 md:pb-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative w-full h-[60vh] md:h-[70vh]"
          onContextMenu={(e) => e.preventDefault()}
        >
          <ProtectedImage
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="90vw"
            className="object-contain pointer-events-none"
          />
        </div>
        <figcaption className="mt-6 flex items-baseline justify-between border-t border-paper/10 pt-4">
          <div>
            <p className="font-display text-2xl md:text-3xl">
              {photo.personnage}
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-paper-dim mt-2">
              Série {photo.serie} · {photo.annee}
            </p>
          </div>
          <span className="font-display text-5xl text-paper/20">
            {String(index + 1).padStart(2, "0")}
          </span>
        </figcaption>
      </figure>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute z-10 bottom-4 right-6 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:right-10 cursor-pointer text-4xl font-display text-paper-dim hover:text-cyan transition-colors"
        aria-label="Photo suivante"
      >
        →
      </button>
    </div>
  );
}
