import "./style.css";
import { createWorld, type QuietTier } from "./scene";
import { discoveries } from "./discoveries";
import { poetQuotes } from "./quotes";
import { createMusic } from "./audio";
import { createAmbient } from "./ambient";
import {
  DEFAULT_TRACK_ID,
  TRACKS,
  getTrackById,
  loadSavedTrackId,
  saveTrackId,
  youtubeEmbedSrc,
  type Track,
} from "./tracks";
import {
  beginSpotifyLogin,
  ensureSpotifyToken,
  getSpotifyClientId,
  isSpotifyConnected,
  playFullSpotifyTrack,
  setSpotifyClientId,
} from "./spotifyFull";
import { clearGardenSave } from "./progress";
import { pickQuote, sendMotivationEmail } from "./motivation";
import {
  playEpisode,
  EPISODE_ONE,
  EPISODE_FINAL,
  EPISODE_DESERT_MEET,
  EPISODE_DESERT_FINAL,
  EPISODE_DREAM_WAKE,
  BOY_NAME,
} from "./story";
import {
  fetchWeather,
  formatLocalDate,
  formatLocalTime,
  type WeatherKind,
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
const journalToggle =
  document.querySelector<HTMLButtonElement>("#journal-toggle");
const journal = document.querySelector<HTMLElement>("#journal");
const journalClose = document.querySelector<HTMLButtonElement>("#journal-close");
const gardenReset = document.querySelector<HTMLButtonElement>("#garden-reset");
const journalLetters = document.querySelector<HTMLElement>("#journal-letters");
const journalQuotes = document.querySelector<HTMLElement>("#journal-quotes");
const quietPath = document.querySelector<HTMLButtonElement>("#quiet-path");
const quietMoon = document.querySelector<HTMLButtonElement>("#quiet-moon");
const quietSky = document.querySelector<HTMLButtonElement>("#quiet-sky");
const quietStatus = document.querySelector<HTMLElement>("#quiet-status");
const songToggle = document.querySelector<HTMLButtonElement>("#song-toggle");
const songPanel = document.querySelector<HTMLElement>("#song-panel");
const songPanelClose =
  document.querySelector<HTMLButtonElement>("#song-panel-close");
const trackList = document.querySelector<HTMLElement>("#track-list");
const trackListGarden = document.querySelector<HTMLElement>("#track-list-garden");
const songTitleEl = document.querySelector<HTMLElement>("#song-title");
const songCreditEl = document.querySelector<HTMLElement>("#song-credit");
const spotifyEmbed = document.querySelector<HTMLIFrameElement>("#spotify-embed");
const spotifyEmbedGarden =
  document.querySelector<HTMLIFrameElement>("#spotify-embed-garden");
const spotifyFallback = document.querySelector<HTMLElement>("#spotify-fallback");
const spotifyFallbackGarden =
  document.querySelector<HTMLElement>("#spotify-fallback-garden");
const spotifyLink = document.querySelector<HTMLAnchorElement>("#spotify-link");
const spotifyLinkGarden =
  document.querySelector<HTMLAnchorElement>("#spotify-link-garden");
const spotifyConnect =
  document.querySelector<HTMLButtonElement>("#spotify-connect");
const spotifyClientIdInput =
  document.querySelector<HTMLInputElement>("#spotify-client-id");
const spotifyFullStatus =
  document.querySelector<HTMLElement>("#spotify-full-status");
const ytMount = document.querySelector<HTMLIFrameElement>("#yt-mount");
const songKicker = document.querySelector<HTMLElement>(".song-kicker");
const playSongBtn = document.querySelector<HTMLButtonElement>("#play-song");
const faithCoinsEl = document.querySelector<HTMLElement>("#faith-coins");
const faithTotalEl = document.querySelector<HTMLElement>("#faith-total");
const coinsRow = document.querySelector<HTMLElement>(".coins");
const coinToast = document.querySelector<HTMLElement>("#coin-toast");
const deathToast = document.querySelector<HTMLElement>("#death-toast");
const atmosStage = document.querySelector<HTMLElement>("#atmos-stage");
const localTimeEl = document.querySelector<HTMLElement>("#local-time");
const localDateEl = document.querySelector<HTMLElement>("#local-date");
const weatherTempEl = document.querySelector<HTMLElement>("#weather-temp");
const weatherLabelEl = document.querySelector<HTMLElement>("#weather-label");
const weatherPlaceEl = document.querySelector<HTMLElement>("#weather-place");
const dpad = document.querySelector<HTMLElement>("#dpad");
const actionPad = document.querySelector<HTMLElement>("#action-pad");
const motivationPop = document.querySelector<HTMLElement>("#motivation-pop");
const motivationText = document.querySelector<HTMLElement>("#motivation-text");

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
  !journalToggle ||
  !journal ||
  !journalClose ||
  !gardenReset ||
  !journalLetters ||
  !journalQuotes ||
  !quietPath ||
  !quietMoon ||
  !quietSky ||
  !quietStatus ||
  !songToggle ||
  !songPanel ||
  !songPanelClose ||
  !trackList ||
  !trackListGarden ||
  !songTitleEl ||
  !songCreditEl ||
  !spotifyEmbed ||
  !spotifyEmbedGarden ||
  !spotifyFallback ||
  !spotifyFallbackGarden ||
  !spotifyLink ||
  !spotifyLinkGarden ||
  !spotifyConnect ||
  !spotifyClientIdInput ||
  !spotifyFullStatus ||
  !ytMount ||
  !playSongBtn ||
  !faithCoinsEl ||
  !faithTotalEl ||
  !coinsRow ||
  !coinToast ||
  !deathToast ||
  !atmosStage ||
  !localTimeEl ||
  !localDateEl ||
  !weatherTempEl ||
  !weatherLabelEl ||
  !weatherPlaceEl ||
  !dpad ||
  !actionPad
) {
  throw new Error("Missing required UI elements");
}

