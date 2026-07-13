export type Track = {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  spotifyUrl: string;
  /** Spotify track id for in-page embed controls (when available). */
  spotifyId?: string;
  localSrc?: string;
};

export const TRACK_STORAGE_KEY = "if-you-knew-me-track";
export const DEFAULT_TRACK_ID = "60s-love";

export const TRACKS: Track[] = [
  {
    id: "60s-love",
    title: "60's Love",
    artist: "Level Five",
    youtubeId: "HvH-DXHvnrM",
    spotifyId: "3h78AziF7cEXfm50J2TNcA",
    spotifyUrl: "https://open.spotify.com/track/3h78AziF7cEXfm50J2TNcA",
    localSrc: `${import.meta.env.BASE_URL}audio/60s-love.mp3`,
  },
  {
    id: "abar-hashimukh",
    title: "Abar Hashimukh",
    artist: "Shironamhin",
    youtubeId: "Cptlr__Fwx4",
    spotifyUrl:
      "https://open.spotify.com/search/Abar%20Hashimukh%20Shironamhin",
  },
  {
    id: "tumi-ashbe-bole",
    title: "Tumi Ashbe Bole",
    artist: "Nachiketa",
    youtubeId: "7gbfDlIs3hg",
    spotifyId: "45iWmUICn1eWaef0bwyP0r",
    spotifyUrl: "https://open.spotify.com/track/45iWmUICn1eWaef0bwyP0r",
  },
  {
    id: "bela-bose",
    title: "Bela Bose",
    artist: "Anjan Dutt",
    youtubeId: "HKrou2ENSe8",
    spotifyId: "7so0EN7GbY9OWt1nzCWCkw",
    spotifyUrl: "https://open.spotify.com/track/7so0EN7GbY9OWt1nzCWCkw",
  },
  {
    id: "stardew-overture",
    title: "Stardew Valley Overture",
    artist: "ConcernedApe",
    youtubeId: "FQSHcl6TJb4",
    spotifyId: "2q2Z2A0Mt8AsWyQEdB6wuu",
    spotifyUrl: "https://open.spotify.com/track/2q2Z2A0Mt8AsWyQEdB6wuu",
  },
  {
    id: "first-steps",
    title: "First Steps",
    artist: "Lena Raine",
    youtubeId: "N8OHSXvneOE",
    spotifyId: "03EyMyy76ZYLUh3lvGrNgE",
    spotifyUrl: "https://open.spotify.com/track/03EyMyy76ZYLUh3lvGrNgE",
  },
  {
    id: "home",
    title: "Home",
    artist: "Toby Fox",
    youtubeId: "J_hJDitrh8M",
    spotifyId: "5L9MJsGqzTRD09rSzHkCDy",
    spotifyUrl: "https://open.spotify.com/track/5L9MJsGqzTRD09rSzHkCDy",
  },
  {
    id: "dirtmouth",
    title: "Dirtmouth",
    artist: "Christopher Larkin",
    youtubeId: "NSlkW1fFkyo",
    spotifyId: "4gCnaT6NKQmR3hqEeHp30t",
    spotifyUrl: "https://open.spotify.com/track/4gCnaT6NKQmR3hqEeHp30t",
  },
];

export function getTrackById(id: string | null | undefined): Track {
  return TRACKS.find((t) => t.id === id) ?? TRACKS[0]!;
}

export function loadSavedTrackId(): string {
  try {
    const saved = localStorage.getItem(TRACK_STORAGE_KEY);
    if (saved && TRACKS.some((t) => t.id === saved)) return saved;
  } catch {
    /* ignore */
  }
  return DEFAULT_TRACK_ID;
}

export function saveTrackId(id: string): void {
  try {
    localStorage.setItem(TRACK_STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}

export function youtubeEmbedSrc(videoId: string): string {
  const params = new URLSearchParams({
    enablejsapi: "1",
    playsinline: "1",
    rel: "0",
    loop: "1",
    playlist: videoId,
    controls: "0",
    modestbranding: "1",
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function spotifyEmbedSrc(spotifyId: string): string {
  const params = new URLSearchParams({
    utm_source: "generator",
    theme: "0",
  });
  return `https://open.spotify.com/embed/track/${spotifyId}?${params.toString()}`;
}
