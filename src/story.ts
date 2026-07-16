/**
 * Anime-episode cutscene engine.
 * Full-screen letterboxed scenes with the game's own pixel-art characters,
 * typewriter dialogue, and tap-to-advance. Used for the boy (রংধনু) story arc.
 */

import { carSpriteUrl, heroSpriteUrl, type HeroAction, type Facing } from "./hero";

type ActorState = {
  /** 0..100 — percent across the stage */
  x: number;
  facing?: Facing;
  action?: HeroAction;
  opacity?: number;
  /** true → character drops slightly, desaturated (grief) */
  low?: boolean;
};

type Shot = {
  bg:
    | "dusk"
    | "mist"
    | "stars"
    | "void"
    | "desert"
    | "pyramid"
    | "bedroom"
    | "balcony";
  girl?: ActorState | null;
  boy?: ActorState | null;
  speaker?: "girl" | "boy" | "narrator";
  text: string;
  /** Optional smaller subtitle line (e.g. translation). */
  sub?: string;
  fx?: "petals" | "glow" | "none" | "rainbow";
  /** Girl appears as her car instead of on foot. */
  car?: boolean;
  /** Girl sits up in bed (bedroom frame only). */
  inBed?: boolean;
  /** Boy floats / flies in the sky (balcony ending). */
  flying?: boolean;
  /** Named cue fired when this shot is displayed (e.g. music change). */
  cue?: string;
};

export type Episode = {
  kicker: string;
  title: string;
  shots: Shot[];
};

export const GIRL_NAME = "বহ্নি";
export const BOY_NAME = "রংধনু";

export const EPISODE_ONE: Episode = {
  kicker: "অধ্যায় ১ · বাগান",
  title: "প্রথম দেখা",
  shots: [
    {
      bg: "dusk",
      girl: { x: 30, facing: "right" },
      speaker: "narrator",
      text: "তিনটি বিশ্বাসের তারা জ্বলে উঠতেই, বাগানের বাতাস হঠাৎ থেমে গেল…",
      fx: "petals",
    },
    {
      bg: "dusk",
      girl: { x: 30, facing: "right" },
      boy: { x: 70, facing: "left", opacity: 0 },
      speaker: "narrator",
      text: "কুয়াশার ভেতর থেকে একটা ছায়া এগিয়ে এল।",
      fx: "glow",
    },
    {
      bg: "dusk",
      girl: { x: 32, facing: "right", action: "dance" },
      boy: { x: 68, facing: "left", opacity: 1 },
      speaker: "girl",
      text: "তুমি! সত্যিই তুমি এসেছ! আমি জানতাম তুমি আছ—কোথাও না কোথাও…",
      fx: "petals",
    },
    {
      bg: "mist",
      girl: { x: 32, facing: "right" },
      boy: { x: 68, facing: "left", opacity: 1 },
      speaker: "boy",
      text: "I go, I go… and forever, you never shall know.",
      sub: "আমি চললাম… কেন, তা তুমি কোনোদিন জানবে না।",
    },
    {
      bg: "mist",
      girl: { x: 40, facing: "right" },
      boy: { x: 78, facing: "left", opacity: 0.25 },
      speaker: "girl",
      text: "দাঁড়াও! যেয়ো না… অন্তত নামটা তো বলে যাও!",
    },
    {
      bg: "void",
      girl: { x: 50, facing: "down", low: true },
      boy: null,
      speaker: "narrator",
      text: "সে চলে গেল—যেমন করে শেষ বিকেলের রোদ মিলিয়ে যায়।",
    },
    {
      bg: "dusk",
      girl: { x: 50, facing: "down" },
      speaker: "girl",
      text: "…না। আমি কাঁদব না। যত তারা লাগে জ্বালাব—তোমাকে আমি খুঁজে বের করবই।",
      fx: "petals",
    },
    {
      bg: "stars",
      girl: { x: 50, facing: "up" },
      speaker: "narrator",
      text: "অধ্যায় ১ চলছে — সবগুলো ফেইথ কয়েন জোগাড় করো, তার কাছে পৌঁছাও।",
      fx: "glow",
    },
  ],
};