const NOTE_KEY = "if-you-knew-me-letter";
const DEFAULT_COMPASS =
  "সোনালি আলোর স্তম্ভ খোঁজো — ওখানেই ফেইথ কয়েন লুকিয়ে আছে";
let weatherWhisper = DEFAULT_COMPASS;

const whisperFor = (kind: WeatherKind, hour: number): string => {
  const night = hour >= 20 || hour < 5;
  if (night) {
    if (kind === "clear") return "Night clears the path—stars wait above.";
    if (kind === "fog") return "Mist and moonlight share the garden.";
    if (kind === "rain" || kind === "drizzle" || kind === "storm")
      return "Rain at night softens every footstep.";
    return "The garden holds its breath after dark.";
  }
  switch (kind) {
    case "clear":
      return "Sunlit petals lean toward unread letters.";
    case "cloudy":
      return "Soft clouds keep the garden unhurried.";
    case "fog":
      return "Mist hides a nearby light—walk gently.";
    case "drizzle":
      return "Drizzle brightens the path ring.";
    case "rain":
      return "Rain writes quiet lines on the leaves.";
    case "snow":
      return "Snow hushes the meadow—listen closer.";
    case "storm":
      return "Storm-light flickers—faith coins still shine.";
  }
};

const setIdleCompass = () => {
  if (!note.classList.contains("is-hidden")) return;
  compass.textContent = weatherWhisper || DEFAULT_COMPASS;
};

let selectedTrack = getTrackById(loadSavedTrackId());

const syncSpotifyEmbed = (track: Track) => {
  spotifyLink.href = track.spotifyUrl;
  spotifyLinkGarden.href = track.spotifyUrl;
  // Keep embed iframes hidden — Spotify embeds are 30s previews only.
  spotifyEmbed.classList.add("is-hidden");
  spotifyEmbedGarden.classList.add("is-hidden");
  spotifyFallback.classList.add("is-hidden");
  spotifyFallbackGarden.classList.add("is-hidden");
};

const applyTrackUi = (track: Track) => {
  selectedTrack = track;
  songTitleEl.textContent = track.title;
  songCreditEl.textContent = track.artist;
  vinylArtist.textContent = track.artist;
  ytMount.title = `${track.title} — ${track.artist}`;
  syncSpotifyEmbed(track);

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
  if (open) setJournalOpen(false);
};

const setJournalOpen = (open: boolean) => {
  journal.classList.toggle("is-hidden", !open);
  journalToggle.setAttribute("aria-expanded", open ? "true" : "false");
  if (open) {
    setSongPanelOpen(false);
    refreshJournal();
  }
};

