"use client";

import { unlockGameAudio } from "@/lib/gameAudio";
import { useState } from "react";
import { useMusic } from "./BackgroundMusic";

/** Petit jingle 8-bit joué via Web Audio (aucun fichier nécessaire). */
function playStartSound() {
  const ctx = new AudioContext();
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 → E5 → G5 → C6

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;

    const t = ctx.currentTime + i * 0.09;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.1, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.25);
  });

  setTimeout(() => ctx.close(), 1200);
}

export default function PressStart() {
  const [pressed, setPressed] = useState(false);
  const { play: playMusic } = useMusic();

  const onPress = () => {
    if (pressed) return;
    setPressed(true);
    void unlockGameAudio();
    try {
      playStartSound();
    } catch {
      // Web Audio indisponible : on scrolle quand même
    }
    playMusic();
    // Laisse le jingle démarrer avant de plonger vers la galerie
    setTimeout(() => {
      document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
      setPressed(false);
    }, 450);
  };

  return (
    <button
      onClick={onPress}
      className="group text-paper-dim cursor-pointer"
      aria-label="Commencer : aller à la galerie"
    >
      <span
        className={`text-[0.6rem] uppercase tracking-[0.4em] transition-colors duration-200 ${
          pressed
            ? "press-start-pressed text-cyan"
            : "press-start-blink group-hover:text-cyan"
        }`}
      >
        ▶ Press Start
      </span>
    </button>
  );
}
