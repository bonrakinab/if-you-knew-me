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
    | "river"
    | "rooftop"
    | "mountain"
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
  kicker: "পর্ব ১",
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
      text: "অভিযান শুরু হলো — সবগুলো ফেইথ কয়েন জোগাড় করো, তার কাছে পৌঁছাও।",
      fx: "glow",
    },
  ],
};

export const EPISODE_FINAL: Episode = {
  kicker: "শেষ পর্ব",
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
      text: "…কিন্তু বাতাসে মিলিয়ে যাওয়া মানেই কি হারিয়ে যাওয়া? — চলবে",
      fx: "glow",
    },
  ],
};

export const EPISODE_DESERT_MEET: Episode = {
  kicker: "অধ্যায় ২ · পর্ব ১",
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
      text: "অভিযান আবার শুরু — মরুর সব ফেইথ কয়েন জোগাড় করো।",
      fx: "glow",
    },
  ],
};

export const EPISODE_DESERT_FINAL: Episode = {
  kicker: "অধ্যায় ২ · শেষ পর্ব",
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
      bg: "river",
      girl: { x: 50, facing: "up" },
      speaker: "narrator",
      text: "দূরে, বৃষ্টির শব্দ। নদীর জলে একটা ছায়া ভেসে গেল—বর্ষা ডাকছে। — চলবে",
      fx: "glow",
    },
  ],
};

export const EPISODE_MONSOON_MEET: Episode = {
  kicker: "অধ্যায় ৩ · পর্ব ১",
  title: "বর্ষার নদীগ্রামে",
  shots: [
    {
      bg: "river",
      girl: { x: 30, facing: "right" },
      speaker: "narrator",
      text: "মরু পেরিয়ে বহ্নি পৌঁছাল বর্ষার নদীগ্রামে। শাপলা ভাসছে, বটগাছ ভিজছে, আকাশে অবিরাম বৃষ্টি।",
      fx: "petals",
    },
    {
      bg: "river",
      girl: { x: 28, facing: "right" },
      speaker: "narrator",
      text: "তিনটি বিশ্বাসের তারা জ্বলে উঠতেই—নদীর জল থেমে গেল এক মুহূর্তের জন্য।",
      fx: "glow",
    },
    {
      bg: "mist",
      girl: { x: 32, facing: "right", action: "dance" },
      boy: { x: 68, facing: "left", opacity: 1 },
      speaker: "girl",
      text: "বৃষ্টির ভেতরেও তোমাকে চিনতে পারি। এবার অন্তত ছাতাটা ভাগ করে নাও!",
      fx: "glow",
    },
    {
      bg: "mist",
      girl: { x: 34, facing: "right" },
      boy: { x: 66, facing: "left", opacity: 1 },
      speaker: "boy",
      text: "Rain remembers what rivers forget.",
      sub: "নদী যা ভুলে যায়, বৃষ্টি তা মনে রাখে।",
    },
    {
      bg: "river",
      girl: { x: 36, facing: "right" },
      boy: { x: 70, facing: "left", opacity: 0.4 },
      speaker: "boy",
      text: "নৌকো ভাসাও, বহ্নি। জল যেখানে নিয়ে যায়—সেখানেই আমি।",
    },
    {
      bg: "void",
      girl: { x: 50, facing: "down", low: true },
      boy: null,
      speaker: "narrator",
      text: "বৃষ্টির পর্দার আড়ালে সে মিলিয়ে গেল—জলের দাগের মতো।",
    },
    {
      bg: "river",
      girl: { x: 50, facing: "down" },
      speaker: "girl",
      text: "ভিজে গেছি, তাতে কী। বর্ষার সব ফেইথ কয়েন জোগাড় করব—জল আমাকে পথ দেখাবে।",
      fx: "glow",
    },
    {
      bg: "stars",
      girl: { x: 50, facing: "up" },
      speaker: "narrator",
      text: "অভিযান চলছে — বর্ষার সব ফেইথ কয়েন জোগাড় করো।",
      fx: "glow",
    },
  ],
};

