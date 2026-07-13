type MusicApi = {
  play: () => Promise<void>;
  toggleMute: () => boolean;
  isMuted: () => boolean;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        opts?: Record<string, unknown>,
      ) => YTPlayer;
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
};

const VIDEO_ID = "HvH-DXHvnrM"; // Level Five — 60's Love
const LOCAL_SRC = `${import.meta.env.BASE_URL}audio/60s-love.mp3`;

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

async function hasLocalAudio(): Promise<boolean> {
  try {
    const res = await fetch(LOCAL_SRC, { method: "HEAD", cache: "no-store" });
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

function createLocalMusic(): MusicApi {
  const local = new Audio(LOCAL_SRC);
  local.loop = true;
  local.preload = "auto";
  local.volume = 0.6;
  let muted = false;

  return {
    async play() {
      await local.play();
    },
    toggleMute() {
      muted = !muted;
      local.muted = muted;
      return muted;
    },
    isMuted: () => muted,
    destroy() {
      local.pause();
      local.removeAttribute("src");
      local.load();
    },
  };
}

function createYouTubeMusic(iframeId: string): MusicApi {
  let player: YTPlayer | null = null;
  let muted = false;

  const ensure = async () => {
    if (player) return player;
    await loadYouTubeApi();

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
        },
      } as Record<string, unknown>);

      window.setTimeout(() => finish(p), 2500);
    });

    return player;
  };

  return {
    async play() {
      const p = await ensure();
      muted = false;
      p.unMute();
      p.setVolume(80);
      p.playVideo();
      window.setTimeout(() => {
        p.unMute();
        p.setVolume(80);
        p.playVideo();
      }, 500);
    },
    toggleMute() {
      if (!player) {
        muted = !muted;
        return muted;
      }
      muted = !muted;
      if (muted) player.mute();
      else {
        player.unMute();
        player.playVideo();
      }
      return muted;
    },
    isMuted: () => muted,
    destroy() {
      try {
        player?.destroy();
      } catch {
        /* ignore */
      }
      player = null;
    },
  };
}

export async function createMusic(iframeId: string): Promise<MusicApi> {
  if (await hasLocalAudio()) return createLocalMusic();
  return createYouTubeMusic(iframeId);
}

export { VIDEO_ID };
