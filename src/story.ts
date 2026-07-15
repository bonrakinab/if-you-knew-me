/**
 * Anime-episode cutscene engine.
 * Full-screen letterboxed scenes with the game's own pixel-art characters,
 * typewriter dialogue, and tap-to-advance. Used for the boy (রংধনু) story arc.
 */

import { heroSpriteUrl, type HeroAction, type Facing } from "./hero";

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
  bg: "dusk" | "mist" | "stars" | "void";
  girl?: ActorState | null;
  boy?: ActorState | null;
  speaker?: "girl" | "boy" | "narrator";
  text: string;
  /** Optional smaller subtitle line (e.g. translation). */
  sub?: string;
  fx?: "petals" | "glow" | "none";
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
      text: "বাতাসে মিলিয়ে গেল সে—ফুলের পাপড়ির মতো, চিরদিনের জন্য।",
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
      text: "শেষ — The End",
      fx: "glow",
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

export function playEpisode(episode: Episode): Promise<void> {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "story-overlay";
    overlay.innerHTML = `
      <div class="story-scene" data-bg="dusk">
        <div class="story-fx-petals" aria-hidden="true"></div>
        <div class="story-glow" aria-hidden="true"></div>
        <div class="story-ground" aria-hidden="true"></div>
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
    const girlEl = overlay.querySelector<HTMLImageElement>(".story-girl")!;
    const boyEl = overlay.querySelector<HTMLImageElement>(".story-boy")!;
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

    const applyActor = (el: HTMLImageElement, state?: ActorState | null) => {
      if (!state) {
        el.style.opacity = "0";
        return;
      }
      el.src = heroSpriteUrl(
        el === boyEl ? "boy" : "girl",
        state.facing ?? "down",
        0,
        state.action ?? "idle",
      );
      el.style.left = `${state.x}%`;
      el.style.opacity = String(state.opacity ?? 1);
      el.classList.toggle("is-low", Boolean(state.low));
    };

    const finishTyping = () => {
      window.clearInterval(typeTimer);
      typing = false;
      textEl.textContent = pendingText;
      hintEl.classList.remove("is-hidden");
    };

    const showShot = (shot: Shot) => {
      scene.dataset.bg = shot.bg;
      glow.style.opacity = shot.fx === "glow" ? "1" : "0";
      petalHost.style.opacity = shot.fx === "petals" ? "1" : "0";
      applyActor(girlEl, shot.girl);
      applyActor(boyEl, shot.boy);

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