export const EPISODE_MONSOON_FINAL: Episode = {
  kicker: "অধ্যায় ৩ · শেষ পর্ব",
  title: "জলের চিঠি",
  shots: [
    {
      bg: "stars",
      girl: { x: 26, facing: "right" },
      speaker: "narrator",
      text: "ভেজা আকাশে সবগুলো তারা জ্বলে উঠল। নদীর ওপারে একটা লণ্ঠন জ্বলল—তারপর আরেকটা।",
      fx: "glow",
    },
    {
      bg: "river",
      girl: { x: 34, facing: "right", action: "dance" },
      boy: { x: 66, facing: "left", opacity: 0.9 },
      speaker: "girl",
      text: "এবার পেয়েছি! বৃষ্টিও তোমাকে লুকোতে পারল না—",
      fx: "glow",
    },
    {
      bg: "mist",
      girl: { x: 36, facing: "right" },
      boy: { x: 64, facing: "left", opacity: 0.8 },
      speaker: "boy",
      text: "প্রতিটি বৃষ্টির ফোঁটা একটা চিঠি, বহ্নি। তুমি পড়তে শিখে গেছ।",
    },
    {
      bg: "mist",
      girl: { x: 38, facing: "right" },
      boy: { x: 64, facing: "left", opacity: 0.35 },
      speaker: "boy",
      text: "শহরে যাও। ঢাকার ছাদে, ঘুড়ির ভিড়ে—আমি অপেক্ষা করব।",
      fx: "petals",
    },
    {
      bg: "void",
      girl: { x: 46, facing: "right" },
      boy: { x: 64, facing: "left", opacity: 0 },
      speaker: "narrator",
      text: "জলের ওপর মিলিয়ে গেল সে—ঢেউয়ের ভাঁজে।",
    },
    {
      bg: "void",
      girl: { x: 50, facing: "down", low: true },
      speaker: "girl",
      text: "এবার আর কাঁদলাম না। দেখেছ? আমি শিখে যাচ্ছি—হারানো মানে শেষ নয়।",
    },
    {
      bg: "rooftop",
      girl: { x: 50, facing: "up" },
      speaker: "narrator",
      text: "দূরে শহরের আলো। ছাদের ওপর ঘুড়ি উড়ছে—ঢাকা ডাকছে। — চলবে",
      fx: "glow",
    },
  ],
};

/**
 * Chapter 5 epilogue, frame 1: she wakes in bed. The boy was a dream —
 * she remembers him, but not a word of what he said.
 */
export const EPISODE_DREAM_WAKE: Episode = {
  kicker: "জেগে ওঠা",
  title: "স্বপ্ন ভাঙার পরে",
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
      text: "…সে। সে ছিল। এইমাত্র—আমার সামনে দাঁড়িয়ে—কী যেন বলছিল—",
    },
    {
      bg: "bedroom",
      girl: { x: 38, facing: "down", opacity: 1 },
      inBed: true,
      speaker: "narrator",
      text: "সব ভুলে গেছে সে। শুধু ছেলেটাকে মনে আছে—তার মুখ, তার চোখ। সে কী বলেছিল, তার একটা শব্দও নয়।",
    },
    {
      bg: "bedroom",
      girl: { x: 38, facing: "down" },
      inBed: true,
      speaker: "girl",
      text: "শেকল… বিষ… কী যেন—কী বলেছিলে তুমি? মনে করতে পারছি না কেন?",
    },
    {
      bg: "bedroom",
      speaker: "narrator",
      text: "বাগান নেই। মরু নেই। নদীগ্রাম, ছাদ, পাহাড়—কিছুই নেই। শুধু এই ঘর, এই বিছানা।",
    },
    {
      bg: "bedroom",
      girl: { x: 38, facing: "down" },
      inBed: true,
      speaker: "narrator",
      text: "সে খুঁজল—দরজায়, রাস্তায়, প্রতিটি চেনা মুখের ভিড়ে। কোথাও নেই।",
    },
    {
      bg: "bedroom",
      girl: { x: 38, facing: "right" },
      inBed: true,
      speaker: "narrator",
      text: "তারপর, জানালার ফাঁকে একটা রঙের আভাস দেখে—সে বারান্দার দিকে পা বাড়াল।",
    },
  ],
};