export const EPISODE_FINAL: Episode = {
  kicker: "অধ্যায় ১ · শেষ",
  title: "শেষ বিকেলে",
  shots: [
    {
      bg: "stars",
      girl: { x: 26, facing: "right", action: "run" },
      speaker: "narrator",
      text: "সবগুলো তারা জ্বলে উঠল। আর সেই আলোয়—সে দাঁড়িয়ে।",
      fx: "glow",
    },
    {
      bg: "stars",
      girl: { x: 34, facing: "right", action: "dance" },
      boy: { x: 66, facing: "left", opacity: 0.85 },
      speaker: "girl",
      text: "পেয়েছি! এবার আর তোমাকে হারাতে দেব না—",
      fx: "petals",
    },
    {
      bg: "mist",
      girl: { x: 36, facing: "right" },
      boy: { x: 64, facing: "left", opacity: 0.6 },
      speaker: "boy",
      text: "তুমি এসেছ… এটুকুই আমার সবটুকু পাওয়া।",
    },
    {
      bg: "mist",
      girl: { x: 38, facing: "right" },
      boy: { x: 64, facing: "left", opacity: 0.3 },
      speaker: "boy",
      text: "I go, I go… and now, forever—you know.",
      sub: "আমি চললাম… আর এবার, চিরদিনের মতো—তুমি জানলে।",
    },
    {
      bg: "void",
      girl: { x: 42, facing: "right" },
      boy: { x: 64, facing: "left", opacity: 0 },
      speaker: "narrator",
      text: "বাতাসে মিলিয়ে গেল সে—ফুলের পাপড়ির মতো, যেন চিরদিনের জন্য।",
      fx: "petals",
    },
    {
      bg: "void",
      girl: { x: 50, facing: "down", low: true },
      speaker: "girl",
      text: "না… না! আমি তো এসেছি! এই তো আমি… আর একটু আগে এলেই…",
    },
    {
      bg: "void",
      girl: { x: 50, facing: "down", low: true },
      speaker: "narrator",
      text: "সে দেরি করে ফেলেছিল। কিছু দেখা শুধু বিদায়ের জন্যই লেখা থাকে।",
    },
    {
      bg: "dusk",
      girl: { x: 50, facing: "down" },
      speaker: "girl",
      text: "এই অভিমানটুকু আমার থাক। আমি এগিয়ে যাব—তবে ভুলব না। কোনোদিন না।",
      fx: "petals",
    },
    {
      bg: "stars",
      girl: { x: 50, facing: "up" },
      speaker: "narrator",
      text: "…কিন্তু বাতাসে মিলিয়ে যাওয়া মানেই কি হারিয়ে যাওয়া? — অধ্যায় ২ চলবে",
      fx: "glow",
    },
  ],
};

export const EPISODE_DESERT_MEET: Episode = {
  kicker: "অধ্যায় ২ · মরুভূমি",
  title: "পিরামিডের ছায়ায়",
  shots: [
    {
      bg: "desert",
      girl: { x: 30, facing: "right" },
      car: true,
      speaker: "narrator",
      text: "সে হারায়নি—বহ্নি জানত। তাই গাড়ি নিয়ে সে পাড়ি দিল মরুভূমির পথে, ধুলোঝড় আর কাঁটাঝোপ পেরিয়ে।",
    },
    {
      bg: "pyramid",
      girl: { x: 28, facing: "right" },
      car: true,
      speaker: "narrator",
      text: "তিনটি বিশ্বাসের তারা জ্বলে উঠতেই—পিরামিডের পাথর কেঁপে উঠল।",
      fx: "glow",
    },
    {
      bg: "pyramid",
      girl: { x: 32, facing: "right", action: "dance" },
      boy: { x: 68, facing: "left", opacity: 1 },
      speaker: "girl",
      text: "তুমি! আমি জানতাম—তুমি হারাওনি!",
      fx: "glow",
    },
    {
      bg: "pyramid",
      girl: { x: 34, facing: "right" },
      boy: { x: 66, facing: "left", opacity: 1 },
      speaker: "boy",
      text: "Follow the fate, not the destined.",
      sub: "নিয়তির পিছু নয়—ভাগ্যের পথে চলো।",
    },
    {
      bg: "pyramid",
      girl: { x: 34, facing: "right" },
      boy: { x: 66, facing: "left", opacity: 0.7 },
      speaker: "boy",
      text: "Destiny is warm and mellow, fate is taxing but rewarding…",
      sub: "নিয়তি উষ্ণ আর কোমল; ভাগ্য কঠিন—কিন্তু তার প্রতিদান অনেক।",
    },
    {
      bg: "mist",
      girl: { x: 40, facing: "right" },
      boy: { x: 74, facing: "left", opacity: 0.2 },
      speaker: "girl",
      text: "আবার?! আবার চলে যাচ্ছ—",
    },
    {
      bg: "void",
      girl: { x: 50, facing: "down", low: true },
      boy: null,
      speaker: "narrator",
      text: "এবার সে কাঁদল। মরুভূমির বালিতে বসে, অনেকক্ষণ।",
    },
    {
      bg: "desert",
      girl: { x: 50, facing: "down" },
      speaker: "girl",
      text: "…কেঁদে নিলাম। ব্যস। এবার ওঠো বহ্নি—ভাগ্যের পথ ডাকছে।",
      fx: "glow",
    },
    {
      bg: "stars",
      girl: { x: 50, facing: "up" },
      speaker: "narrator",
      text: "অধ্যায় ২ চলছে — মরুর সব ফেইথ কয়েন জোগাড় করো।",
      fx: "glow",
    },
  ],
};

