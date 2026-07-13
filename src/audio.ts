import {
  getTrackById,
  loadSavedTrackId,
  saveTrackId,
  youtubeEmbedSrc,
  type Track,
} from "./tracks";

export type MusicApi = {
  play: () => Promise<void>;
  toggleMute: () => boolean;
  isMuted: () => boolean;
  setTrack: (trackId: string) => Promise<void>;
  getTrack: () => Track;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        opts?: Record<string, unknown>,
      ) => YTPlayer;
      PlayerState?: { ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (n: number) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  destroy: () => void;
  loadVideoById: (opts: {
    videoId: string;
    startSeconds?: number;
  }) => void;
  cueVideoById: (opts: {
    videoId: string;
    startSeconds?: number;
  }) => void;
};

const YT_ENDED = 0;

function loadYouTubeApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }

    const timeout = window.setTimeout(
      () => reject(new Error("YouTube API timed out")),
      15000,
    );

    const prior = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timeout);
      prior?.();
      resolve();
    };

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      tag.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error("Failed to load YouTube API"));
      };
      document.head.appendChild(tag);
    }
  });
}

async function hasLocalAudio(src: string): Promise<boolean> {
  try {
    const res = await fetch(src, { method: "HEAD", cache: "no-store" });
    if (!res.ok) return false;
    const type = (res.headers.get("content-type") || "").toLowerCase();
    return (
      type.startsWith("audio/") ||
      type.includes("mpeg") ||
      type.includes("mp4") ||
      type.includes("ogg")
    );
  } catch {
    return false;
  }
}

function syncIframeTitle(iframeId: string, track: Track) {
  const el = document.getElementById(iframeId);
  if (el instanceof HTMLIFrameElement) {
    el.title = `${track.title} — ${track.artist}`;
  }
}

export async function createMusic(iframeId: string): Promise<MusicApi> {
  let current = getTrackById(loadSavedTrackId());
  let player: YTPlayer | null = null;
  let local: HTMLAudioElement | null = null;
  let usingLocal = false;
  let muted = false;
  let started = false;

  const stopLocal = () => {
    if (!local) return;
    local.pause();
    local.removeAttribute("src");
    local.load();
    local = null;
  };

  const ensureLocal = async (track: Track) => {
    if (!track.localSrc || !(await hasLocalAudio(track.localSrc))) {
      return false;
    }
    stopLocal();
    local = new Audio(track.localSrc);
    local.loop = true;
    local.preload = "auto";
    local.volume = 0.6;
    local.muted = muted;
    usingLocal = true;
    return true;
  };

  const ensurePlayer = async () => {
    if (player) return player;
    await loadYouTubeApi();

    const mount = document.getElementById(iframeId);
    if (mount instanceof HTMLIFrameElement) {
      mount.src = youtubeEmbedSrc(current.youtubeId);
    }
    syncIframeTitle(iframeId, current);

    player = await new Promise<YTPlayer>((resolve, reject) => {
      let done = false;
      const finish = (p: YTPlayer) => {
        if (done) return;
        done = true;
        resolve(p);
      };

      const p = new window.YT!.Player(iframeId, {
        events: {
          onReady: (e: { target: YTPlayer }) => finish(e.target ?? p),
          onError: () => reject(new Error("YouTube playback error")),
          onStateChange: (e: { data: number; target: YTPlayer }) => {
            if (e.data === (window.YT?.PlayerState?.ENDED ?? YT_ENDED)) {
              e.target.playVideo();
            }
          },
        },
      } as Record<string, unknown>);

      window.setTimeout(() => finish(p), 2500);
    });

    return player;
  };

  const playCurrent = async () => {
    started = true;
    if (usingLocal && local) {
      local.muted = muted;
      await local.play();
      return;
    }

    const p = await ensurePlayer();
    if (muted) p.mute();
    else {
      p.unMute();
      p.setVolume(80);
    }
    p.playVideo();
    window.setTimeout(() => {
      if (muted) p.mute();
      else {
        p.unMute();
        p.setVolume(80);
      }
      p.playVideo();
    }, 500);
  };

  return {
    async play() {
      if (usingLocal && local) {
        await playCurrent();
        return;
      }
      // Prefer local file for tracks that ship one
      if (current.localSrc && (await ensureLocal(current))) {
        await playCurrent();
        return;
      }
      usingLocal = false;
      await playCurrent();
    },
    toggleMute() {
      muted = !muted;
      if (usingLocal && local) {
        local.muted = muted;
        return muted;
      }
      if (!player) return muted;
      if (muted) player.mute();
      else {
        player.unMute();
        if (started) player.playVideo();
      }
      return muted;
    },
    isMuted: () => muted,
    getTrack: () => current,
    async setTrack(trackId: string) {
      const next = getTrackById(trackId);
      if (next.id === current.id) return;
      current = next;
      saveTrackId(next.id);
      syncIframeTitle(iframeId, next);

      stopLocal();
      usingLocal = false;

      if (next.localSrc && (await ensureLocal(next))) {
        if (started) await playCurrent();
        return;
      }

      const p = await ensurePlayer();
      if (started) {
        p.loadVideoById({ videoId: next.youtubeId });
        if (muted) p.mute();
        else {
          p.unMute();
          p.setVolume(80);
        }
        p.playVideo();
      } else {
        p.cueVideoById({ videoId: next.youtubeId });
      }
    },
    destroy() {
      stopLocal();
      try {
        player?.destroy();
      } catch {
        /* ignore */
      }
      player = null;
      usingLocal = false;
      started = false;
    },
  };
}

export { youtubeEmbedSrc };
