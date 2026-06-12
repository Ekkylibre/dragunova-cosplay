"use client";

import {
  ensureAudioUnlockListeners,
  playEnterChime,
  resetEnterChime,
} from "@/lib/gameAudio";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

/** Chargement ~2,2 s, puis écran d'accès (attente du clic) */
const SHOW_MS = 2200;
const EXIT_MS = 1000;

type Phase = "loading" | "transition" | "done";

export default function LoadingScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [exiting, setExiting] = useState(false);
  const enteringRef = useRef(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enterSite = useCallback(() => {
    if (enteringRef.current || phase !== "transition") return;
    enteringRef.current = true;

    flushSync(() => setExiting(true));

    void playEnterChime();

    exitTimerRef.current = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, EXIT_MS);
  }, [phase]);

  useLayoutEffect(() => {
    ensureAudioUnlockListeners();
    document.body.style.overflow = "hidden";

    const transitionTimer = setTimeout(() => {
      resetEnterChime();
      setPhase("transition");
    }, SHOW_MS);

    return () => {
      clearTimeout(transitionTimer);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      document.body.style.overflow = "";
    };
  }, []);

  useLayoutEffect(() => {
    if (phase !== "transition") return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        enterSite();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, enterSite]);

  const overlayVisible = phase !== "done";

  return (
    <>
      {children}
      {overlayVisible && (
        <div
          className={`loading-screen fixed inset-0 z-[100] overflow-hidden ${
            phase === "transition" ? "ff-transition-layer" : "bg-ink"
          }`}
          role="dialog"
          aria-modal={phase === "transition"}
          aria-live="polite"
          aria-label={
            phase === "loading" ? "Chargement du site" : "Accès au site"
          }
        >
          {phase === "loading" && (
            <div className="relative flex h-full flex-col items-center justify-center">
              <div
                aria-hidden
                className="aurora absolute -top-24 left-1/4 h-[28rem] w-[28rem] rounded-full bg-violet/20 blur-[120px]"
              />
              <div
                aria-hidden
                className="aurora absolute bottom-0 right-1/5 h-[22rem] w-[22rem] rounded-full bg-cyan/12 blur-[110px]"
                style={{ animationDelay: "-6s" }}
              />

              <div
                aria-hidden
                className="absolute inset-10 hidden md:block pointer-events-none"
              >
                <span className="absolute top-0 left-0 h-8 w-8 border-t border-l border-cyan/30" />
                <span className="absolute top-0 right-0 h-8 w-8 border-t border-r border-cyan/30" />
                <span className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-violet/30" />
                <span className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-violet/30" />
              </div>

              <div className="relative z-10 flex flex-col items-center px-6 text-center">
                <p className="loading-rise font-mono text-[0.6rem] uppercase tracking-[0.5em] text-cyan mb-6">
                  ✦ Cosplay · Fantasy · Gaming ✦
                </p>

                <p
                  className="loading-rise font-display font-semibold text-[clamp(2.5rem,10vw,5.5rem)] leading-none text-arcane select-none"
                  style={{ animationDelay: "0.12s" }}
                >
                  DRAGUNOVA
                </p>

                <p
                  className="loading-rise mt-8 font-mono text-[0.55rem] uppercase tracking-[0.35em] text-paper-dim"
                  style={{ animationDelay: "0.28s" }}
                >
                  Chargement
                </p>

                <div
                  className="loading-rise mt-10 h-px w-56 max-w-[70vw] overflow-hidden bg-paper/10"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="loading-bar h-full bg-gradient-to-r from-violet via-cyan to-violet" />
                </div>

                <p
                  className="loading-rise mt-5 font-mono text-[0.5rem] uppercase tracking-[0.3em] text-paper-dim/80 press-start-blink"
                  style={{ animationDelay: "0.55s" }}
                >
                  Initialisation…
                </p>
              </div>
            </div>
          )}

          {phase === "transition" && (
            <div className="relative flex h-full items-center justify-center bg-ink">
              <div
                aria-hidden
                className={`ff-enter-fx absolute inset-0 z-10 pointer-events-none ${
                  exiting ? "ff-enter-fx-active" : ""
                }`}
              >
                <div className="ff-flash absolute inset-0" />
                <div className="ff-crystal-glow absolute" />
                <div className="ff-crystal absolute" />
                <div className="ff-unmask absolute inset-0 bg-ink" />
              </div>

              <button
                type="button"
                onClick={enterSite}
                disabled={exiting}
                className={`ff-enter-panel-static relative z-20 block px-8 py-6 md:px-10 md:py-7 text-center ${
                  exiting ? "ff-enter-panel-hold" : ""
                } ${exiting ? "cursor-default" : "cursor-pointer"}`}
                aria-label="Accéder au site"
              >
                <p className="font-mono text-[0.5rem] uppercase tracking-[0.45em] text-cyan/80 mb-5 pointer-events-none">
                  ◆ Quête acceptée ◆
                </p>
                <span
                  className={`ff-enter-btn font-display text-lg md:text-xl tracking-[0.22em] text-paper uppercase pointer-events-none ${
                    exiting ? "text-cyan" : "press-start-blink"
                  }`}
                >
                  Accès autorisé
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