journalToggle.addEventListener("click", () => {
  setJournalOpen(journal.classList.contains("is-hidden"));
});
journalClose.addEventListener("click", () => setJournalOpen(false));
gardenReset.addEventListener("click", () => {
  clearGardenSave();
  window.location.reload();
});

journalLetters.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
    ".journal-item",
  );
  if (!btn?.dataset.letterId || btn.disabled) return;
  world.reopenLetter(btn.dataset.letterId);
  setJournalOpen(false);
});

journalQuotes.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
    ".journal-item",
  );
  if (!btn?.dataset.quoteId || btn.disabled) return;
  world.reopenQuote(btn.dataset.quoteId);
  setJournalOpen(false);
});

const unlockQuiet = (tier: QuietTier, label: string) => {
  if (!world.unlockQuietMoment(tier)) return;
  refreshQuietUi();
  quietStatus.textContent = label;
  compass.textContent = label;
  setJournalOpen(false);
};

quietPath.addEventListener("click", () =>
  unlockQuiet("path", "The path brightens under your feet."),
);
quietMoon.addEventListener("click", () =>
  unlockQuiet("moon", "The moon answers with a soft beat."),
);
quietSky.addEventListener("click", () => {
  unlockQuiet("sky", "The sky softens—look up when stars are ready.");
  if (world.getProgress().constellationDone) world.lookAtConstellation();
});

totalEl.textContent = String(discoveries.length);
faithTotalEl.textContent = String(poetQuotes.length);

