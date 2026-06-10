"use client";

import { useEffect, useRef, useState } from "react";
import { triggerPianoQuest } from "./PianoQuest";

const links = [
  { href: "#book", label: "Galerie" },
  { href: "#apropos", label: "À propos" },
  { href: "#interview", label: "Interview" },
  { href: "#contact", label: "Contact" },
];

const STAR_CLICKS = 5;
const STAR_WINDOW_MS = 2500;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const starClicks = useRef(0);
  const starTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onStarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    starClicks.current++;
    if (starTimer.current) clearTimeout(starTimer.current);
    starTimer.current = setTimeout(() => {
      starClicks.current = 0;
    }, STAR_WINDOW_MS);
    if (starClicks.current >= STAR_CLICKS) {
      starClicks.current = 0;
      triggerPianoQuest();
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled || open
          ? "bg-ink/80 backdrop-blur-md py-4 border-b border-paper/5"
          : "bg-transparent py-7"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        <a
          href="#"
          onClick={() => setOpen(false)}
          className="font-display text-lg md:text-xl tracking-[0.18em] font-medium"
        >
          DRAGUNOVA
          <span
            role="button"
            tabIndex={0}
            onClick={onStarClick}
            onKeyDown={(e) => e.key === "Enter" && onStarClick(e as unknown as React.MouseEvent)}
            className="text-violet cursor-default select-none"
            aria-hidden
          >
            {" "}✦
          </span>
        </a>

        {/* Liens desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-xs uppercase tracking-[0.25em] text-paper-dim hover:text-cyan transition-colors duration-300"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Bouton burger mobile */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="md:hidden flex flex-col items-end justify-center gap-[7px] h-10 w-10 -mr-2 cursor-pointer"
        >
          <span
            className={`h-px w-6 bg-paper transition-transform duration-300 ${
              open ? "translate-y-[8px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-4 bg-paper-dim transition-opacity duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-paper transition-transform duration-300 ${
              open ? "-translate-y-[8px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Panneau mobile */}
      <div
        className={`md:hidden grid transition-all duration-500 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="px-6 pt-6 pb-8 flex flex-col gap-6">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm uppercase tracking-[0.3em] text-paper-dim hover:text-cyan transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