export const EPISODE_ROOFTOP_MEET: Episode = {
  kicker: "অধ্যায় ৪ · পর্ব ১",
  title: "ঢাকার ছাদে",
  shots: [
    {
      bg: "rooftop",
      girl: { x: 30, facing: "right" },
      speaker: "narrator",
      text: "হেমন্তের বিকেল। পুরান ঢাকার ছাদে ছাদে ঘুড়ি, নিচে রিকশার টুংটাং, দূরে আজানের সুর।",
    },
    {
      bg: "rooftop",
      girl: { x: 28, facing: "right" },
      speaker: "narrator",
      text: "তিনটি বিশ্বাসের তারা জ্বলে উঠতেই—সবগুলো ঘুড়ি একসঙ্গে থমকে দাঁড়াল।",
      fx: "glow",
    },
    {
      bg: "rooftop",
      girl: { x: 32, facing: "right", action: "dance" },
      boy: { x: 68, facing: "left", opacity: 1 },
      speaker: "girl",
      text: "চায়ের কাপ হাতে দাঁড়িয়ে আছ! এত সহজে ধরা দেবে ভাবিনি।",
      fx: "glow",
    },
    {
      bg: "dusk",
      girl: { x: 34, facing: "right" },
      boy: { x: 66, facing: "left", opacity: 1 },
      speaker: "boy",
      text: "A city holds a thousand roofs, but only one sky.",
      sub: "শহরে হাজারটা ছাদ, কিন্তু আকাশ একটাই।",
    },
    {
      bg: "dusk",
      girl: { x: 36, facing: "right" },
      boy: { x: 70, facing: "left", opacity: 0.35 },
      speaker: "boy",
      text: "ঘুড়ির সুতো ছিঁড়ে গেলে ঘুড়ি হারায় না, বহ্নি—সে শুধু অন্য ছাদে নামে।",
    },
    {
      bg: "void",
      girl: { x: 50, facing: "down", low: true },
      boy: null,
      speaker: "narrator",
      text: "সন্ধ্যার ধোঁয়াশায় মিলিয়ে গেল সে—ছেঁড়া ঘুড়ির মতো।",
    },
    {
      bg: "rooftop",
      girl: { x: 50, facing: "down" },
      speaker: "girl",
      text: "বেশ। শহরের সব ফেইথ কয়েন জোগাড় করব—ছাদে ছাদে খুঁজব তোমাকে।",
      fx: "glow",
    },
    {
      bg: "stars",
      girl: { x: 50, facing: "up" },
      speaker: "narrator",
      text: "অভিযান চলছে — শহরের সব ফেইথ কয়েন জোগাড় করো।",
      fx: "glow",
    },
  ],
};

export const EPISODE_ROOFTOP_FINAL: Episode = {
  kicker: "অধ্যায় ৪ · শেষ পর্ব",
  title: "একটাই আকাশ",
  shots: [
    {
      bg: "stars",
      girl: { x: 26, facing: "right" },
      speaker: "narrator",
      text: "শহরের ধোঁয়াশার ওপরে সবগুলো তারা জ্বলে উঠল। জেনারেটরের শব্দও যেন থেমে গেল।",
      fx: "glow",
    },
    {
      bg: "rooftop",
      girl: { x: 34, facing: "right", action: "dance" },
      boy: { x: 66, facing: "left", opacity: 0.9 },
      speaker: "girl",
      text: "এই শহরে তোমাকে খুঁজে পাওয়া—এটাই আমার সবচেয়ে বড় জয়।",
      fx: "glow",
    },
    {
      bg: "dusk",
      girl: { x: 36, facing: "right" },
      boy: { x: 64, facing: "left", opacity: 0.8 },
      speaker: "boy",
      text: "তুমি এখন শহরের ভিড়েও চিনে নাও। আর একটা জায়গা বাকি, বহ্নি।",
    },
    {
      bg: "dusk",
      girl: { x: 38, facing: "right" },
      boy: { x: 64, facing: "left", opacity: 0.35 },
      speaker: "boy",
      text: "যেখানে মেঘ পায়ের নিচে, প্রার্থনার পতাকা ওড়ে—সেই পাহাড়ে এসো। শেষ দেখা সেখানে।",
      fx: "petals",
    },
    {
      bg: "void",
      girl: { x: 46, facing: "right" },
      boy: { x: 64, facing: "left", opacity: 0 },
      speaker: "narrator",
      text: "শহরের আলোয় মিলিয়ে গেল সে—নিভে যাওয়া জানালার মতো।",
    },
    {
      bg: "mountain",
      girl: { x: 50, facing: "up" },
      speaker: "narrator",
      text: "উত্তরে, অনেক দূরে—বরফের চূড়া। প্রার্থনার পতাকা ডাকছে। — চলবে",
      fx: "glow",
    },
  ],
};

