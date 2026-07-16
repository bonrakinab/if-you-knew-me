export type QuietTier = "path" | "moon" | "sky";

export type GardenSave = {
  letters: string[];
  quotes: string[];
  unlocked: QuietTier[];
  at?: string;
};

export const GARDEN_KEY = "if-you-knew-me-garden";

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

/**
 * Chapter checkpoint — written when a chapter is completed so a future
 * visit resumes the journey instead of starting from Chapter 1.
 */
export const CHAPTER_SAVE_KEY = "if-you-knew-me-chapter-reached";

export function saveChapterReached(chapter: number): void {
  try {
    localStorage.setItem(CHAPTER_SAVE_KEY, String(chapter));
  } catch {
    /* ignore */
  }
}

export function loadChapterReached(): number {
  try {
    const n = Number(localStorage.getItem(CHAPTER_SAVE_KEY));
    return Number.isInteger(n) && n >= 2 && n <= 5 ? n : 0;
  } catch {
    return 0;
  }
}

export function clearChapterReached(): void {
  try {
    localStorage.removeItem(CHAPTER_SAVE_KEY);
  } catch {
    /* ignore */
  }
}
