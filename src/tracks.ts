export type Track = {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  spotifyUrl: string;
  /** Spotify track id for Web Playback / Open in Spotify (when available). */
  spotifyId?: string;
  localSrc?: string;
};

export const TRACK_STORAGE_KEY = "if-you-knew-me-track-v2";
export const DEFAULT_TRACK_ID = "shesh-bikele";

/** Nepali songs for Chapter 2 — the desert. */
export const NEPALI_TRACKS: Track[] = [
  {
    id: "chithi-bhitra",
    title: "Chitthi Bhitra",
    artist: "Sajjan Raj Vaidya",
    youtubeId: "GrlAInfP990",
    spotifyUrl:
      "https://open.spotify.com/search/Chitthi%20Bhitra%20Sajjan%20Raj%20Vaidya",
  },
  {
    id: "lakhau-hajarau",
    title: "Lakhau Hajarau",
    artist: "Yabesh Thapa",
    youtubeId: "TgchKIbo5uw",
    spotifyUrl:
      "https://open.spotify.com/search/Lakhau%20Hajarau%20Yabesh%20Thapa",
  },
  {
    id: "parkhaai",
    title: "Parkhaai",
    artist: "Sajjan Raj Vaidya",
    youtubeId: "Y3bDy6FTgMY",
    spotifyUrl:
      "https://open.spotify.com/search/Parkhaai%20Sajjan%20Raj%20Vaidya",
  },
  {
    id: "firfirey",
    title: "Firfirey",
    artist: "Yabesh Thapa",
    youtubeId: "9-KMqHAGlu0",
    spotifyUrl: "https://open.spotify.com/search/Firfirey%20Yabesh%20Thapa",
  },
  {
    id: "muskuraye",
    title: "Muskuraye",
    artist: "Yabesh Thapa",
    youtubeId: "Ryk8iXMxJjc",
    spotifyUrl: "https://open.spotify.com/search/Muskuraye%20Yabesh%20Thapa",
  },
  {
    id: "hawaijahaj",
    title: "Hawaijahaj",
    artist: "Sajjan Raj Vaidya",
    youtubeId: "Kni9OFsh8UM",
    spotifyUrl:
      "https://open.spotify.com/search/Hawaijahaj%20Sajjan%20Raj%20Vaidya",
  },
];

/** Arnob (Shayan Chowdhury) — quieter, rain-and-rooftop songs. */
export const ARNOB_TRACKS: Track[] = [
  {
    id: "she-je-boshe-ache",
    title: "She Je Boshe Ache",
    artist: "Arnob",
    youtubeId: "nDMZA5yRM0U",
    spotifyUrl:
      "https://open.spotify.com/search/She%20Je%20Boshe%20Ache%20Arnob",
  },
  {
    id: "she-je-boshe-ache-space",
    title: "She Je Boshe Ache (Space Edition)",
    artist: "Arnob",
    youtubeId: "4ngJIJjfd8Y",
    spotifyUrl:
      "https://open.spotify.com/search/She%20Je%20Boshe%20Ache%20Space%20Edition%20Arnob",
  },
  {
    id: "tomar-jonno",
    title: "Tomar Jonno",
    artist: "Arnob",
    youtubeId: "Zv9PcTG7mAc",
    spotifyUrl: "https://open.spotify.com/search/Tomar%20Jonno%20Arnob",
  },
  {
    id: "hok-kolorob",
    title: "Hok Kolorob",
    artist: "Arnob",
    youtubeId: "l2m0KysRXkc",
    spotifyUrl: "https://open.spotify.com/search/Hok%20Kolorob%20Arnob",
  },
  {
    id: "prokrito-jol",
    title: "Prokrito Jol",
    artist: "Arnob",
    youtubeId: "eAM7mLwClZE",
    spotifyUrl: "https://open.spotify.com/search/Prokrito%20Jol%20Arnob",
  },
];

