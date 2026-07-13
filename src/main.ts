import "./style.css";
import { createWorld } from "./scene";
import { discoveries } from "./discoveries";
import { poetQuotes } from "./quotes";
import { createMusic } from "./audio";
import { createAmbient } from "./ambient";
import {
  TRACKS,
  getTrackById,
  loadSavedTrackId,
  saveTrackId,
  youtubeEmbedSrc,
  type Track,
} from "./tracks";
import {
  fetchWeather,
  formatLocalDate,
  formatLocalTime,
  type WeatherSnapshot,
} from "./weather";

const canvas = document.querySelector<HTMLCanvasElement>("#world");
const gate = document.querySelector<HTMLElement>("#gate");
const enter = document.querySelector<HTMLButtonElement>("#enter");
const hud = document.querySelector<HTMLElement>("#hud");
const foundEl = document.querySelector<HTMLElement>("#found");
const totalEl = document.querySelector<HTMLElement>("#total");
const compass = document.querySelector<HTMLElement>("#compass");
const note = document.querySelector<HTMLElement>("#note");
const noteTitle = document.querySelector<HTMLElement>("#note-title");
const noteText = document.querySelector<HTMLElement>("#note-text");
const noteClose = document.querySelector<HTMLButtonElement>("#note-close");
const finale = document.querySelector<HTMLElement>("#finale");
const finaleContinue =
  document.querySelector<HTMLButtonElement>("#finale-continue");
const dedication = document.querySelector<HTMLElement>("#dedication");
const dedicationOther = document.querySelector<HTMLElement>("#dedication-other");
const letterbox = document.querySelector<HTMLElement>("#letterbox");
const herName = document.querySelector<HTMLInputElement>("#her-name");
const herNote = document.querySelector<HTMLTextAreaElement>("#her-note");
const saveNote = document.querySelector<HTMLButtonElement>("#save-note");
const savedNote = document.querySelector<HTMLElement>("#saved-note");
const letterboxClose =
  document.querySelector<HTMLButtonElement>("#letterbox-close");
const vinyl = document.querySelector<HTMLElement>("#vinyl");
const vinylArtist = document.querySelector<HTMLElement>("#vinyl-artist");
const eq = document.querySelector<HTMLElement>("#eq");
const muteBtn = document.querySelector<HTMLButtonElement>("#mute");
const songToggle = document.querySelector<HTMLButtonElement>("#song-toggle");
const songPanel = document.querySelector<HTMLElement>("#song-panel");
const songPanelClose =
  document.querySelector<HTMLButtonElement>("#song-panel-close");
const trackList = document.querySelector<HTMLElement>("#track-list");
const trackListGarden = document.querySelector<HTMLElement>("#track-list-garden");
const songTitleEl = document.querySelector<HTMLElement>("#song-title");
const songCreditEl = document.querySelector<HTMLElement>("#song-credit");
const spotifyLink = document.querySelector<HTMLAnchorElement>("#spotify-link");
const spotifyLinkGarden =
  document.querySelector<HTMLAnchorElement>("#spotify-link-garden");
const ytMount = document.querySelector<HTMLIFrameElement>("#yt-mount");
const songKicker = document.querySelector<HTMLElement>(".song-kicker");
const playSongBtn = document.querySelector<HTMLButtonElement>("#play-song");
const faithCoinsEl = document.querySelector<HTMLElement>("#faith-coins");
const faithTotalEl = document.querySelector<HTMLElement>("#faith-total");
const coinsRow = document.querySelector<HTMLElement>(".coins");
const coinToast = document.querySelector<HTMLElement>("#coin-toast");
const atmosStage = document.querySelector<HTMLElement>("#atmos-stage");
const localTimeEl = document.querySelector<HTMLElement>("#local-time");
const localDateEl = document.querySelector<HTMLElement>("#local-date");
const weatherTempEl = document.querySelector<HTMLElement>("#weather-temp");
const weatherLabelEl = document.querySelector<HTMLElement>("#weather-label");
const weatherPlaceEl = document.querySelector<HTMLElement>("#weather-place");
const dpad = document.querySelector<HTMLElement>("#dpad");

