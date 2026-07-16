import type { Episode } from "./story";
import {
  EPISODE_ONE,
  EPISODE_FINAL,
  EPISODE_DESERT_MEET,
  EPISODE_DESERT_FINAL,
  EPISODE_RAIN_MEET,
  EPISODE_RAIN_FINAL,
  EPISODE_CITY_MEET,
  EPISODE_CITY_FINAL,
  EPISODE_ARCTIC_MEET,
  EPISODE_ARCTIC_FINAL,
} from "./story";
import type { WorldTheme } from "./scene";

export type ChapterNum = 1 | 2 | 3 | 4 | 5;

export type ChapterMeta = {
  theme: WorldTheme;
  vehicle: boolean;
  bodyClass: string;
  label: string;
  hazard: string;
  meet: Episode;
  fin: Episode;
  trackId?: string;
  nextBtn?: string;
};

export const CHAPTER_META: Record<ChapterNum, ChapterMeta> = {
  1: {
    theme: "garden",
    vehicle: false,
    bodyClass: "",
    label: "অধ্যায় ১ — বাগান",
    hazard: "bee",
    meet: EPISODE_ONE,
    fin: EPISODE_FINAL,
    nextBtn: "অধ্যায় ২ — মরুভূমিতে চলো ▸",
  },
  2: {
    theme: "desert",
    vehicle: true,
    bodyClass: "is-desert",
    label: "অধ্যায় ২ — মরুভূমি",
    hazard: "scorpion",
    meet: EPISODE_DESERT_MEET,
    fin: EPISODE_DESERT_FINAL,
    trackId: "chithi-bhitra",
    nextBtn: "অধ্যায় ৩ — রেইনফরেস্টে চলো ▸",
  },
  3: {
    theme: "rainforest",
    vehicle: false,
    bodyClass: "is-rainforest",
    label: "অধ্যায় ৩ — রেইনফরেস্ট",
    hazard: "snake",
    meet: EPISODE_RAIN_MEET,
    fin: EPISODE_RAIN_FINAL,
    nextBtn: "অধ্যায় ৪ — ঢাকায় চলো ▸",
  },
  4: {
    theme: "city",
    vehicle: false,
    bodyClass: "is-city",
    label: "অধ্যায় ৪ — ঢাকা",
    hazard: "crow",
    meet: EPISODE_CITY_MEET,
    fin: EPISODE_CITY_FINAL,
    nextBtn: "অধ্যায় ৫ — উত্তর মেরুতে চলো ▸",
  },
  5: {
    theme: "arctic",
    vehicle: false,
    bodyClass: "is-arctic",
    label: "অধ্যায় ৫ — উত্তর মেরু",
    hazard: "fox",
    meet: EPISODE_ARCTIC_MEET,
    fin: EPISODE_ARCTIC_FINAL,
  },
};

export const HAZARD_STING: Record<string, string> = {
  bee: "A bee stung you—starting over…",
  scorpion: "A scorpion stung you—starting the desert over…",
  snake: "A snake bit you—starting the rainforest over…",
  crow: "A crow startled you—starting Dhaka over…",
  fox: "An arctic fox caught you—starting the north pole over…",
};

export const HAZARD_SHELTER: Record<string, string> = {
  bee: "Shelter holds—the bee turns away.",
  scorpion: "Shelter holds—the scorpion turns away.",
  snake: "Shelter holds—the snake turns away.",
  crow: "Shelter holds—the crow turns away.",
  fox: "Shelter holds—the fox turns away.",
};

export const BIOME_BODY_CLASSES = [
  "is-desert",
  "is-rainforest",
  "is-city",
  "is-arctic",
] as const;

export function parseChapter(raw: string | null): ChapterNum | null {
  if (raw === "1" || raw === "2" || raw === "3" || raw === "4" || raw === "5") {
    return Number(raw) as ChapterNum;
  }
  return null;
}
