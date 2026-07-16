import type { ChapterNum } from "./chapters";

export type QuietTier = "path" | "moon" | "sky";

export type GardenSave = {
  letters: string[];
  quotes: string[];
  unlocked: QuietTier[];
  at?: string;
};

export type StorySave = {
  /** Highest chapter the player may start (1–5). */
  unlockedMax: ChapterNum;
  /** Chapters whose constellation/finale finished. */
  completed: ChapterNum[];
  at?: string;
};

export const GARDEN_KEY = "if-you-knew-me-garden";
export const STORY_KEY = "if-you-knew-me-story";

const asChapter = (n: unknown): ChapterNum | null => {
  if (n === 1 || n === 2 || n === 3 || n === 4 || n === 5) return n;
  if (n === "1" || n === "2" || n === "3" || n === "4" || n === "5") {
    return Number(n) as ChapterNum;
  }
  return null;
};

export function loadGardenSave(): GardenSave {
  try {
    const raw = localStorage.getItem(GARDEN_KEY);
    if (!raw) return { letters: [], quotes: [], unlocked: [] };
    const parsed = JSON.parse(raw) as Partial<GardenSave>;
    return {
      letters: Array.isArray(parsed.letters) ? parsed.letters : [],
      quotes: Array.isArray(parsed.quotes) ? parsed.quotes : [],
      unlocked: Array.isArray(parsed.unlocked)
        ? parsed.unlocked.filter(
            (t): t is QuietTier =>
              t === "path" || t === "moon" || t === "sky",
          )
        : [],
    };
  } catch {
    return { letters: [], quotes: [], unlocked: [] };
  }
}

export function saveGardenSave(save: GardenSave): void {
  try {
    localStorage.setItem(
      GARDEN_KEY,
      JSON.stringify({ ...save, at: new Date().toISOString() }),
    );
  } catch {
    /* ignore */
  }
}

export function clearGardenSave(): void {
  try {
    localStorage.removeItem(GARDEN_KEY);
  } catch {
    /* ignore */
  }
}

export function defaultStorySave(): StorySave {
  return { unlockedMax: 1, completed: [] };
}

export function loadStorySave(): StorySave {
  try {
    const raw = localStorage.getItem(STORY_KEY);
    if (!raw) return defaultStorySave();
    const parsed = JSON.parse(raw) as Partial<StorySave>;
    const unlockedMax = asChapter(parsed.unlockedMax) ?? 1;
    const completed = Array.isArray(parsed.completed)
      ? parsed.completed
          .map(asChapter)
          .filter((n): n is ChapterNum => n !== null)
      : [];
    return { unlockedMax, completed: [...new Set(completed)].sort() as ChapterNum[] };
  } catch {
    return defaultStorySave();
  }
}

export function saveStorySave(save: StorySave): void {
  try {
    localStorage.setItem(
      STORY_KEY,
      JSON.stringify({ ...save, at: new Date().toISOString() }),
    );
  } catch {
    /* ignore */
  }
}

/** Mark chapter N complete and unlock N+1 (capped at 5). */
export function markChapterComplete(n: ChapterNum): StorySave {
  const save = loadStorySave();
  if (!save.completed.includes(n)) save.completed.push(n);
  save.completed = [...new Set(save.completed)].sort() as ChapterNum[];
  const next = Math.min(5, n + 1) as ChapterNum;
  save.unlockedMax = Math.max(save.unlockedMax, next) as ChapterNum;
  if (n === 5) save.unlockedMax = 5;
  saveStorySave(save);
  return save;
}

/** Next chapter to play from the gate Continue button. */
export function nextChapterToPlay(save: StorySave = loadStorySave()): ChapterNum {
  if (save.completed.length >= 5) return 1;
  return save.unlockedMax;
}

export function isChapterUnlocked(
  n: ChapterNum,
  save: StorySave = loadStorySave(),
): boolean {
  return n <= save.unlockedMax;
}

export function isChapterCompleted(
  n: ChapterNum,
  save: StorySave = loadStorySave(),
): boolean {
  return save.completed.includes(n);
}