export const EPISODE_DESERT_FINAL: Episode = {
  kicker: "অধ্যায় ২ · শেষ",
  title: "লাখৌ হাজারৌ",
  shots: [
    {
      bg: "stars",
      girl: { x: 26, facing: "right" },
      car: true,
      speaker: "narrator",
      text: "মরুর আকাশে সবগুলো তারা জ্বলে উঠল। পিরামিডের চূড়া থেকে নেমে এল একটা চেনা ছায়া।",
      fx: "glow",
    },
    {
      bg: "pyramid",
      girl: { x: 34, facing: "right", action: "dance" },
      boy: { x: 66, facing: "left", opacity: 0.9 },
      speaker: "girl",
      text: "এবার বলো—আর কোথায় পালাবে?",
      fx: "glow",
    },
    {
      bg: "pyramid",
      girl: { x: 36, facing: "right" },
      boy: { x: 64, facing: "left", opacity: 0.85 },
      speaker: "boy",
      cue: "lakhau",
      text: "Lakhau hajarau maddhye, timro muskaan le, kina ho malai, pagal banaucha?",
      sub: "লাখো-হাজারের ভিড়ে, তোমার হাসিই কেন আমাকে পাগল করে দেয়?",
    },
    {
      bg: "mist",
      girl: { x: 40, facing: "right" },
      boy: { x: 64, facing: "left", opacity: 0.4 },
      speaker: "narrator",
      text: "সে হাসল—প্রথমবারের মতো। আর সেই হাসিটুকু রেখেই, আবার পাতলা হতে লাগল বাতাসে।",
      fx: "petals",
    },
    {
      bg: "void",
      girl: { x: 46, facing: "right" },
      boy: { x: 64, facing: "left", opacity: 0 },
      speaker: "narrator",
      text: "মরুর হাওয়ায় মিলিয়ে গেল সে—আবারও।",
    },
    {
      bg: "void",
      girl: { x: 50, facing: "down", low: true },
      speaker: "girl",
      text: "যাও। যতবার হারাবে, ততবার খুঁজে বের করব। এ আমার ভাগ্য—আর আমি ভাগ্যের পথেই চলি।",
    },
    {
      bg: "void",
      speaker: "narrator",
      text: "আর তারপর—জঙ্গলের পথ খুলে গেল। অধ্যায় ৩ চলবে।",
    },
  ],
};

export const EPISODE_RAIN_MEET: Episode = {
  kicker: "অধ্যায় ৩ · রেইনফরেস্ট",
  title: "সবুজের ভেতর",
  shots: [
    {
      bg: "dusk",
      girl: { x: 28, facing: "right" },
      speaker: "narrator",
      text: "বৃষ্টিভেজা পাতার নিচে বহ্নি হেঁটে চলল। বাতাসে ভারী সবুজ গন্ধ।",
      fx: "petals",
    },
    {
      bg: "mist",
      girl: { x: 32, facing: "right", action: "dance" },
      boy: { x: 68, facing: "left", opacity: 1 },
      speaker: "girl",
      text: "এখানেও তুমি? গাছের ছায়ায় লুকিয়ে?",
      fx: "glow",
    },
    {
      bg: "mist",
      girl: { x: 34, facing: "right" },
      boy: { x: 66, facing: "left" },
      speaker: "boy",
      text: "The forest keeps every secret it is given.",
      sub: "জঙ্গল যা গোপনীয়তা পায়, তা ধরে রাখে।",
    },
    {
      bg: "void",
      girl: { x: 50, facing: "down", low: true },
      boy: null,
      speaker: "narrator",
      text: "সে আবার মিলিয়ে গেল পাতার আড়ালে। সাপের ফোঁস শোনা গেল দূরে।",
    },
    {
      bg: "stars",
      girl: { x: 50, facing: "up" },
      speaker: "narrator",
      text: "অধ্যায় ৩ — জঙ্গলের সব ফেইথ কয়েন জোগাড় করো।",
      fx: "glow",
    },
  ],
};