if (
  !canvas ||
  !gate ||
  !enter ||
  !hud ||
  !foundEl ||
  !totalEl ||
  !compass ||
  !note ||
  !noteTitle ||
  !noteText ||
  !noteClose ||
  !finale ||
  !finaleContinue ||
  !dedication ||
  !dedicationOther ||
  !letterbox ||
  !herName ||
  !herNote ||
  !saveNote ||
  !savedNote ||
  !letterboxClose ||
  !vinyl ||
  !vinylArtist ||
  !eq ||
  !muteBtn ||
  !songToggle ||
  !songPanel ||
  !songPanelClose ||
  !trackList ||
  !trackListGarden ||
  !songTitleEl ||
  !songCreditEl ||
  !spotifyLink ||
  !spotifyLinkGarden ||
  !ytMount ||
  !playSongBtn ||
  !faithCoinsEl ||
  !faithTotalEl ||
  !coinsRow ||
  !coinToast ||
  !atmosStage ||
  !localTimeEl ||
  !localDateEl ||
  !weatherTempEl ||
  !weatherLabelEl ||
  !weatherPlaceEl ||
  !dpad
) {
  throw new Error("Missing required UI elements");
}

const NOTE_KEY = "if-you-knew-me-letter";

let selectedTrack = getTrackById(loadSavedTrackId());

const applyTrackUi = (track: Track) => {
  selectedTrack = track;
  songTitleEl.textContent = track.title;
  songCreditEl.textContent = track.artist;
  vinylArtist.textContent = track.artist;
  spotifyLink.href = track.spotifyUrl;
  spotifyLinkGarden.href = track.spotifyUrl;
  ytMount.title = `${track.title} — ${track.artist}`;

  for (const btn of document.querySelectorAll<HTMLButtonElement>(
    ".track-option",
  )) {
    const on = btn.dataset.trackId === track.id;
    btn.classList.toggle("is-selected", on);
    btn.setAttribute("aria-checked", on ? "true" : "false");
  }
};

const renderTrackList = (container: HTMLElement) => {
  container.replaceChildren();
  for (const track of TRACKS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "track-option";
    btn.dataset.trackId = track.id;
    btn.setAttribute("role", "radio");
    btn.setAttribute(
      "aria-checked",
      track.id === selectedTrack.id ? "true" : "false",
    );
    if (track.id === selectedTrack.id) btn.classList.add("is-selected");

    const title = document.createElement("span");
    title.className = "track-option-title";
    title.textContent = track.title;
    const artist = document.createElement("span");
    artist.className = "track-option-artist";
    artist.textContent = track.artist;
    btn.append(title, artist);
    container.append(btn);
  }
};

renderTrackList(trackList);
renderTrackList(trackListGarden);
applyTrackUi(selectedTrack);
ytMount.src = youtubeEmbedSrc(selectedTrack.youtubeId);

const setSongPanelOpen = (open: boolean) => {
  songPanel.classList.toggle("is-hidden", !open);
  songToggle.setAttribute("aria-expanded", open ? "true" : "false");
};
totalEl.textContent = String(discoveries.length);
faithTotalEl.textContent = String(poetQuotes.length);

const showNote = (title: string, text: string) => {
  noteTitle.textContent = title;
  noteText.textContent = text;
  note.classList.remove("is-hidden");
};

let toastTimer = 0;
const showFaithCoinToast = () => {
  coinToast.classList.remove("is-hidden", "is-leaving");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    coinToast.classList.add("is-leaving");
    window.setTimeout(() => {
      coinToast.classList.add("is-hidden");
      coinToast.classList.remove("is-leaving");
    }, 450);
  }, 1600);
};

const showDedication = (name?: string) => {
  dedicationOther.textContent = name?.trim() || "তুমি";
  dedication.classList.remove("is-hidden");
  window.setTimeout(() => dedication.classList.add("is-hidden"), 4200);
};

const openLetterbox = () => {
  finale.classList.add("is-hidden");
  letterbox.classList.remove("is-hidden");
  const existing = localStorage.getItem(NOTE_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing) as { name?: string; note?: string };
      if (parsed.name) herName.value = parsed.name;
      if (parsed.note) {
        herNote.value = parsed.note;
        savedNote.textContent = `Saved: “${parsed.note}”`;
        savedNote.classList.remove("is-hidden");
      }
    } catch {
      /* ignore */
    }
  }
  window.setTimeout(() => herNote.focus(), 50);
};

