"use client";

import {
  ensureAudioUnlockListeners,
  unlockGameAudio,
} from "@/lib/gameAudio";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const VIDEO_ID = "SX2mpF3Ecqs";
const STORAGE_KEY_ENABLED = "dragunova-music-enabled";
const STORAGE_KEY_VOLUME = "dragunova-music-volume";
const DEFAULT_VOLUME = 35;

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  destroy: () => void;
};

type MusicContextValue = {
  enabled: boolean;
  volume: number;
  ready: boolean;
  toggle: () => void;
  setVolume: (volume: number) => void;
  play: () => void;
  /** Pause temporaire (ex. easter egg) sans modifier les préférences. */
  pause: () => void;
  resume: () => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic doit être utilisé dans MusicProvider");
  return ctx;
}

function loadYouTubeAPI(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();

  return new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };

    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const check = setInterval(() => {
        if (window.YT?.Player) {
          clearInterval(check);
          resolve();
        }
      }, 50);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });
}

function readStoredEnabled(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY_ENABLED);
  return stored !== null ? stored === "true" : true;
}

function readStoredVolume(): number {
  const stored = localStorage.getItem(STORAGE_KEY_VOLUME);
  if (stored === null) return DEFAULT_VOLUME;
  const v = Math.min(100, Math.max(0, Number(stored)));
  return Number.isNaN(v) ? DEFAULT_VOLUME : v;
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  /** Valeurs par défaut identiques serveur/client — localStorage lu après montage. */
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const enabledRef = useRef(true);
  const volumeRef = useRef(DEFAULT_VOLUME);
  /** Bloque toute reprise (autoplay, clics) pendant l'easter egg piano. */
  const overlayPausedRef = useRef(false);

  useEffect(() => {
    const storedEnabled = readStoredEnabled();
    const storedVolume = readStoredVolume();
    enabledRef.current = storedEnabled;
    volumeRef.current = storedVolume;
    setEnabled(storedEnabled);
    setVolumeState(storedVolume);
  }, []);

  useEffect(() => {
    ensureAudioUnlockListeners();
  }, []);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  const applyVolume = useCallback((v: number) => {
    volumeRef.current = v;
    setVolumeState(v);
    localStorage.setItem(STORAGE_KEY_VOLUME, String(v));
    playerRef.current?.setVolume(v);
  }, []);

  const startPlayback = useCallback(() => {
    if (!playerRef.current || overlayPausedRef.current) return;
    void unlockGameAudio();
    playerRef.current.unMute();
    playerRef.current.setVolume(volumeRef.current);
    playerRef.current.playVideo();
  }, []);

  useEffect(() => {
    let destroyed = false;

    loadYouTubeAPI().then(() => {
      if (destroyed || playerRef.current) return;

      new window.YT.Player("yt-player", {
        height: "0",
        width: "0",
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: VIDEO_ID,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            playerRef.current = e.target;
            e.target.setVolume(volumeRef.current);
            setReady(true);
            if (
              enabledRef.current &&
              volumeRef.current > 0 &&
              !overlayPausedRef.current
            ) {
              e.target.unMute();
              e.target.setVolume(volumeRef.current);
              e.target.playVideo();
            }
          },
        },
      });
    });

    return () => {
      destroyed = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  const play = useCallback(() => {
    if (
      !playerRef.current ||
      !enabledRef.current ||
      volumeRef.current === 0 ||
      overlayPausedRef.current
    )
      return;
    startPlayback();
  }, [startPlayback]);

  /** Démarre par défaut ; repli si le navigateur bloque l'autoplay. */
  useEffect(() => {
    if (!ready || !enabled || volume === 0) return;

    play();

    const unlock = () => {
      void unlockGameAudio();
      if (!overlayPausedRef.current) play();
    };
    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });

    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, [ready, enabled, volume, play]);

  const pause = useCallback(() => {
    overlayPausedRef.current = true;
    if (!playerRef.current) return;
    playerRef.current.pauseVideo();
    playerRef.current.mute();
  }, []);

  const resume = useCallback(() => {
    overlayPausedRef.current = false;
    if (!playerRef.current || !enabled || volumeRef.current === 0) return;
    startPlayback();
  }, [enabled, startPlayback]);

  /** Coupe la musique dès l'ouverture de l'easter egg (avant le re-render React). */
  useEffect(() => {
    const onQuest = () => pause();
    window.addEventListener("dragunova-quest", onQuest);
    return () => window.removeEventListener("dragunova-quest", onQuest);
  }, [pause]);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      enabledRef.current = next;
      localStorage.setItem(STORAGE_KEY_ENABLED, String(next));

      if (!playerRef.current) return next;

      if (next && volumeRef.current > 0 && !overlayPausedRef.current) {
        startPlayback();
      } else if (!next) {
        playerRef.current.pauseVideo();
        playerRef.current.mute();
      }

      return next;
    });
  }, [startPlayback]);

  const setVolume = useCallback(
    (v: number) => {
      const clamped = Math.min(100, Math.max(0, Math.round(v)));
      applyVolume(clamped);

      if (!playerRef.current) return;

      if (clamped === 0) {
        playerRef.current.pauseVideo();
        playerRef.current.mute();
        setEnabled(false);
        enabledRef.current = false;
        localStorage.setItem(STORAGE_KEY_ENABLED, "false");
        return;
      }

      playerRef.current.unMute();
      setEnabled((wasEnabled) => {
        if (!wasEnabled) {
          enabledRef.current = true;
          localStorage.setItem(STORAGE_KEY_ENABLED, "true");
          startPlayback();
          return true;
        }
        return wasEnabled;
      });
    },
    [applyVolume, startPlayback]
  );

  return (
    <MusicContext.Provider
      value={{ enabled, volume, ready, toggle, setVolume, play, pause, resume }}
    >
      {children}
      <div
        id="yt-player"
        aria-hidden
        className="fixed -left-[9999px] -top-[9999px] h-px w-px overflow-hidden pointer-events-none"
      />
      <MusicControls
        enabled={enabled}
        volume={volume}
        ready={ready}
        onToggle={toggle}
        onVolumeChange={setVolume}
      />
    </MusicContext.Provider>
  );
}