const showNote = (
  title: string,
  text: string,
  source: "letter" | "quote" = "letter",
) => {
  noteTitle.textContent = title;
  noteText.textContent = text;
  note.dataset.source = source;
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

// Boy (রংধনু) story arc — per-run flags; a sting restarts the chapter.
const CHAPTER_KEY = "if-you-knew-me-chapter";
let chapter: 1 | 2 = 1;
let episodeMeetPlayed = false;
let finalEpisodePlayed = false;
let cutscenePlaying = false;
let pendingChapter2 = false;

const runEpisode = async (
  episode: typeof EPISODE_ONE,
  after: () => void,
  onCue?: (cue: string) => void,
) => {
  if (cutscenePlaying) return;
  cutscenePlaying = true;
  note.classList.add("is-hidden");
  delete note.dataset.source;
  world.disable();
  await playEpisode(episode, onCue);
  cutscenePlaying = false;
  world.enable();
  after();
};

const maybeStartStory = (faithCoins: number, totalQuotes: number) => {
  if (!episodeMeetPlayed && faithCoins >= 3) {
    episodeMeetPlayed = true;
    window.setTimeout(() => {
      void runEpisode(
        chapter === 1 ? EPISODE_ONE : EPISODE_DESERT_MEET,
        () => {
          compass.textContent =
            chapter === 1
              ? `${BOY_NAME}কে খুঁজতে সব ফেইথ কয়েন জোগাড় করো (${faithCoins}/${totalQuotes})`
              : `${BOY_NAME} পিরামিডে ফিরে গেছে — মরুর সব ফেইথ কয়েন জোগাড় করো (${faithCoins}/${totalQuotes})`;
        },
      );
    }, 1500);
  }
};

const worldCallbacks: Parameters<typeof createWorld>[1] = {
  onDiscover(item, foundCount) {
    foundEl.textContent = String(foundCount);
    showNote(item.title, item.text, "letter");
    refreshJournal();
    compass.textContent =
      foundCount >= discoveries.length
        ? "চিঠিগুলো পড়া হয়েছে — ফুল ও চেরি গাছও ছুঁয়ে দেখো"
        : "A letter noticed—another light may be near.";
    if (chapter === 2 && foundCount >= discoveries.length) {
      compass.textContent =
        "চিঠিগুলো পড়া হয়েছে — ঝোপ আর পিরামিডও ছুঁয়ে দেখো";
    }
  },
  onQuote(quote, info) {
    showNote(quote.poet, quote.text, "quote");
    faithCoinsEl.textContent = String(info.faithCoins);
    refreshJournal();
    if (info.isNew) {
      coinsRow.classList.remove("is-pulse");
      void coinsRow.offsetWidth;
      coinsRow.classList.add("is-pulse");
      showFaithCoinToast();
      compass.textContent = `Faith coin · star ${info.faithCoins}/${info.totalQuotes}`;
      maybeStartStory(info.faithCoins, info.totalQuotes);
    } else {
      compass.textContent = "কবিতার ফুল ও চেরিগাছ ছুঁয়ে আরও পড়ো";
    }
    if (!info.isNew && chapter === 2) {
      compass.textContent = "মরুর ঝোপ ও পিরামিড ছুঁয়ে আরও পড়ো";
    }
  },
  onQuoteAway() {
    if (note.dataset.source !== "quote") return;
    note.classList.add("is-hidden");
    delete note.dataset.source;
    setIdleCompass();
  },
  onShelterProtect() {
    compass.textContent =
      chapter === 1
        ? "Shelter holds—the bee turns away."
        : "Shelter holds—the scorpion turns away.";
  },
  onConstellationComplete() {
    if (finalEpisodePlayed) return;
    finalEpisodePlayed = true;
    world.lookAtConstellation();
    const finaleLines = finale.querySelectorAll("p");
    window.setTimeout(() => {
      if (chapter === 1) {
        void runEpisode(EPISODE_FINAL, () => {
          compass.textContent =
            "সে হারায়নি — মরুভূমির ওপারে তার ছায়া দেখা গেছে।";
          if (finaleLines[0])
            finaleLines[0].textContent = "সে বাতাসে মিলিয়ে গেছে…";
          if (finaleLines[1])
            finaleLines[1].textContent =
              "কিন্তু বহ্নি জানে—সে হারায়নি। মরুভূমি ডাকছে।";
          pendingChapter2 = true;
          finaleContinue.textContent = "অধ্যায় ২ — মরুভূমিতে চলো ▸";
          finale.classList.remove("is-hidden");
        });
      } else {
        void runEpisode(
          EPISODE_DESERT_FINAL,
          () => {
            void runEpisode(EPISODE_DREAM_WAKE, () => {
              compass.textContent =
                "স্বপ্ন শেষ—তবে অনুভূতি বুকে রয়ে গেল।";
              if (finaleLines[0])
                finaleLines[0].textContent =
                  "সবটুকু স্বপ্ন ছিল—বাগান, মরুভূমি, রংধনু।";
              if (finaleLines[1])
                finaleLines[1].textContent =
                  "বহ্নি জেগে উঠল। কিন্তু যা অনুভব করেছে, সেটা সত্যিই তার। — শেষ";
              finaleContinue.textContent = "Leave a quiet line";
              finale.classList.remove("is-hidden");
              sessionStorage.removeItem(CHAPTER_KEY);
              saveTrackId(DEFAULT_TRACK_ID);
            });
          },
          (cue) => {
            if (cue === "lakhau") void selectTrack("lakhau-hajarau");
          },
        );
      }
    }, 2600);
  },
  onComplete() {
    window.setTimeout(() => {
      note.classList.add("is-hidden");
      finale.classList.remove("is-hidden");
    }, 2200);
  },
  onHoverChange(title) {
    if (note.classList.contains("is-hidden")) {
      compass.textContent = title ? `Toward: ${title}` : weatherWhisper;
    }
  },
  onDeath() {
    const sting =
      chapter === 1
        ? "A bee stung you—starting over…"
        : "A scorpion stung you—starting the desert over…";
    compass.textContent = sting;
    deathToast.textContent = sting;
    deathToast.classList.remove("is-hidden");
    window.setTimeout(() => {
      clearGardenSave();
      window.location.reload();
    }, 1600);
  },
};

let worldCanvas: HTMLCanvasElement = canvas;
let world = createWorld(worldCanvas, worldCallbacks);

const refreshQuietUi = () => {
  const progress = world.getProgress();
  const map: Record<QuietTier, HTMLButtonElement> = {
    path: quietPath,
    moon: quietMoon,
    sky: quietSky,
  };
  const need: Record<QuietTier, number> = {
    path: 3,
    moon: 6,
    sky: poetQuotes.length,
  };
  for (const tier of Object.keys(map) as QuietTier[]) {
    const btn = map[tier];
    const unlocked = progress.unlocked.includes(tier);
    const ready = progress.faithCoins >= need[tier];
    btn.disabled = unlocked || !ready;
    btn.classList.toggle("is-unlocked", unlocked);
  }
  if (progress.unlocked.length === 3) {
    quietStatus.textContent = "All quiet moments unlocked.";
  } else if (progress.faithCoins < 3) {
    quietStatus.textContent = "Collect faith coins to unlock quiet moments.";
  } else {
    quietStatus.textContent = "A quiet moment is ready in the journal.";
  }
};

const refreshJournal = () => {
  const progress = world.getProgress();
  const found = new Set(progress.letters);
  const collected = new Set(progress.quotes);

  journalLetters.replaceChildren();
  for (const item of discoveries) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "journal-item";
    const isFound = found.has(item.id);
    btn.classList.toggle("is-found", isFound);
    btn.disabled = !isFound;
    btn.dataset.letterId = item.id;
    const title = document.createElement("span");
    title.textContent = isFound ? item.title : "Still hidden";
    const meta = document.createElement("span");
    meta.className = "journal-item-meta";
    meta.textContent = isFound ? "Tap to reread" : "Wander to notice";
    btn.append(title, meta);
    journalLetters.append(btn);
  }

  journalQuotes.replaceChildren();
  for (const quote of poetQuotes) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "journal-item";
    const isCollected = collected.has(quote.id);
    btn.classList.toggle("is-found", isCollected);
    btn.disabled = !isCollected;
    btn.dataset.quoteId = quote.id;
    const title = document.createElement("span");
    title.textContent = isCollected ? quote.poet : "Poem still waiting";
    const meta = document.createElement("span");
    meta.className = "journal-item-meta";
    meta.textContent = isCollected
      ? "Tap to reread"
      : "Touch a flower or sakura";
    btn.append(title, meta);
    journalQuotes.append(btn);
  }

  refreshQuietUi();
};