const world = createWorld(canvas, {
  onDiscover(item, foundCount) {
    foundEl.textContent = String(foundCount);
    showNote(item.title, item.text);
    compass.textContent =
      foundCount >= discoveries.length
        ? "চিঠিগুলো পড়া হয়েছে — ফুল ও চেরি গাছও ছুঁয়ে দেখো"
        : "চিঠির আলো, জ্বলন্ত ফুল, চেরিগাছ — ঘুরে দেখো";
  },
  onQuote(quote, info) {
    showNote(quote.poet, quote.text);
    faithCoinsEl.textContent = String(info.faithCoins);
    if (info.isNew) {
      coinsRow.classList.remove("is-pulse");
      void coinsRow.offsetWidth;
      coinsRow.classList.add("is-pulse");
      showFaithCoinToast();
      compass.textContent = `Faith coin · star ${info.faithCoins}/${info.totalQuotes}`;
    } else {
      compass.textContent = "কবিতার ফুল ও চেরিগাছ ছুঁয়ে আরও পড়ো";
    }
  },
  onConstellationComplete() {
    const saved = localStorage.getItem(NOTE_KEY);
    let name = "";
    if (saved) {
      try {
        name = (JSON.parse(saved) as { name?: string }).name || "";
      } catch {
        /* ignore */
      }
    }
    showDedication(name);
    compass.textContent = "Constellation complete";
  },
  onComplete() {
    window.setTimeout(() => {
      note.classList.add("is-hidden");
      finale.classList.remove("is-hidden");
    }, 2200);
  },
  onHoverChange(title) {
    if (note.classList.contains("is-hidden")) {
      compass.textContent = title
        ? `Toward: ${title}`
        : "চিঠির আলো, জ্বলন্ত ফুল, চেরিগাছ — ঘুরে দেখো";
    }
  },
});

let music: Awaited<ReturnType<typeof createMusic>> | null = null;
let opening = false;
let musicPromise: Promise<Awaited<ReturnType<typeof createMusic>>> | null =
  null;
const ambient = createAmbient();
let soundMuted = false;

const ensureMusic = async () => {
  if (music) return music;
  if (!musicPromise) {
    musicPromise = createMusic("yt-mount").then((api) => {
      music = api;
      return api;
    });
  }
  return musicPromise;
};

ensureMusic().catch((err) => {
  console.warn("Music setup failed:", err);
  musicPromise = null;
});

const syncMuteUi = (muted: boolean) => {
  soundMuted = muted;
  muteBtn.classList.toggle("is-muted", muted);
  muteBtn.setAttribute("aria-label", muted ? "Unmute sound" : "Mute sound");
  muteBtn.title = muted ? "Unmute" : "Mute";
  ambient.setMuted(muted);
};

const openGarden = () => {
  muteBtn.classList.remove("is-hidden");
  songToggle.classList.remove("is-hidden");
  dpad.classList.remove("is-hidden");
  gate.classList.add("is-leaving");
  document.body.classList.remove("is-prologue");
  document.body.classList.add("is-garden");
  window.setTimeout(() => {
    gate.classList.add("is-hidden");
    hud.classList.remove("is-hidden");
    world.enable();
  }, 1200);
};

const beats = Array.from(document.querySelectorAll<HTMLElement>("[data-beat]"));
const beatObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    }
  },
  { root: gate, threshold: 0.45 },
);
for (const beat of beats) beatObserver.observe(beat);

const selectTrack = async (trackId: string) => {
  const track = getTrackById(trackId);
  saveTrackId(track.id);
  applyTrackUi(track);
  try {
    const api = await ensureMusic();
    await api.setTrack(track.id);
  } catch (err) {
    console.warn("Track switch failed:", err);
  }
};

const onTrackListClick = (e: Event) => {
  const target = (e.target as HTMLElement).closest<HTMLButtonElement>(
    ".track-option",
  );
  if (!target?.dataset.trackId) return;
  void selectTrack(target.dataset.trackId);
};

trackList.addEventListener("click", onTrackListClick);
trackListGarden.addEventListener("click", onTrackListClick);

songToggle.addEventListener("click", () => {
  setSongPanelOpen(songPanel.classList.contains("is-hidden"));
});

songPanelClose.addEventListener("click", () => setSongPanelOpen(false));

const startSong = async () => {
  const api = await ensureMusic();
  await api.setTrack(selectedTrack.id);
  await api.play();
  await ambient.start();
  ambient.setMuted(soundMuted);
  vinyl.classList.add("is-spinning");
  eq.classList.add("is-playing");
  if (songKicker) songKicker.textContent = "now playing";
  playSongBtn.classList.add("is-hidden");
  muteBtn.classList.remove("is-hidden");
  songToggle.classList.remove("is-hidden");
  syncMuteUi(false);
};