export const EPISODE_RAIN_FINAL: Episode = {
  kicker: "অধ্যায় ৩ · শেষ",
  title: "বৃষ্টির নিচে",
  shots: [
    {
      bg: "stars",
      girl: { x: 30, facing: "right" },
      boy: { x: 65, facing: "left", opacity: 0.9 },
      speaker: "boy",
      text: "You found every green star. Still I cannot stay.",
      sub: "সব সবুজ তারা পেয়েছ—তবু আমি থাকতে পারি না।",
      fx: "glow",
    },
    {
      bg: "void",
      girl: { x: 48, facing: "down", low: true },
      boy: null,
      speaker: "girl",
      text: "তবু খুঁজব। পরের শহরেও।",
    },
    {
      bg: "stars",
      girl: { x: 50, facing: "up" },
      speaker: "narrator",
      text: "ঢাকার আলো দূরে জ্বলছে। অধ্যায় ৪ চলবে।",
      fx: "glow",
    },
  ],
};

export const EPISODE_CITY_MEET: Episode = {
  kicker: "অধ্যায় ৪ · ঢাকা",
  title: "শহরের রাত",
  shots: [
    {
      bg: "mist",
      girl: { x: 28, facing: "right" },
      speaker: "narrator",
      text: "হর্নের শব্দ, চা দোকানের ধোঁয়া, রাস্তার আলো—বহ্নি ঢাকার রাস্তায়।",
    },
    {
      bg: "mist",
      girl: { x: 32, facing: "right" },
      boy: { x: 68, facing: "left", opacity: 1 },
      speaker: "girl",
      text: "এত লোকের ভিড়েও তোমাকে চিনতে পারি।",
      fx: "glow",
    },
    {
      bg: "mist",
      girl: { x: 34, facing: "right" },
      boy: { x: 66, facing: "left" },
      speaker: "boy",
      text: "In this crowd of lakhs, your smile still finds me.",
      sub: "লাখো ভিড়েও তোমার হাসি আমাকে খুঁজে পায়।",
    },
    {
      bg: "void",
      girl: { x: 50, facing: "down" },
      boy: null,
      speaker: "narrator",
      text: "কাকের ডাকে সে মিলিয়ে গেল গলির মোড়ে।",
    },
    {
      bg: "stars",
      girl: { x: 50, facing: "up" },
      speaker: "narrator",
      text: "অধ্যায় ৪ — শহরের সব ফেইথ কয়েন জোগাড় করো।",
      fx: "glow",
    },
  ],
};

export const EPISODE_CITY_FINAL: Episode = {
  kicker: "অধ্যায় ৪ · শেষ",
  title: "শেষ বাস",
  shots: [
    {
      bg: "stars",
      girl: { x: 30, facing: "right" },
      boy: { x: 64, facing: "left", opacity: 0.85 },
      speaker: "boy",
      text: "North wind is calling. The last chapter is cold.",
      sub: "উত্তরের হাওয়া ডাকছে। শেষ অধ্যায় ঠান্ডা।",
      fx: "glow",
    },
    {
      bg: "void",
      girl: { x: 50, facing: "down", low: true },
      speaker: "girl",
      text: "ঠান্ডা হোক—যাব।",
    },
    {
      bg: "stars",
      girl: { x: 50, facing: "up" },
      speaker: "narrator",
      text: "উত্তর মেরুর তুষার পড়ছে। অধ্যায় ৫ চলবে।",
      fx: "glow",
    },
  ],
};

export const EPISODE_ARCTIC_MEET: Episode = {
  kicker: "অধ্যায় ৫ · উত্তর মেরু",
  title: "তুষারের শেষ",
  shots: [
    {
      bg: "stars",
      girl: { x: 28, facing: "right" },
      speaker: "narrator",
      text: "সাদা দিগন্ত। বাতাস কাঁটে। বহ্নি তুষারে পা রাখল।",
      fx: "glow",
    },
    {
      bg: "stars",
      girl: { x: 32, facing: "right" },
      boy: { x: 68, facing: "left", opacity: 1 },
      speaker: "girl",
      text: "এবার আর পালাবে না। এখানে শেষ।",
      fx: "petals",
    },
    {
      bg: "mist",
      girl: { x: 34, facing: "right" },
      boy: { x: 66, facing: "left" },
      speaker: "boy",
      text: "Collect the ice-stars. Then we speak the last truth.",
      sub: "বরফের তারাগুলো জোগাড় করো। তারপর শেষ সত্যি।",
    },
    {
      bg: "void",
      girl: { x: 50, facing: "down" },
      boy: null,
      speaker: "narrator",
      text: "সে বরফের আড়ালে মিলিয়ে গেল—আর শেয়ালের পায়ের ছাপ রেখে।",
    },
    {
      bg: "stars",
      girl: { x: 50, facing: "up" },
      speaker: "narrator",
      text: "অধ্যায় ৫ — সব ফেইথ কয়েন জোগাড় করো। এটাই শেষ অধ্যায়।",
      fx: "glow",
    },
  ],
};