export const EPISODE_MOUNTAIN_MEET: Episode = {
  kicker: "অধ্যায় ৫ · পর্ব ১",
  title: "পাহাড়ের মন্দিরে",
  shots: [
    {
      bg: "mountain",
      girl: { x: 30, facing: "right" },
      speaker: "narrator",
      text: "কুয়াশা ঠেলে বহ্নি উঠে এল পাহাড়ের মন্দিরে। পাইনের সারি, বরফের গন্ধ, রঙিন প্রার্থনার পতাকা।",
    },
    {
      bg: "mountain",
      girl: { x: 28, facing: "right" },
      speaker: "narrator",
      text: "তিনটি বিশ্বাসের তারা জ্বলে উঠতেই—সবগুলো পতাকা একদিকে উড়ল, হাওয়া ছাড়াই।",
      fx: "glow",
    },
    {
      bg: "mountain",
      girl: { x: 32, facing: "right", action: "dance" },
      boy: { x: 68, facing: "left", opacity: 1 },
      speaker: "girl",
      text: "এত ওপরে! ঠান্ডায় জমে যাচ্ছি, তবু এসেছি। এবার তো বলো—এটাই কি শেষ?",
      fx: "glow",
    },
    {
      bg: "mist",
      girl: { x: 34, facing: "right" },
      boy: { x: 66, facing: "left", opacity: 1 },
      speaker: "boy",
      text: "Snow keeps every promise the summer made.",
      sub: "গ্রীষ্ম যত প্রতিশ্রুতি দেয়, বরফ সব রেখে দেয়।",
    },
    {
      bg: "mist",
      girl: { x: 36, facing: "right" },
      boy: { x: 70, facing: "left", opacity: 0.35 },
      speaker: "boy",
      text: "শেষ তারাগুলো জ্বালাও, বহ্নি। মন্দিরের আগুনের পাশে—আমি অপেক্ষা করব।",
    },
    {
      bg: "void",
      girl: { x: 50, facing: "down", low: true },
      boy: null,
      speaker: "narrator",
      text: "তুষারের ঘূর্ণিতে মিলিয়ে গেল সে—নিঃশ্বাসের ভাপের মতো।",
    },
    {
      bg: "stars",
      girl: { x: 50, facing: "up" },
      speaker: "narrator",
      text: "শেষ অভিযান — পাহাড়ের সব ফেইথ কয়েন জোগাড় করো।",
      fx: "glow",
    },
  ],
};

