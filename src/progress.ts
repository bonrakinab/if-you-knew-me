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
