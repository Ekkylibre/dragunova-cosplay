"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMusic } from "@/components/BackgroundMusic";
import {
  KEYBOARD_HINTS,
  MGS_MELODY,
  noteFreq,
  type MelodyNote,
} from "@/lib/mgsMelody";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

const WHITE = ["C", "D", "E", "F", "G", "A", "B"] as const;
const BLACK: { pitch: string; after: number }[] = [
  { pitch: "Cs", after: 0 },
  { pitch: "Ds", after: 1 },
  { pitch: "Fs", after: 3 },
  { pitch: "Gs", after: 4 },
  { pitch: "As", after: 5 },
];

const OCTAVES = [4, 5, 6];
const AUTO_NOTE_MS = 360;
/** Piano original — Metal Gear Solid Main Theme (référence tutoriel) */
const ORIGINAL_PIANO_VIDEO_ID = "kjWGdHoltV4";
const ORIGINAL_PIANO_URL = `https://www.youtube.com/watch?v=${ORIGINAL_PIANO_VIDEO_ID}`;

function playPianoNote(freq: number, duration = 0.5) {
  try {
    const ctx = new AudioContext();
    const t = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = "triangle";
    osc2.type = "sine";
    osc1.frequency.value = freq;
    osc2.frequency.value = freq * 2;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + duration);
    osc2.stop(t + duration);
    setTimeout(() => ctx.close(), duration * 1000 + 120);
  } catch {
    /* silencieux */
  }
}

function playWrong() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = 110;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
    setTimeout(() => ctx.close(), 200);
  } catch {
    /* silencieux */
  }
}

export function triggerPianoQuest() {
  window.dispatchEvent(new CustomEvent("dragunova-quest"));
}

