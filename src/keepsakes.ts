import type { PlantedSeed, TimeCapsule, WorldTheme } from "./scene";

/**
 * Keepsakes survive bee stings and garden resets on purpose:
 * planted seeds and buried capsules are the "come back later" layer.
 */

const PLANTS_KEY = "if-you-knew-me-plants";
const CAPSULES_KEY = "if-you-knew-me-capsules";
const SESSION_KEY = "if-you-knew-me-session";

/** Stable id for this browser tab visit — capsules open on *later* visits. */
export function currentSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "s-fallback";
  }
}

function loadList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function saveList<T>(key: string, list: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function loadPlants(): PlantedSeed[] {
  return loadList<PlantedSeed>(PLANTS_KEY);
}

export function savePlant(seed: PlantedSeed): void {
  const all = loadPlants();
  all.push(seed);
  // Keep the garden from overflowing across many visits
  saveList(PLANTS_KEY, all.slice(-60));
}

export function plantsForTheme(theme: WorldTheme): PlantedSeed[] {
  return loadPlants().filter((p) => p.theme === theme);
}

export function loadCapsules(): TimeCapsule[] {
  return loadList<TimeCapsule>(CAPSULES_KEY);
}

export function saveCapsule(capsule: TimeCapsule): void {
  const all = loadCapsules();
  all.push(capsule);
  saveList(CAPSULES_KEY, all.slice(-40));
}

export function removeCapsule(id: string): void {
  saveList(
    CAPSULES_KEY,
    loadCapsules().filter((c) => c.id !== id),
  );
}

export function capsulesForTheme(theme: WorldTheme): TimeCapsule[] {
  return loadCapsules().filter((c) => c.theme === theme);
}