export const EPISODE_ARCTIC_FINAL: Episode = {
  kicker: "অধ্যায় ৫ · শেষ",
  title: "বরফ ভাঙে",
  shots: [
    {
      bg: "stars",
      girl: { x: 30, facing: "right", action: "dance" },
      boy: { x: 64, facing: "left", opacity: 0.95 },
      speaker: "girl",
      text: "পেয়েছি সব তারা। এবার বলো—",
      fx: "glow",
    },
    {
      bg: "mist",
      girl: { x: 34, facing: "right" },
      boy: { x: 62, facing: "left", opacity: 0.7 },
      speaker: "boy",
      text: "That is the end of the road… for now.",
      sub: "এতদূরই পথের শেষ… আপাতত।",
    },
    {
      bg: "void",
      girl: { x: 46, facing: "right" },
      boy: { x: 64, facing: "left", opacity: 0 },
      speaker: "narrator",
      text: "তুষারে মিলিয়ে গেল সে। আর বহ্নির চোখ—বন্ধ হয়ে এল।",
    },
    {
      bg: "void",
      speaker: "narrator",
      text: "আর তারপর—চোখ খুলল।",
    },
  ],
};

/** Epilogue after Chapter 5 — she wakes and realizes it was a dream. */
export const EPISODE_DREAM_WAKE: Episode = {
  kicker: "উপসংহার",
  title: "জেগে ওঠা",
  shots: [
    {
      bg: "bedroom",
      speaker: "narrator",
      text: "চোখ খুলল—কিন্তু প্রথমে আলো আসেনি। শুধু অন্ধকার আর একটা ভারী শ্বাস।",
    },
    {
      bg: "bedroom",
      girl: { x: 38, facing: "down", opacity: 0.35 },
      inBed: true,
      speaker: "narrator",
      text: "বিছানা। বালিশ। জানালার ফাঁক দিয়ে সকালের হালকা আভাস।",
    },
    {
      bg: "bedroom",
      girl: { x: 38, facing: "down", opacity: 0.85 },
      inBed: true,
      speaker: "girl",
      text: "…প্রেয়সীপাড়? বাগান? সেই চিঠিগুলো—",
    },
    {
      bg: "bedroom",
      girl: { x: 38, facing: "down", opacity: 1 },
      inBed: true,
      speaker: "girl",
      text: "রংধনু… বাগান… মরু… জঙ্গল… ঢাকা… উত্তর মেরু—সব…",
    },
    {
      bg: "bedroom",
      girl: { x: 38, facing: "down" },
      inBed: true,
      speaker: "girl",
      text: "এত কিছু… এত কাঁদা, এত দৌড়… সব কি স্বপ্ন ছিল?",
    },
    {
      bg: "bedroom",
      speaker: "narrator",
      text: "তারা আর নেই। বাগান নেই। সোনালি স্তম্ভ নেই। শুধু এই ঘর, এই বিছানা।",
    },
    {
      bg: "bedroom",
      girl: { x: 38, facing: "down" },
      inBed: true,
      speaker: "girl",
      text: "কিন্তু বুকে যে গভীরটা ছিল—সেটা কি স্বপ্ন? হাসি কাঁদা, অভিমান—সব?",
    },
    {
      bg: "bedroom",
      girl: { x: 38, facing: "down" },
      inBed: true,
      speaker: "girl",
      text: "হয়তো স্বপ্নেই সত্যি থাকে। হয়তো… আজই কিছু বাকি আছে।",
    },
    {
      bg: "bedroom",
      girl: { x: 38, facing: "down" },
      inBed: true,
      speaker: "girl",
      text: "বুকে যে গভীরটা ছিল—সেটা তো এখনও আছে। তাহলে বারান্দায় যাই।",
    },
    {
      bg: "bedroom",
      girl: { x: 38, facing: "right" },
      inBed: true,
      speaker: "narrator",
      text: "সে বিছানা থেকে উঠল। বারান্দার দিকে পা বাড়াল—",
    },
  ],
};