function MusicControls({
  enabled,
  volume,
  ready,
  onToggle,
  onVolumeChange,
}: {
  enabled: boolean;
  volume: number;
  ready: boolean;
  onToggle: () => void;
  onVolumeChange: (volume: number) => void;
}) {
  const showMuted = !enabled || volume === 0;

  return (
    <div
      className="group fixed bottom-6 right-6 z-50 flex flex-col items-stretch border border-paper/15 bg-ink/80 backdrop-blur-sm transition-colors duration-300 hover:border-cyan/30 focus-within:border-cyan/30"
      role="group"
      aria-label="Contrôles de la musique de fond"
    >
      <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100">
        <div className="overflow-hidden">
          <div className="flex h-28 w-11 items-center justify-center pt-3">
            <label className="sr-only" htmlFor="music-volume">
              Volume de la musique
            </label>
            <input
              id="music-volume"
              type="range"
              min={0}
              max={100}
              value={volume}
              disabled={!ready}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="music-volume-slider music-volume-slider-vertical cursor-pointer disabled:cursor-wait disabled:opacity-40"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={volume}
              aria-valuetext={`${volume} %`}
            />
          </div>
        </div>
      </div>

      <button
        onClick={onToggle}
        disabled={!ready}
        aria-label={
          showMuted ? "Activer la musique de fond" : "Couper la musique de fond"
        }
        aria-pressed={!showMuted}
        className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-paper-dim transition-colors duration-300 hover:text-cyan disabled:cursor-wait disabled:opacity-40"
      >
        {showMuted ? <IconMuted /> : <IconVolume />}
      </button>
    </div>
  );
}

function IconVolume() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-5 w-5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25h4.875c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125H6.75a1.125 1.125 0 0 1-1.125-1.125v-5.25c0-.621.504-1.125 1.125-1.125Z"
      />
    </svg>
  );
}

function IconMuted() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-5 w-5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
      />
    </svg>
  );
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: Record<string, unknown>
      ) => unknown;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}