export const EPISODE_MOUNTAIN_FINAL: Episode = {
  kicker: "অধ্যায় ৫ · শেষ পর্ব",
  title: "স্বপ্নের শিকল",
  shots: [
    {
      bg: "stars",
      girl: { x: 26, facing: "right" },
      speaker: "narrator",
      text: "হিমালয়ের আকাশে সবগুলো তারা জ্বলে উঠল। মন্দিরের আগুনের পাশে—অবশেষে—সে দাঁড়িয়ে।",
      fx: "glow",
    },
    {
      bg: "mountain",
      girl: { x: 34, facing: "right", action: "dance" },
      boy: { x: 66, facing: "left", opacity: 1 },
      speaker: "girl",
      text: "পেয়েছি! পাঁচটা পৃথিবী পেরিয়ে, অবশেষে তোমার সামনে। এবার বলো—সব বলো।",
      fx: "glow",
    },
    {
      bg: "mountain",
      girl: { x: 38, facing: "right" },
      boy: { x: 62, facing: "left", opacity: 1, low: true },
      speaker: "boy",
      cue: "sheje",
      text: "কিছু কথা আছে… যা আমি চাইলেও বলতে পারি না।",
    },
    {
      bg: "mist",
      girl: { x: 40, facing: "right" },
      boy: { x: 60, facing: "left", opacity: 1, low: true },
      speaker: "narrator",
      text: "বহ্নি তখন দেখল—ছেলেটার হাত-পা অদৃশ্য শেকলে বাঁধা। একটা অদৃশ্য মুঠো তার গলা চেপে ধরে আছে—নিঃশ্বাস নিতে পারছে না সে। তার নিয়তি আজীবনের জন্য সিলমোহর করা।",
    },
    {
      bg: "mist",
      girl: { x: 40, facing: "right" },
      boy: { x: 60, facing: "left", opacity: 0.9, low: true },
      speaker: "boy",
      text: "দাস হয়ে যেতাম আমিও… কিন্তু আমার শরীর থেকে যে বিষ ঝরে, সে আমাকে তা-ও হতে দেয়নি। আমার জীবনটাই আশেপাশের মানুষের জন্য বিষ।",
    },
    {
      bg: "void",
      girl: { x: 44, facing: "right" },
      boy: { x: 58, facing: "left", opacity: 0.9, low: true },
      speaker: "girl",
      text: "তাতে কী! আমি ভয় পাই না—এই যে, আমার হাত ধরো!",
      fx: "petals",
    },
    {
      bg: "void",
      girl: { x: 46, facing: "right" },
      boy: { x: 58, facing: "left", opacity: 0.55, low: true },
      speaker: "narrator",
      text: "কিন্তু সে বাতাসে মিলিয়ে গেল না। মিলিয়ে যাওয়ার কিছু ছিলই না—ছেলেটার অস্তিত্ব বহ্নির একটা স্বপ্ন মাত্র।",
    },
    {
      bg: "void",
      speaker: "narrator",
      text: "আর তারপর—চোখ খুলল।",
    },
  ],
};

/**
 * Chapter 5 epilogue, frame 2: the balcony. One chance — a familiar
 * shadow in the sky — and then the boy disappears for good.
 */
export const EPISODE_BALCONY_END: Episode = {
  kicker: "বারান্দায়",
  title: "একটাই সুযোগ",
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
      text: "আকাশের ওপরে—একটা পরিচিত ছায়া ভাসছে। একটাই সুযোগ—শেষবারের মতো।",
    },
    {
      bg: "balcony",
      girl: { x: 28, facing: "up" },
      boy: { x: 60, facing: "left", opacity: 0.95 },
      flying: true,
      fx: "rainbow",
      speaker: "girl",
      text: "তুমি! দাঁড়াও—এবার বলো, সেদিন কী বলেছিলে—",
    },
    {
      bg: "balcony",
      girl: { x: 30, facing: "up" },
      boy: { x: 58, facing: "left", opacity: 1 },
      flying: true,
      fx: "rainbow",
      speaker: "boy",
      text: "That is the end.",
      sub: "এখানেই শেষ।",
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
      text: "একটাই সুযোগ ছিল—আর ছেলেটা হারিয়ে গেল। রংধনু মিলিয়ে গেল আকাশের আলোয়।",
    },
    {
      bg: "balcony",
      girl: { x: 34, facing: "up" },
      fx: "rainbow",
      speaker: "narrator",
      text: "কখনোই খুব দেরি হয় না… কিন্তু সেটা ঘটবে শীঘ্রই। — শেষ",
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