/** Epilogue — balcony farewell, then a real faith coin left behind. */
export const EPISODE_BALCONY_END: Episode = {
  kicker: "উপসংহার",
  title: "রংধনু",
  shots: [
    {
      bg: "balcony",
      girl: { x: 28, facing: "right" },
      fx: "rainbow",
      speaker: "narrator",
      text: "বারান্দায় দাঁড়িয়ে সে আকাশের দিকে তাকাল। বৃষ্টির পর—একটা রংধনু।",
    },
    {
      bg: "balcony",
      girl: { x: 30, facing: "up" },
      fx: "rainbow",
      speaker: "girl",
      text: "রংধনু… তোমার নামটার মতোই।",
    },
    {
      bg: "balcony",
      girl: { x: 28, facing: "up" },
      boy: { x: 62, facing: "left", opacity: 0.2 },
      flying: true,
      fx: "rainbow",
      speaker: "narrator",
      text: "আকাশের ওপরে—একটা পরিচিত ছায়া ভাসছে।",
    },
    {
      bg: "balcony",
      girl: { x: 28, facing: "up" },
      boy: { x: 60, facing: "left", opacity: 0.95 },
      flying: true,
      fx: "rainbow",
      speaker: "girl",
      text: "তুমি… তুমি সত্যিই আছ?",
    },
    {
      bg: "balcony",
      girl: { x: 30, facing: "up" },
      boy: { x: 58, facing: "left", opacity: 1 },
      flying: true,
      fx: "rainbow",
      speaker: "boy",
      text: "That is the end of the dream.",
      sub: "স্বপ্নের এখানেই শেষ।",
    },
    {
      bg: "balcony",
      girl: { x: 30, facing: "up" },
      boy: { x: 58, facing: "left", opacity: 0.9 },
      flying: true,
      fx: "rainbow",
      speaker: "boy",
      text: "If fate wants, we will meet again.",
      sub: "ভাগ্য চাইলে, আমরা আবার দেখা করব।",
    },
    {
      bg: "balcony",
      girl: { x: 32, facing: "up" },
      boy: { x: 62, facing: "left", opacity: 0.55 },
      flying: true,
      fx: "rainbow",
      speaker: "boy",
      text: "Till then…",
      sub: "ততদিন…",
    },
    {
      bg: "balcony",
      girl: { x: 34, facing: "up" },
      boy: null,
      fx: "rainbow",
      speaker: "narrator",
      text: "রংধনু মিলিয়ে গেল আকাশের আলোয়। বহ্নি একা দাঁড়াল—চোখে জল নিয়ে।",
    },
    {
      bg: "balcony",
      girl: { x: 40, facing: "down" },
      fx: "glow",
      speaker: "narrator",
      text: "তখনই—জানালার কিনারে একটা সোনালি আলো। স্বপ্নের মতো নয়। সত্যিই জ্বলছে।",
    },
    {
      bg: "balcony",
      girl: { x: 44, facing: "down", action: "dance" },
      fx: "glow",
      speaker: "girl",
      text: "…একটা ফেইথ কয়েন? এখানে? জেগে থাকা ঘরে?",
    },
  ],
};

/** Final epilogue — the coin proves the path; they meet in the waking world. */
export const EPISODE_PROOF_REUNION: Episode = {
  kicker: "উপসংহার · শেষ",
  title: "ভাগ্য চাইল",
  shots: [
    {
      bg: "balcony",
      girl: { x: 46, facing: "down" },
      fx: "glow",
      speaker: "narrator",
      text: "সে কয়েনটা হাতে নিল। হালকা গরম—যেন বাগানের সূর্য এখনও ধরে আছে।",
    },
    {
      bg: "mist",
      girl: { x: 40, facing: "right" },
      fx: "petals",
      speaker: "narrator",
      text: "এক নিমেষে—পাতার গন্ধ, চেরির ছায়া, সোনালি স্তম্ভের স্মৃতি।",
    },
    {
      bg: "dusk",
      girl: { x: 32, facing: "right" },
      boy: { x: 68, facing: "left", opacity: 1 },
      fx: "petals",
      speaker: "narrator",
      text: "আর যখন কুয়াশা সরল—সে দাঁড়িয়ে। পায়ে। উড়ে নয়।",
    },
    {
      bg: "dusk",
      girl: { x: 34, facing: "right", action: "dance" },
      boy: { x: 66, facing: "left", opacity: 1 },
      fx: "glow",
      speaker: "girl",
      text: "তুমি… স্বপ্ন নও। তুমি এখানে।",
    },
    {
      bg: "dusk",
      girl: { x: 36, facing: "right" },
      boy: { x: 64, facing: "left", opacity: 1 },
      speaker: "boy",
      text: "The dream was the path. Waking is the meeting.",
      sub: "স্বপ্ন ছিল পথ। জেগে ওঠাই দেখা।",
    },
    {
      bg: "dusk",
      girl: { x: 38, facing: "right", action: "dance" },
      boy: { x: 62, facing: "left", opacity: 1, action: "dance" },
      fx: "petals",
      speaker: "narrator",
      text: "তারা হাসল—পাশাপাশি। এবার কেউ মিলিয়ে যায় না।",
    },
    {
      bg: "stars",
      girl: { x: 40, facing: "right" },
      boy: { x: 60, facing: "left", opacity: 1 },
      fx: "glow",
      speaker: "boy",
      text: "Fate wanted it. We meet again—now.",
      sub: "ভাগ্য চেয়েছিল। আমরা আবার দেখা করলাম—এখনই।",
    },
    {
      bg: "dusk",
      girl: { x: 42, facing: "right", action: "dance" },
      boy: { x: 58, facing: "left", opacity: 1 },
      fx: "petals",
      speaker: "narrator",
      text: "প্রেয়সীপাড়ের সন্ধ্যা নরম হয়ে এল। শেষ নয়—শুরু।",
    },
  ],
};

