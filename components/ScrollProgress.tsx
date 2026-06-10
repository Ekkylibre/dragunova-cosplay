"use client";

import { useEffect, useRef } from "react";

/** Barre de progression façon jauge d'XP en haut de page. */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      el.style.transform = `scaleX(${ratio})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-50 h-[2px] bg-paper/5">
      <div
        ref={ref}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-violet via-cyan to-ember"
        style={{ boxShadow: "0 0 12px rgba(157, 123, 255, 0.6)" }}
      />
    </div>
  );
}
