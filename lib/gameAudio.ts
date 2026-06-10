/** Audio Web partagé — contourne le blocage navigateur sans interaction. */

const NOTES = [659.25, 880, 1174.66, 1567.98];

let audioCtx: AudioContext | null = null;
let chimePlayed = false;
let transitionWindowUntil = 0;
let listenersAttached = false;

function getAudioContext() {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playChime(ctx: AudioContext) {
  const start = ctx.currentTime;

  NOTES.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const t = start + i * 0.055;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.16, t + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.38);
  });
}

export function markTransitionWindow(ms = 1500) {
  transitionWindowUntil = Date.now() + ms;
}

export function isTransitionWindowOpen() {
  return Date.now() < transitionWindowUntil;
}

/** Réveille l'audio ; rejoue le chime « Entrée » si la fenêtre est encore ouverte. */
export async function unlockGameAudio() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") await ctx.resume();
    if (
      ctx.state === "running" &&
      !chimePlayed &&
      isTransitionWindowOpen()
    ) {
      playChime(ctx);
      chimePlayed = true;
    }
    return ctx.state === "running";
  } catch {
    return false;
  }
}

export function resetEnterChime() {
  chimePlayed = false;
}

export async function playCrystalTransitionChime(force = false) {
  if (chimePlayed && !force) return true;
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") await ctx.resume();
    if (ctx.state !== "running") return false;
    playChime(ctx);
    chimePlayed = true;
    return true;
  } catch {
    return false;
  }
}

/** Joué au clic sur le bouton Entrée (geste utilisateur garanti). */
export async function playEnterChime() {
  markTransitionWindow(8000);
  await unlockGameAudio();
  return playCrystalTransitionChime(true);
}

export function ensureAudioUnlockListeners() {
  if (listenersAttached || typeof document === "undefined") return;
  listenersAttached = true;

  const onInteract = () => {
    void unlockGameAudio();
  };

  document.addEventListener("pointerdown", onInteract, { passive: true });
  document.addEventListener("keydown", onInteract);
  document.addEventListener("touchstart", onInteract, { passive: true });
}