const TYPE_MS = 34;

function makePetals(host: HTMLElement, count = 14) {
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");
    petal.className = "story-petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDelay = `${Math.random() * 6}s`;
    petal.style.animationDuration = `${5 + Math.random() * 5}s`;
    host.appendChild(petal);
  }
}

export function playEpisode(
  episode: Episode,
  onCue?: (cue: string) => void,
): Promise<void> {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "story-overlay";
    overlay.innerHTML = `
      <div class="story-scene" data-bg="dusk">
        <div class="story-fx-petals" aria-hidden="true"></div>
        <div class="story-glow" aria-hidden="true"></div>
        <div class="story-ground" aria-hidden="true"></div>
        <div class="story-bedroom is-hidden" aria-hidden="true">
          <div class="story-window"></div>
          <div class="story-bed">
            <div class="story-pillow"></div>
            <div class="story-blanket"></div>
          </div>
        </div>
        <div class="story-balcony is-hidden" aria-hidden="true">
          <div class="story-rainbow" aria-hidden="true"></div>
          <div class="story-rail"></div>
          <div class="story-city"></div>
        </div>
        <img class="story-actor story-girl" alt="${GIRL_NAME}" />
        <img class="story-actor story-boy" alt="${BOY_NAME}" />
      </div>
      <div class="story-bar story-bar-top"></div>
      <div class="story-bar story-bar-bottom"></div>
      <div class="story-title-card">
        <p class="story-kicker"></p>
        <p class="story-title"></p>
      </div>
      <div class="story-dialogue is-hidden">
        <p class="story-name"></p>
        <p class="story-text"></p>
        <p class="story-sub"></p>
        <p class="story-hint">ছুঁয়ে দাও ▸</p>
      </div>
      <button class="story-skip" type="button">Skip ▸▸</button>
    `;
    document.body.appendChild(overlay);

    const scene = overlay.querySelector<HTMLElement>(".story-scene")!;
    const petalHost = overlay.querySelector<HTMLElement>(".story-fx-petals")!;
    const glow = overlay.querySelector<HTMLElement>(".story-glow")!;
    const ground = overlay.querySelector<HTMLElement>(".story-ground")!;
    const bedroom = overlay.querySelector<HTMLElement>(".story-bedroom")!;
    const balcony = overlay.querySelector<HTMLElement>(".story-balcony")!;
    const rainbow = overlay.querySelector<HTMLElement>(".story-rainbow")!;
    const girlEl = overlay.querySelector<HTMLImageElement>(".story-girl")!;
    const boyEl = overlay.querySelector<HTMLImageElement>(".story-boy")!;
    const barTop = overlay.querySelector<HTMLElement>(".story-bar-top")!;
    const barBottom = overlay.querySelector<HTMLElement>(".story-bar-bottom")!;
    const titleCard = overlay.querySelector<HTMLElement>(".story-title-card")!;
    const kickerEl = overlay.querySelector<HTMLElement>(".story-kicker")!;
    const titleEl = overlay.querySelector<HTMLElement>(".story-title")!;
    const dialogue = overlay.querySelector<HTMLElement>(".story-dialogue")!;
    const nameEl = overlay.querySelector<HTMLElement>(".story-name")!;
    const textEl = overlay.querySelector<HTMLElement>(".story-text")!;
    const subEl = overlay.querySelector<HTMLElement>(".story-sub")!;
    const hintEl = overlay.querySelector<HTMLElement>(".story-hint")!;
    const skipBtn = overlay.querySelector<HTMLButtonElement>(".story-skip")!;

    makePetals(petalHost);

    let shotIndex = -1;
    let typeTimer = 0;
    let typing = false;
    let pendingText = "";
    let started = false;
    let done = false;

    const applyActor = (
      el: HTMLImageElement,
      state?: ActorState | null,
      asCar = false,
      inBed = false,
      flying = false,
    ) => {
      el.classList.toggle("is-in-bed", inBed);
      el.classList.toggle("is-flying", flying && el === boyEl);
      if (!state) {
        el.style.opacity = "0";
        el.classList.remove("is-flying");
        return;
      }
      el.src =
        asCar && el === girlEl
          ? carSpriteUrl(state.facing ?? "down")
          : heroSpriteUrl(
              el === boyEl ? "boy" : "girl",
              state.facing ?? "down",
              0,
              state.action ?? "idle",
            );
      el.style.left = `${state.x}%`;
      el.style.opacity = String(state.opacity ?? 1);
      el.classList.toggle("is-low", Boolean(state.low) && !inBed && !flying);
    };

    const finishTyping = () => {
      window.clearInterval(typeTimer);
      typing = false;
      textEl.textContent = pendingText;
      hintEl.classList.remove("is-hidden");
    };

    const showShot = (shot: Shot) => {
      const isBedroom = shot.bg === "bedroom";
      const isBalcony = shot.bg === "balcony";
      const realFrame = isBedroom || isBalcony;
      scene.dataset.bg = shot.bg;
      overlay.classList.toggle("is-bedroom-frame", isBedroom);
      overlay.classList.toggle("is-balcony-frame", isBalcony);
      bedroom.classList.toggle("is-hidden", !isBedroom);
      balcony.classList.toggle("is-hidden", !isBalcony);
      ground.classList.toggle("is-hidden", realFrame);
      barTop.classList.toggle("is-hidden", realFrame);
      barBottom.classList.toggle("is-hidden", realFrame);
      glow.style.opacity =
        !realFrame && shot.fx === "glow" ? "1" : "0";
      petalHost.style.opacity =
        !realFrame && shot.fx === "petals" ? "1" : "0";
      rainbow.classList.toggle(
        "is-visible",
        isBalcony && (shot.fx === "rainbow" || shot.fx === undefined),
      );
      applyActor(girlEl, shot.girl, shot.car, shot.inBed, false);
      applyActor(
        boyEl,
        isBedroom ? null : shot.boy,
        false,
        false,
        Boolean(shot.flying),
      );
      if (shot.cue) onCue?.(shot.cue);

      dialogue.classList.remove("is-hidden");
      dialogue.dataset.speaker = shot.speaker ?? "narrator";
      nameEl.textContent =
        shot.speaker === "girl"
          ? GIRL_NAME
          : shot.speaker === "boy"
            ? BOY_NAME
            : "";
      nameEl.classList.toggle("is-hidden", !nameEl.textContent);
      subEl.textContent = shot.sub ?? "";
      subEl.classList.toggle("is-hidden", !shot.sub);
      hintEl.classList.add("is-hidden");

      pendingText = shot.text;
      textEl.textContent = "";
      typing = true;
      let i = 0;
      window.clearInterval(typeTimer);
      typeTimer = window.setInterval(() => {
        i += 1;
        textEl.textContent = pendingText.slice(0, i);
        if (i >= pendingText.length) finishTyping();
      }, TYPE_MS);
    };

    const end = () => {
      if (done) return;
      done = true;
      window.clearInterval(typeTimer);
      window.removeEventListener("keydown", onKey);
      overlay.classList.add("is-closing");
      window.setTimeout(() => {
        overlay.remove();
        resolve();
      }, 650);
    };

    const advance = () => {
      if (!started) return;
      if (typing) {
        finishTyping();
        return;
      }
      shotIndex += 1;
      if (shotIndex >= episode.shots.length) {
        end();
        return;
      }
      showShot(episode.shots[shotIndex]!);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        advance();
      }
      if (e.code === "Escape") end();
    };

    overlay.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).closest(".story-skip")) return;
      advance();
    });
    skipBtn.addEventListener("click", end);
    window.addEventListener("keydown", onKey);

    // Title card first, then the first shot
    kickerEl.textContent = episode.kicker;
    titleEl.textContent = episode.title;
    window.setTimeout(() => {
      titleCard.classList.add("is-leaving");
      window.setTimeout(() => {
        titleCard.classList.add("is-hidden");
        started = true;
        advance();
      }, 700);
    }, 2400);
  });
}