playSongBtn.addEventListener("click", async () => {
  playSongBtn.disabled = true;
  playSongBtn.textContent = "Starting…";
  try {
    await startSong();
    playSongBtn.textContent = "Playing";
  } catch (err) {
    console.warn(err);
    playSongBtn.disabled = false;
    playSongBtn.textContent = "Try play again";
    if (songKicker) songKicker.textContent = "blocked — try again";
  }
});

enter.addEventListener("click", async () => {
  if (opening) return;
  opening = true;
  enter.disabled = true;
  enter.textContent = "Starting the song…";

  let played = false;
  try {
    await startSong();
    played = true;
  } catch (err) {
    console.warn("Playback failed:", err);
    try {
      await ambient.start();
    } catch {
      /* ignore */
    }
    if (songKicker) songKicker.textContent = "use Play song first";
    playSongBtn.classList.remove("is-hidden");
    playSongBtn.disabled = false;
  }

  enter.textContent = played ? "Opening the evening…" : "Entering quietly…";
  openGarden();
});

muteBtn.addEventListener("click", async () => {
  if (!music) {
    try {
      await startSong();
    } catch (err) {
      console.warn(err);
      syncMuteUi(!soundMuted);
    }
    return;
  }

  if (music.isMuted() || soundMuted) {
    const next = music.toggleMute();
    syncMuteUi(next);
    if (!next) await music.play();
    return;
  }

  syncMuteUi(music.toggleMute());
});

noteClose.addEventListener("click", () => {
  note.classList.add("is-hidden");
});

finaleContinue.addEventListener("click", (e) => {
  e.stopPropagation();
  openLetterbox();
});

finale.addEventListener("click", (e) => {
  if ((e.target as HTMLElement).closest("#finale-continue")) return;
  finale.classList.add("is-hidden");
});

saveNote.addEventListener("click", () => {
  const payload = {
    name: herName.value.trim(),
    note: herNote.value.trim(),
    at: new Date().toISOString(),
  };
  if (!payload.note) {
    herNote.focus();
    return;
  }
  localStorage.setItem(NOTE_KEY, JSON.stringify(payload));
  savedNote.textContent = `Saved: “${payload.note}”`;
  savedNote.classList.remove("is-hidden");
  if (payload.name) {
    dedicationOther.textContent = payload.name;
  }
  compass.textContent = "তোমার বাক্য এখানে আছে";
});

letterboxClose.addEventListener("click", () => {
  letterbox.classList.add("is-hidden");
});

let weatherTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

const hourInTz = (timezone: string, now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "numeric",
    hour12: false,
  }).formatToParts(now);
  return Number(parts.find((p) => p.type === "hour")?.value ?? now.getHours());
};

const paintClock = () => {
  const now = new Date();
  localTimeEl.textContent = formatLocalTime(weatherTz, now);
  localDateEl.textContent = formatLocalDate(weatherTz, now);
  world.setHour(hourInTz(weatherTz, now));
};

const paintWeather = (snap: WeatherSnapshot) => {
  weatherTz = snap.timezone;
  atmosStage.dataset.kind = snap.kind;
  weatherTempEl.textContent = String(snap.tempC);
  weatherLabelEl.textContent = snap.labelBn;
  weatherPlaceEl.textContent = snap.place;
  paintClock();
};

paintClock();
window.setInterval(paintClock, 1000);

const refreshWeather = async () => {
  try {
    const snap = await fetchWeather();
    paintWeather(snap);
  } catch (err) {
    console.warn("Weather unavailable:", err);
    weatherLabelEl.textContent = "Sky unavailable";
    weatherPlaceEl.textContent = "Local time still runs";
  }
};

refreshWeather();
window.setInterval(refreshWeather, 10 * 60 * 1000);

const bindPadButton = (btn: HTMLButtonElement) => {
  const code = btn.dataset.key;
  if (!code) return;

  const down = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    btn.classList.add("is-active");
    world.setHeld(code, true);
  };
  const up = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    btn.classList.remove("is-active");
    world.setHeld(code, false);
  };

  btn.addEventListener("pointerdown", down);
  btn.addEventListener("pointerup", up);
  btn.addEventListener("pointercancel", up);
  btn.addEventListener("pointerleave", up);
};

for (const btn of dpad.querySelectorAll<HTMLButtonElement>(".dpad-btn")) {
  bindPadButton(btn);
}

document.body.addEventListener(
  "touchmove",
  (e) => {
    if (document.body.classList.contains("is-garden")) {
      const target = e.target as HTMLElement | null;
      if (target?.closest(".note, .dpad, .finale, .letterbox, .dedication"))
        return;
      e.preventDefault();
    }
  },
  { passive: false },
);
