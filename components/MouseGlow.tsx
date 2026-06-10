"use client";

import { useEffect, useRef } from "react";

/** Halo de lumière arcanique qui suit la souris, comme une torche. */
export default function MouseGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      el.style.background = `radial-gradient(560px circle at ${e.clientX}px ${e.clientY}px, rgba(157, 123, 255, 0.09), rgba(103, 232, 249, 0.04) 45%, transparent 70%)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return <div ref={ref} aria-hidden className="fixed inset-0 z-10 pointer-events-none" />;
}
