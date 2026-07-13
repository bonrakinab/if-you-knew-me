export type Track = {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  spotifyUrl: string;
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
    spotifyUrl:
      "https://open.spotify.com/search/60%27s%20Love%20Level%20Five",
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
    spotifyUrl: "https://open.spotify.com/track/45iWmUICn1eWaef0bwyP0r",
  },
  {
    id: "bela-bose",
    title: "Bela Bose",
    artist: "Anjan Dutt",
    youtubeId: "HKrou2ENSe8",
    spotifyUrl: "https://open.spotify.com/search/Bela%20Bose%20Anjan%20Dutt",
  },
  {
    id: "stardew-overture",
    title: "Stardew Valley Overture",
    artist: "ConcernedApe",
    youtubeId: "FQSHcl6TJb4",
    spotifyUrl: "https://open.spotify.com/track/2q2Z2A0Mt8AsWyQEdB6wuu",
  },
  {
    id: "first-steps",
    title: "First Steps",
    artist: "Lena Raine",
    youtubeId: "N8OHSXvneOE",
    spotifyUrl: "https://open.spotify.com/track/03EyMyy76ZYLUh3lvGrNgE",
  },
  {
    id: "home",
    title: "Home",
    artist: "Toby Fox",
    youtubeId: "J_hJDitrh8M",
    spotifyUrl: "https://open.spotify.com/track/5L9MJsGqzTRD09rSzHkCDy",
  },
  {
    id: "dirtmouth",
    title: "Dirtmouth",
    artist: "Christopher Larkin",
    youtubeId: "NSlkW1fFkyo",
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
