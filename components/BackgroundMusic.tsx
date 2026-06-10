"use client";

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

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const playerRef = useRef<YTPlayer | null>(null);
  const volumeRef = useRef(DEFAULT_VOLUME);
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);

  useEffect(() => {
    const storedEnabled = localStorage.getItem(STORAGE_KEY_ENABLED);
    if (storedEnabled !== null) setEnabled(storedEnabled === "true");

    const storedVolume = localStorage.getItem(STORAGE_KEY_VOLUME);
    if (storedVolume !== null) {
      const v = Math.min(100, Math.max(0, Number(storedVolume)));
      if (!Number.isNaN(v)) {
        volumeRef.current = v;
        setVolumeState(v);
      }
    }
  }, []);

  const applyVolume = useCallback((v: number) => {
    volumeRef.current = v;
    setVolumeState(v);
    localStorage.setItem(STORAGE_KEY_VOLUME, String(v));
    playerRef.current?.setVolume(v);
  }, []);

  const startPlayback = useCallback(() => {
    if (!playerRef.current) return;
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
    if (!playerRef.current || !enabled || volumeRef.current === 0) return;
    startPlayback();
  }, [enabled, startPlayback]);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY_ENABLED, String(next));

      if (!playerRef.current) return next;

      if (next && volumeRef.current > 0) {
        startPlayback();
      } else {
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
        localStorage.setItem(STORAGE_KEY_ENABLED, "false");
        return;
      }

      playerRef.current.unMute();
      setEnabled((wasEnabled) => {
        if (!wasEnabled) {
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
      value={{ enabled, volume, ready, toggle, setVolume, play }}
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
      className="group fixed bottom-6 right-6 z-50 flex items-center border border-paper/15 bg-ink/80 backdrop-blur-sm transition-colors duration-300 hover:border-cyan/30"
      role="group"
      aria-label="Contrôles de la musique de fond"
    >
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

      <div className="max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:max-w-32 group-hover:opacity-100 group-hover:pl-3 group-focus-within:max-w-32 group-focus-within:opacity-100 group-focus-within:pl-3">
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
          className="music-volume-slider block h-1 w-28 cursor-pointer appearance-none rounded-full bg-paper/15 disabled:cursor-wait disabled:opacity-40"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={volume}
          aria-valuetext={`${volume} %`}
        />
      </div>
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