export const TRACKS: Track[] = [
  {
    id: "shesh-bikele",
    title: "Shesh Bikele",
    artist: "Tajwar",
    youtubeId: "Qnkfp1vUoVI",
    spotifyId: "0AynhD61CWFlwEPxrVQqFD",
    spotifyUrl: "https://open.spotify.com/track/0AynhD61CWFlwEPxrVQqFD",
  },
  {
    id: "mawlana",
    title: "Mawlana",
    artist: "Tajwar",
    youtubeId: "_TZnd9VkeqM",
    spotifyId: "202Hj8fLIlTRTuPPQNPjt6",
    spotifyUrl: "https://open.spotify.com/track/202Hj8fLIlTRTuPPQNPjt6",
  },
  {
    id: "ayhay",
    title: "Ayhay",
    artist: "Tajwar",
    youtubeId: "m9jS2_PUAjw",
    spotifyUrl: "https://open.spotify.com/search/Ayhay%20Tajwar",
  },
  {
    id: "mashallah",
    title: "Mashallah",
    artist: "Tajwar",
    youtubeId: "BHWVQ_jBTGU",
    spotifyUrl: "https://open.spotify.com/search/Mashallah%20Tajwar",
  },
  {
    id: "dhaka-on-my-mind",
    title: "Dhaka On My Mind",
    artist: "Tajwar",
    youtubeId: "g3Qn4HOVpJQ",
    spotifyUrl:
      "https://open.spotify.com/search/Dhaka%20On%20My%20Mind%20Tajwar",
  },
  {
    id: "shojoni",
    title: "Shojoni",
    artist: "Shibu & Tajwar",
    youtubeId: "CGFuvhaaINo",
    spotifyUrl: "https://open.spotify.com/search/SHOJONI%20Shibu%20Tajwar",
  },
  {
    id: "ami-tomar-moner-vitor",
    title: "Ami Tomar Moner Vitor",
    artist: "Habib Wahid & Nancy",
    youtubeId: "BPPLC6eD4BA",
    spotifyId: "2JU4bkZOLDrGFGGeAsD6gK",
    spotifyUrl: "https://open.spotify.com/track/2JU4bkZOLDrGFGGeAsD6gK",
  },
  {
    id: "beni-khuley",
    title: "Beni Khuley",
    artist: "Habib Wahid & Muza",
    youtubeId: "WhXsfZpHsWE",
    spotifyId: "4awSQT4xNM70C77YMJyqfF",
    spotifyUrl: "https://open.spotify.com/track/4awSQT4xNM70C77YMJyqfF",
  },
  {
    id: "moha-jadu",
    title: "Moha Jadu",
    artist: "Habib Wahid & Mehrnigori Rustam",
    youtubeId: "UghMf59vDJM",
    spotifyId: "72iCVDN10ihLqPgm6U9z0z",
    spotifyUrl: "https://open.spotify.com/track/72iCVDN10ihLqPgm6U9z0z",
  },
  {
    id: "valobashbo-bashbo-re",
    title: "Valobashbo Bashbo Re",
    artist: "Habib Wahid",
    youtubeId: "IWAke2_ogeI",
    spotifyUrl:
      "https://open.spotify.com/search/Valobashbo%20Bashbo%20Re%20Habib%20Wahid",
  },
  {
    id: "cholo-na",
    title: "Cholo Na",
    artist: "Habib Wahid & Fuad",
    youtubeId: "-qaRJIP0U2I",
    spotifyUrl: "https://open.spotify.com/search/Cholo%20Na%20Habib%20Wahid",
  },
  {
    id: "hariye-fela-bhalobasha",
    title: "Hariye Fela Bhalobasha",
    artist: "Habib Wahid",
    youtubeId: "zQjvGFV8cBk",
    spotifyUrl:
      "https://open.spotify.com/search/Hariye%20Fela%20Bhalobasha%20Habib%20Wahid",
  },
  {
    id: "din-gelo",
    title: "Din Gelo",
    artist: "Habib Wahid",
    youtubeId: "sAqUdcz-jRA",
    spotifyUrl: "https://open.spotify.com/search/Din%20Gelo%20Habib%20Wahid",
  },
  {
    id: "moina-go",
    title: "Moina Go",
    artist: "Habib Wahid",
    youtubeId: "40XLVuPlL4I",
    spotifyUrl: "https://open.spotify.com/search/Moina%20Go%20Habib%20Wahid",
  },
  {
    id: "moner-thikana",
    title: "Moner Thikana",
    artist: "Habib Wahid",
    youtubeId: "0OrRQ0PA5F4",
    spotifyUrl:
      "https://open.spotify.com/search/Moner%20Thikana%20Habib%20Wahid",
  },
  {
    id: "bhalobasa-dao",
    title: "Bhalobasa Dao Bhalobasa Nao",
    artist: "Habib Wahid",
    youtubeId: "v4J1NtT4114",
    spotifyId: "4uqrDdawq9ZR7YCOSghfAx",
    spotifyUrl: "https://open.spotify.com/track/4uqrDdawq9ZR7YCOSghfAx",
  },
  ...ARNOB_TRACKS,
  ...NEPALI_TRACKS,
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