const beginFreshGarden = () => {
  clearGardenSave();
  refreshJournal();
};

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

let motivationTimer = 0;
const hideMotivation = () => {
  if (!motivationPop) return;
  motivationPop.classList.add("is-leaving");
  window.setTimeout(() => {
    motivationPop.classList.add("is-hidden");
    motivationPop.classList.remove("is-leaving");
  }, 450);
};

const showMotivation = () => {
  if (!motivationPop || !motivationText) return;
  const quote = pickQuote();
  motivationText.textContent = quote;
  motivationPop.classList.remove("is-hidden", "is-leaving");
  window.clearTimeout(motivationTimer);
  motivationTimer = window.setTimeout(hideMotivation, 10000);
  void sendMotivationEmail(quote);
};

motivationPop?.addEventListener("click", () => {
  window.clearTimeout(motivationTimer);
  hideMotivation();
});

const openGarden = () => {
  muteBtn.classList.remove("is-hidden");
  songToggle.classList.remove("is-hidden");
  journalToggle.classList.remove("is-hidden");
  dpad.classList.remove("is-hidden");
  actionPad.classList.remove("is-hidden");
  gate.classList.add("is-leaving");
  document.body.classList.remove("is-prologue");
  document.body.classList.add("is-garden");
  beginFreshGarden();
  window.setTimeout(() => {
    gate.classList.add("is-hidden");
    hud.classList.remove("is-hidden");
    world.enable();
    showMotivation();
    // A scorpion sting reloads the page mid-desert; resume Chapter 2 directly.
    if (sessionStorage.getItem(CHAPTER_KEY) === "2") {
      startChapter2();
    }
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
    // Default: full YouTube in-site. Spotify Web Playback only after Connect.
    if (isSpotifyConnected() && track.spotifyId) {
      try {
        await playFullSpotifyTrack(track.spotifyId);
        if (!api.isMuted()) api.toggleMute();
        syncMuteUi(true);
        if (songKicker) songKicker.textContent = "spotify full track";
        if (spotifyFullStatus)
          spotifyFullStatus.textContent = `Playing full track: ${track.title}`;
        return;
      } catch (err) {
        console.warn(err);
        if (spotifyFullStatus)
          spotifyFullStatus.textContent =
            "Full Spotify play failed—playing full YouTube instead.";
      }
    }
    await api.play();
    if (songKicker) songKicker.textContent = "playing full track";
  } catch (err) {
    console.warn("Track switch failed:", err);
  }
};

/** Chapter 2 — the desert. She drives; scorpions crawl; pyramids hum. */
const startChapter2 = () => {
  chapter = 2;
  sessionStorage.setItem(CHAPTER_KEY, "2");
  pendingChapter2 = false;
  episodeMeetPlayed = false;
  finalEpisodePlayed = false;
  finale.classList.add("is-hidden");
  note.classList.add("is-hidden");
  delete note.dataset.source;
  document.body.classList.add("is-desert");

  world.destroy();
  clearGardenSave();
  // Fresh canvas: safest way to boot a second WebGL world
  const fresh = worldCanvas.cloneNode(false) as HTMLCanvasElement;
  worldCanvas.replaceWith(fresh);
  worldCanvas = fresh;
  world = createWorld(worldCanvas, worldCallbacks, {
    theme: "desert",
    vehicle: true,
  });
  foundEl.textContent = "0";
  faithCoinsEl.textContent = "0";
  refreshJournal();
  refreshQuietUi();
  world.enable();
  compass.textContent =
    "অধ্যায় ২ — মরুভূমি: ঝোপ, ক্যাকটাস আর পিরামিড ছুঁয়ে দেখো";
  void selectTrack("chithi-bhitra");
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

spotifyClientIdInput.value = getSpotifyClientId();
const refreshSpotifyStatus = () => {
  if (isSpotifyConnected()) {
    spotifyConnect.textContent = "Spotify connected";
    spotifyFullStatus.textContent =
      "Connected. Pick a track for the full song (Premium).";
  } else {
    spotifyConnect.textContent = "Connect Spotify";
    spotifyFullStatus.textContent =
      "Optional Premium Connect for Spotify full tracks; otherwise YouTube plays the full song.";
  }
};
refreshSpotifyStatus();
void ensureSpotifyToken().then(() => refreshSpotifyStatus());

spotifyConnect.addEventListener("click", async () => {
  const id = spotifyClientIdInput.value.trim() || getSpotifyClientId();
  if (!id) {
    spotifyFullStatus.textContent =
      "Paste your Spotify Client ID first (developer.spotify.com → create app). Redirect URI: this page URL.";
    spotifyClientIdInput.focus();
    return;
  }
  setSpotifyClientId(id);
  spotifyFullStatus.textContent = "Opening Spotify login…";
  try {
    await beginSpotifyLogin(id);
  } catch (err) {
    console.warn(err);
    spotifyFullStatus.textContent =
      "Could not start Spotify login. Check Client ID + Redirect URI.";
  }
});

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
  delete note.dataset.source;
  setIdleCompass();
});