function PianoKeyboard({
  target,
  pressed,
  wrong,
  onKeyPress,
}: {
  target: MelodyNote | null;
  pressed: string | null;
  wrong: string | null;
  onKeyPress: (note: MelodyNote) => void;
}) {
  const whiteKeys: MelodyNote[] = [];
  OCTAVES.forEach((oct) => {
    WHITE.forEach((pitch) => {
      const labels: Record<string, string> = {
        C: "Do",
        D: "Ré",
        E: "Mi",
        F: "Fa",
        G: "Sol",
        A: "La",
        B: "Si",
      };
      whiteKeys.push({
        id: `${pitch}${oct}`,
        pitch,
        octave: oct,
        label: labels[pitch],
      });
    });
  });

  const blackKeys: MelodyNote[] = [];
  OCTAVES.forEach((oct) => {
    BLACK.forEach(({ pitch, after }) => {
      const labels: Record<string, string> = {
        Cs: "Do#",
        Ds: "Ré#",
        Fs: "Fa#",
        Gs: "Sol#",
        As: "La#",
      };
      blackKeys.push({
        id: `${pitch}${oct}`,
        pitch,
        octave: oct,
        label: labels[pitch],
      });
    });
  });

  const keyStyle = (id: string, isBlack: boolean) => {
    const isTarget = target?.id === id;
    const isPressed = pressed === id;
    const isWrong = wrong === id;
    if (isWrong)
      return isBlack
        ? "bg-red-500/80 shadow-[0_0_12px_rgba(239,68,68,0.6)]"
        : "bg-red-400/40 shadow-[0_0_16px_rgba(239,68,68,0.5)]";
    if (isTarget)
      return isBlack
        ? "bg-violet shadow-[0_0_16px_rgba(157,123,255,0.7)] animate-pulse -translate-y-1"
        : "bg-cyan/40 shadow-[0_0_20px_rgba(103,232,249,0.55)] animate-pulse -translate-y-1";
    if (isPressed)
      return isBlack ? "bg-violet/70" : "bg-cyan/25 -translate-y-0.5";
    return isBlack ? "bg-ink-soft hover:bg-ink" : "bg-paper/90 hover:bg-paper";
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl px-1 pb-1 pt-3 select-none">
      <div className="flex">
        {whiteKeys.map((note) => (
          <button
            key={note.id}
            type="button"
            onClick={() => onKeyPress(note)}
            className={`relative h-24 flex-1 border border-ink/30 rounded-b-sm cursor-pointer transition-all duration-100 ${keyStyle(note.id, false)}`}
            aria-label={`${note.label} ${note.octave}`}
          >
            {target?.id === note.id && (
              <span className="absolute bottom-2 inset-x-0 text-center font-mono text-[0.5rem] text-ink/70">
                {KEYBOARD_HINTS[note.id] ?? note.label}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="absolute top-3 inset-x-1 pointer-events-none">
        <div className="relative w-full h-14">
          {blackKeys.map((note, i) => {
            const octIdx = Math.floor(i / 5);
            const after = BLACK[i % 5].after;
            const whiteBefore = octIdx * 7 + after + 1;
            const left = (whiteBefore / 21) * 100;
            return (
              <button
                key={note.id}
                type="button"
                onClick={() => onKeyPress(note)}
                style={{ left: `${left}%`, width: "4.2%" }}
                className={`absolute h-14 -ml-[2.1%] rounded-b-sm border border-ink/50 cursor-pointer pointer-events-auto transition-all duration-100 ${keyStyle(note.id, true)}`}
                aria-label={`${note.label} ${note.octave}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PianoQuest() {
  const { pause: pauseBgMusic, resume: resumeBgMusic } = useMusic();
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<"intro" | "listen" | "play" | "done">(
    "intro"
  );
  const [step, setStep] = useState(0);
  const [pressed, setPressed] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const konamiIdx = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const target = phase === "play" ? MGS_MELODY[step] : null;
  const progress = Math.round((step / MGS_MELODY.length) * 100);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const close = useCallback(() => {
    clearTimers();
    setActive(false);
    setPhase("intro");
    setStep(0);
    setPressed(null);
    setWrong(null);
    setAutoPlay(false);
  }, []);

  const flashPress = useCallback((id: string) => {
    setPressed(id);
    const t = setTimeout(() => setPressed(null), 200);
    timers.current.push(t);
  }, []);

  const flashWrong = useCallback((id: string) => {
    setWrong(id);
    playWrong();
    const t = setTimeout(() => setWrong(null), 350);
    timers.current.push(t);
  }, []);

  const stopAuto = useCallback(() => {
    clearTimers();
    setAutoPlay(false);
  }, []);

  const hitNote = useCallback(
    (note: MelodyNote) => {
      if (phase !== "play" || !target || autoPlay) return;

      playPianoNote(noteFreq(note.pitch, note.octave));

      if (note.id !== target.id) {
        flashWrong(note.id);
        return;
      }

      flashPress(note.id);

      if (step >= MGS_MELODY.length - 1) {
        setPhase("done");
        return;
      }
      setStep((s) => s + 1);
    },
    [phase, target, step, flashPress, flashWrong, autoPlay]
  );

  const playHint = useCallback(() => {
    if (!target || autoPlay) return;
    playPianoNote(noteFreq(target.pitch, target.octave), 0.35);
  }, [target, autoPlay]);

  const start = useCallback(() => {
    setAutoPlay(false);
    setPhase("play");
    setStep(0);
    setTimeout(playHint, 400);
  }, [playHint]);

  const startAuto = useCallback(() => {
    clearTimers();
    setPhase("play");
    setStep(0);
    setAutoPlay(true);
  }, []);

  const listenOriginal = useCallback(() => {
    clearTimers();
    setAutoPlay(false);
    setPhase("listen");
  }, []);

  const backToIntro = useCallback(() => {
    clearTimers();
    setAutoPlay(false);
    setPhase("intro");
    setStep(0);
  }, []);

  useEffect(() => {
    const open = () => {
      setActive(true);
      setPhase("intro");
      setStep(0);
    };
    window.addEventListener("dragunova-quest", open);
    return () => window.removeEventListener("dragunova-quest", open);
  }, []);

  useEffect(() => {
    if (active) {
      pauseBgMusic();
      return () => resumeBgMusic();
    }
  }, [active, pauseBgMusic, resumeBgMusic]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (KONAMI[konamiIdx.current] === e.code) {
        konamiIdx.current++;
        if (konamiIdx.current === KONAMI.length) {
          konamiIdx.current = 0;
          triggerPianoQuest();
        }
      } else {
        konamiIdx.current = e.code === KONAMI[0] ? 1 : 0;
      }

      if (!active) return;
      if (e.key === "Escape") close();

      if (phase !== "play" || !target) return;

      const hint = KEYBOARD_HINTS[target.id];
      if (hint && e.key.toLowerCase() === hint.toLowerCase()) {
        e.preventDefault();
        hitNote(target);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, phase, target, hitNote]);

  useEffect(() => {
    if (!active || phase !== "play" || autoPlay) return;
    const t = setTimeout(playHint, 5000);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [active, phase, step, playHint, autoPlay]);

  useEffect(() => {
    if (!autoPlay || phase !== "play") return;

    const note = MGS_MELODY[step];
    if (!note) return;

    const delay = step === 0 ? 280 : AUTO_NOTE_MS;
    const t = setTimeout(() => {
      flashPress(note.id);
      playPianoNote(noteFreq(note.pitch, note.octave), 0.42);

      if (step >= MGS_MELODY.length - 1) {
        const done = setTimeout(() => {
          setPhase("done");
          setAutoPlay(false);
        }, 450);
        timers.current.push(done);
        return;
      }
      setStep((s) => s + 1);
    }, delay);

    timers.current.push(t);
    return () => clearTimeout(t);
  }, [autoPlay, phase, step, flashPress]);

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/92 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Tutoriel Metal Gear Solid Main Theme"
    >
      <div className="w-full max-w-2xl border border-violet/40 bg-ink-soft shadow-[0_0_48px_rgba(157,123,255,0.2)]">
        <div className="flex items-center justify-between border-b border-paper/10 px-5 py-3">
          <div>
            <p className="font-mono text-[0.55rem] uppercase tracking-[0.35em] text-cyan">
              ◆ Tutoriel assisté
            </p>
            <p className="font-display text-sm tracking-wide text-paper mt-0.5">
              Metal Gear Solid — Main Theme
            </p>
          </div>
          <button
            onClick={close}
            className="cursor-pointer text-[0.6rem] uppercase tracking-[0.2em] text-paper-dim hover:text-violet transition-colors"
          >
            ESC ✕
          </button>
        </div>

        {phase === "intro" && (
          <div className="px-6 py-12 text-center">
            <p className="font-mono text-xs text-paper-dim uppercase tracking-[0.3em] mb-4">
              Tappi Iwase · 1998
            </p>
            <p className="font-display text-xl text-paper mb-6">
              Joue la mélodie note par note.
            </p>
            <p className="text-sm text-paper-dim font-light mb-8 max-w-sm mx-auto">
              La touche illuminée est la prochaine note. Clique dessus ou utilise
              la touche clavier indiquée (E, D, C…).
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={start}
                className="cursor-pointer border border-cyan/40 px-8 py-3 font-mono text-xs uppercase tracking-[0.3em] text-cyan hover:bg-cyan/10 transition-colors"
              >
                ▶ Mode tutoriel
              </button>
              <button
                onClick={startAuto}
                className="cursor-pointer border border-violet/40 px-8 py-3 font-mono text-xs uppercase tracking-[0.3em] text-violet hover:bg-violet/10 transition-colors"
              >
                ▶ Lecture automatique
              </button>
            </div>
            <button
              onClick={listenOriginal}
              className="cursor-pointer mt-6 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-paper-dim hover:text-cyan transition-colors"
            >
              ♫ Écouter la version originale (piano)
            </button>
          </div>
        )}

        {phase === "listen" && (
          <div className="px-5 py-6">
            <p className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-cyan text-center mb-4">
              Référence · piano original
            </p>
            <div className="relative w-full overflow-hidden border border-paper/15 bg-ink aspect-video">
              <iframe
                title="Metal Gear Solid Main Theme — piano original"
                src={`https://www.youtube.com/embed/${ORIGINAL_PIANO_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <p className="text-center text-xs text-paper-dim font-light mt-4 mb-6">
              Compare avec le tutoriel pour retrouver le rythme et les nuances.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={backToIntro}
                className="cursor-pointer border border-paper/20 px-6 py-2.5 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-paper-dim hover:text-paper transition-colors"
              >
                ← Retour
              </button>
              <button
                onClick={start}
                className="cursor-pointer border border-cyan/40 px-6 py-2.5 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-cyan hover:bg-cyan/10 transition-colors"
              >
                ▶ Mode tutoriel
              </button>
              <button
                onClick={startAuto}
                className="cursor-pointer border border-violet/40 px-6 py-2.5 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-violet hover:bg-violet/10 transition-colors"
              >
                ▶ Lecture auto
              </button>
            </div>
            <p className="text-center mt-5">
              <a
                href={ORIGINAL_PIANO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.5rem] uppercase tracking-[0.2em] text-paper-dim hover:text-violet transition-colors"
              >
                Ouvrir sur YouTube ↗
              </a>
            </p>
          </div>
        )}

        {phase === "play" && target && (
          <>
            <div className="px-6 py-6">
              <div className="flex items-center justify-between mb-3 gap-4">
                <p className="font-mono text-xs text-paper-dim">
                  Note {step + 1} / {MGS_MELODY.length}
                  {autoPlay && (
                    <span className="text-violet ml-2">· lecture auto</span>
                  )}
                </p>
                <div className="flex items-center gap-3 sm:gap-4 shrink-0 flex-wrap justify-end">
                  <button
                    onClick={listenOriginal}
                    className="cursor-pointer font-mono text-[0.55rem] uppercase tracking-[0.2em] text-paper-dim hover:text-cyan transition-colors"
                  >
                    ♫ Original
                  </button>
                  {autoPlay ? (
                    <button
                      onClick={stopAuto}
                      className="cursor-pointer font-mono text-[0.55rem] uppercase tracking-[0.2em] text-paper-dim hover:text-violet transition-colors"
                    >
                      ■ Arrêter
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={startAuto}
                        className="cursor-pointer font-mono text-[0.55rem] uppercase tracking-[0.2em] text-paper-dim hover:text-violet transition-colors"
                      >
                        ▶ Lecture auto
                      </button>
                      <button
                        onClick={playHint}
                        className="cursor-pointer font-mono text-[0.55rem] uppercase tracking-[0.2em] text-paper-dim hover:text-cyan transition-colors"
                      >
                        ♪ Indice
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="h-1 bg-paper/10 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-gradient-to-r from-violet to-cyan transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center font-display text-2xl text-paper">
                {target.label}
                <span className="text-paper-dim text-lg ml-2">
                  ({target.octave})
                </span>
              </p>
              {KEYBOARD_HINTS[target.id] && (
                <p className="text-center font-mono text-[0.65rem] text-cyan mt-2 uppercase tracking-[0.25em]">
                  Touche clavier : {KEYBOARD_HINTS[target.id]}
                </p>
              )}
            </div>

            <PianoKeyboard
              target={target}
              pressed={pressed}
              wrong={wrong}
              onKeyPress={hitNote}
            />

            <p className="px-5 py-3 text-center font-mono text-[0.5rem] uppercase tracking-[0.2em] text-paper-dim border-t border-paper/10">
              {autoPlay
                ? "Les touches s'enchaînent automatiquement"
                : "Clique la touche qui pulse · Indice auto après 5 s"}
            </p>
          </>
        )}

        {phase === "done" && (
          <div className="px-6 py-12 text-center">
            <p className="font-mono text-cyan text-sm uppercase tracking-[0.4em] mb-4 animate-pulse">
              ★ Mission accomplie ★
            </p>
            <p className="font-display text-xl text-paper mb-2">
              Main Theme maîtrisée.
            </p>
            <p className="text-sm text-paper-dim font-light mb-8">
              The Best Is Yet To Come…
            </p>
            <button
              onClick={close}
              className="cursor-pointer border border-violet/40 px-8 py-3 font-mono text-xs uppercase tracking-[0.3em] text-violet hover:bg-violet/10 transition-colors"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
