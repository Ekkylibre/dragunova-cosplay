/** Mélodie principale (main droite) — Metal Gear Solid Main Theme, Tappi Iwase */

export type MelodyNote = {
  id: string;
  pitch: string;
  octave: number;
  label: string;
};

const semitones: Record<string, number> = {
  C: 0,
  Cs: 1,
  D: 2,
  Ds: 3,
  E: 4,
  F: 5,
  Fs: 6,
  G: 7,
  Gs: 8,
  A: 9,
  As: 10,
  B: 11,
};

export function noteFreq(pitch: string, octave: number): number {
  const midi = (octave + 1) * 12 + semitones[pitch];
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function n(pitch: string, octave: number, label: string): MelodyNote {
  return { id: `${pitch}${octave}`, pitch, octave, label };
}

/**
 * Thème principal piano (main droite) — Metal Gear Solid Main Theme.
 * Intro : Mi – Ré – Do – Ré – Mi – La – Mi – Ré – Do – Ré – Mi – La – Sol – Mi – Do – Ré
 *         – Mi – La – Do – Si – Do – Ré – Do – La – Sol – La – Si – Do – Si – La – Sol – La
 * Thème : Do – Ré – Mi – La – Mi – Ré – Do – Ré – Mi – La – Sol – Mi – Do – Ré – Mi – La
 *         – Do – Si – Do – Ré – Do – La – Sol – La – Si – Do – Si – La – Sol – La
 */
export const MGS_MELODY: MelodyNote[] = [
  // Intro — Mi – Ré – Do
  n("E", 5, "Mi"),
  n("D", 5, "Ré"),
  n("C", 5, "Do"),
  n("D", 5, "Ré"),
  n("E", 5, "Mi"),
  n("A", 5, "La"),
  n("E", 5, "Mi"),
  n("D", 5, "Ré"),
  n("C", 5, "Do"),
  n("D", 5, "Ré"),
  n("E", 5, "Mi"),
  n("A", 5, "La"),
  n("G", 5, "Sol"),
  n("E", 5, "Mi"),
  n("C", 5, "Do"),
  n("D", 5, "Ré"),
  n("E", 5, "Mi"),
  n("A", 5, "La"),
  n("C", 6, "Do"),
  n("B", 5, "Si"),
  n("C", 6, "Do"),
  n("D", 6, "Ré"),
  n("C", 6, "Do"),
  n("A", 5, "La"),
  n("G", 5, "Sol"),
  n("A", 5, "La"),
  n("B", 5, "Si"),
  n("C", 6, "Do"),
  n("B", 5, "Si"),
  n("A", 5, "La"),
  n("G", 5, "Sol"),
  n("A", 5, "La"),
  // Thème principal
  n("C", 5, "Do"),
  n("D", 5, "Ré"),
  n("E", 5, "Mi"),
  n("A", 5, "La"),
  n("E", 5, "Mi"),
  n("D", 5, "Ré"),
  n("C", 5, "Do"),
  n("D", 5, "Ré"),
  n("E", 5, "Mi"),
  n("A", 5, "La"),
  n("G", 5, "Sol"),
  n("E", 5, "Mi"),
  n("C", 5, "Do"),
  n("D", 5, "Ré"),
  n("E", 5, "Mi"),
  n("A", 5, "La"),
  n("C", 6, "Do"),
  n("B", 5, "Si"),
  n("C", 6, "Do"),
  n("D", 6, "Ré"),
  n("C", 6, "Do"),
  n("A", 5, "La"),
  n("G", 5, "Sol"),
  n("A", 5, "La"),
  n("B", 5, "Si"),
  n("C", 6, "Do"),
  n("B", 5, "Si"),
  n("A", 5, "La"),
  n("G", 5, "Sol"),
  n("A", 5, "La"),
];

/** Touches clavier pour les notes blanches (octaves 5–6) */
export const KEYBOARD_HINTS: Partial<Record<string, string>> = {
  C5: "C",
  D5: "D",
  E5: "E",
  F5: "F",
  G5: "G",
  A5: "A",
  B5: "B",
  C6: "Y",
  D6: "H",
  E6: "U",
};