finaleContinue.addEventListener("click", (e) => {
  e.stopPropagation();
  if (pendingChapter2) {
    startChapter2();
    return;
  }
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
  const hour = hourInTz(weatherTz);
  weatherWhisper = whisperFor(snap.kind, hour);
  paintClock();
  setIdleCompass();
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

const bindActionButton = (btn: HTMLButtonElement) => {
  const action = btn.dataset.action;
  if (!action) return;

  if (action === "run") {
    const down = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.add("is-active");
      world.setHeld("ShiftLeft", true);
    };
    const up = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.remove("is-active");
      world.setHeld("ShiftLeft", false);
    };
    btn.addEventListener("pointerdown", down);
    btn.addEventListener("pointerup", up);
    btn.addEventListener("pointercancel", up);
    btn.addEventListener("pointerleave", up);
    return;
  }

  const tap = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    btn.classList.add("is-active");
    if (action === "jump") world.jump();
    if (action === "dance") world.dance();
    window.setTimeout(() => btn.classList.remove("is-active"), 140);
  };
  btn.addEventListener("pointerdown", tap);
};

for (const btn of actionPad.querySelectorAll<HTMLButtonElement>(".action-btn")) {
  bindActionButton(btn);
}

document.body.addEventListener(
  "touchmove",
  (e) => {
    if (document.body.classList.contains("is-garden")) {
      const target = e.target as HTMLElement | null;
      if (target?.closest(
        ".note, .dpad, .action-pad, .finale, .letterbox, .dedication, .journal, .song-panel, .sound-dock",
      ))
        return;
      e.preventDefault();
    }
  },
  { passive: false },
);
