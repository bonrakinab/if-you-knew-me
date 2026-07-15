import * as THREE from "three";

export type Facing = "down" | "up" | "left" | "right";
export type HeroStyle = "girl" | "boy";
export type HeroAction = "idle" | "walk" | "run" | "jump" | "dance";

type FrameSet = Record<Facing, THREE.Texture[]>;

function px(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

type Palette = {
  skin: string;
  hair: string;
  topA: string;
  topB: string;
  accent: string;
  shoe: string;
  eye: string;
  white: string;
  lip: string;
};

const GIRL: Palette = {
  skin: "#d4a07a",
  hair: "#3b241c",
  topA: "#e85aa0",
  topB: "#9b4dff",
  accent: "#ffb347",
  shoe: "#5a3a2a",
  eye: "#2a1a14",
  white: "#fff6f0",
  lip: "#c45a5a",
};

const BOY: Palette = {
  skin: "#c9956c",
  hair: "#1f1714",
  topA: "#3d6ea5",
  topB: "#2a4f78",
  accent: "#e8c56a",
  shoe: "#2c241e",
  eye: "#1a1410",
  white: "#f4f7fb",
  lip: "#a56b5a",
};

function drawHeroCanvas(
  style: HeroStyle,
  facing: Facing,
  frame: 0 | 1,
  action: HeroAction,
): HTMLCanvasElement {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);

  const p = style === "girl" ? GIRL : BOY;
  const jumpLift = action === "jump" ? -3 : 0;
  const danceLift = action === "dance" ? (frame === 1 ? -1 : 0) : 0;
  const bob = (frame === 1 && (action === "walk" || action === "run") ? 1 : 0) + jumpLift + danceLift;
  const legSwap = frame === 1;
  const runStretch = action === "run" ? 1 : 0;

  px(ctx, 10, 28 + (action === "jump" ? 2 : 0), 12, 3, "rgba(40,50,40,0.25)");

  // legs / shoes
  if (facing === "left" || facing === "right") {
    px(ctx, 13, 22 + bob, 3, 5 + runStretch, p.skin);
    px(ctx, 17, 22 + bob, 3, 5 + runStretch, p.skin);
    px(ctx, legSwap ? 12 : 13, 26 + bob + runStretch, 4, 2, p.shoe);
    px(ctx, legSwap ? 17 : 16, 26 + bob + runStretch, 4, 2, p.shoe);
  } else {
    px(ctx, 12, 22 + bob, 3, 5 + runStretch, p.skin);
    px(ctx, 17, 22 + bob, 3, 5 + runStretch, p.skin);
    if (legSwap) {
      px(ctx, 11, 26 + bob + runStretch, 4, 2, p.shoe);
      px(ctx, 17, 27 + bob + runStretch, 4, 2, p.shoe);
    } else {
      px(ctx, 12, 27 + bob + runStretch, 4, 2, p.shoe);
      px(ctx, 16, 26 + bob + runStretch, 4, 2, p.shoe);
    }
  }

  // body
  if (style === "girl") {
    px(ctx, 11, 14 + bob, 10, 9, p.topA);
    px(ctx, 12, 15 + bob, 8, 2, p.topB);
    px(ctx, 13, 18 + bob, 2, 2, p.accent);
    px(ctx, 17, 19 + bob, 2, 2, p.white);
    px(ctx, 9, 20 + bob, 14, 3, p.topA);
    px(ctx, 10, 21 + bob, 12, 2, p.topB);
    px(ctx, 8, 14 + bob, 4, 4, p.topA);
    px(ctx, 20, 14 + bob, 4, 4, p.topA);
  } else {
    px(ctx, 11, 14 + bob, 10, 9, p.topA);
    px(ctx, 12, 15 + bob, 8, 3, p.topB);
    px(ctx, 14, 18 + bob, 4, 2, p.accent);
    px(ctx, 10, 21 + bob, 12, 3, "#2f3640");
    px(ctx, 8, 14 + bob, 3, 5, p.topA);
    px(ctx, 21, 14 + bob, 3, 5, p.topA);
  }

  // arms
  if (action === "dance") {
    px(ctx, 6, 10 + bob, 3, 5, p.skin);
    px(ctx, 23, 10 + bob, 3, 5, p.skin);
    px(ctx, 5, 9 + bob, 2, 2, p.accent);
    px(ctx, 25, 9 + bob, 2, 2, p.accent);
  } else if (facing === "down" || facing === "up") {
    const armY = 16 + bob + (legSwap ? 1 : 0);
    px(ctx, 7, armY, 2, 4, p.skin);
    px(ctx, 23, armY + (legSwap ? -1 : 1), 2, 4, p.skin);
  } else if (facing === "right") {
    px(ctx, 22, 16 + bob, 3, 2, p.skin);
  } else {
    px(ctx, 7, 16 + bob, 3, 2, p.skin);
  }

  // head
  px(ctx, 12, 6 + bob, 8, 8, p.skin);
  px(ctx, 11, 5 + bob, 10, 4, p.hair);
  if (style === "girl") {
    px(ctx, 10, 7 + bob, 3, 8, p.hair);
    px(ctx, 19, 7 + bob, 3, 8, p.hair);
  } else {
    px(ctx, 11, 7 + bob, 2, 4, p.hair);
    px(ctx, 19, 7 + bob, 2, 4, p.hair);
  }

  if (facing === "down") {
    px(ctx, 11, 8 + bob, 10, 2, p.hair);
    px(ctx, 14, 10 + bob, 1, 1, p.eye);
    px(ctx, 17, 10 + bob, 1, 1, p.eye);
    px(ctx, 15, 12 + bob, 2, 1, p.lip);
  } else if (facing === "up") {
    px(ctx, 11, 6 + bob, 10, 7, p.hair);
  } else if (facing === "right") {
    px(ctx, 12, 6 + bob, 9, 4, p.hair);
    px(ctx, 18, 10 + bob, 1, 1, p.eye);
    px(ctx, 16, 12 + bob, 2, 1, p.lip);
  } else {
    px(ctx, 11, 6 + bob, 9, 4, p.hair);
    px(ctx, 13, 10 + bob, 1, 1, p.eye);
    px(ctx, 14, 12 + bob, 2, 1, p.lip);
  }

  if (style === "girl" && facing === "down") {
    px(ctx, 15, 14 + bob, 1, 1, p.white);
    px(ctx, 16, 14 + bob, 1, 1, "#6ec4b8");
  }

  return canvas;
}

function drawSprite(
  style: HeroStyle,
  facing: Facing,
  frame: 0 | 1,
  action: HeroAction,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(
    drawHeroCanvas(style, facing, frame, action),
  );
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/** Data-URL portrait of a hero sprite, for DOM cutscenes. */
export function heroSpriteUrl(
  style: HeroStyle,
  facing: Facing = "down",
  frame: 0 | 1 = 0,
  action: HeroAction = "idle",
): string {
  return drawHeroCanvas(style, facing, frame, action).toDataURL();
}

function buildFrames(style: HeroStyle, action: HeroAction): FrameSet {
  return {
    down: [drawSprite(style, "down", 0, action), drawSprite(style, "down", 1, action)],
    up: [drawSprite(style, "up", 0, action), drawSprite(style, "up", 1, action)],
    left: [drawSprite(style, "left", 0, action), drawSprite(style, "left", 1, action)],
    right: [drawSprite(style, "right", 0, action), drawSprite(style, "right", 1, action)],
  };
}

export type OverworldHero = {
  group: THREE.Group;
  setPose: (
    facing: Facing,
    action: HeroAction,
    t: number,
    yOffset?: number,
  ) => void;
};

export function createOverworldHero(style: HeroStyle = "girl"): OverworldHero {
  const bank: Record<HeroAction, FrameSet> = {
    idle: buildFrames(style, "idle"),
    walk: buildFrames(style, "walk"),
    run: buildFrames(style, "run"),
    jump: buildFrames(style, "jump"),
    dance: buildFrames(style, "dance"),
  };

  const mat = new THREE.SpriteMaterial({
    map: bank.idle.down[0],
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(style === "boy" ? 1.2 : 1.15, style === "boy" ? 1.2 : 1.15, 1);
  sprite.center.set(0.5, 0);

  const group = new THREE.Group();
  group.add(sprite);

  const setPose = (
    facing: Facing,
    action: HeroAction,
    t: number,
    yOffset = 0,
  ) => {
    const frames = bank[action];
    const animating =
      action === "walk" || action === "run" || action === "dance";
    const speed = action === "run" ? 12 : action === "dance" ? 6 : 8;
    const frameIndex = animating ? Math.floor(t * speed) % 2 : 0;
    mat.map = frames[facing][frameIndex];
    mat.needsUpdate = true;
    sprite.position.y = yOffset;
  };

  return { group, setPose };
}

function drawCarCanvas(facing: Facing, frame: 0 | 1): HTMLCanvasElement {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);

  const body = "#c05a4d";
  const bodyDark = "#8a3a32";
  const window = "#bcd8e8";
  const wheel = "#26201c";
  const hub = "#8a8378";
  const hair = "#3b241c";
  const skin = "#d4a07a";
  const light = "#ffe9a8";

  const bounce = frame === 1 ? 1 : 0;

  if (facing === "left" || facing === "right") {
    ctx.save();
    if (facing === "left") {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }
    // shadow
    px(ctx, 5, 27, 22, 3, "rgba(40,40,30,0.3)");
    // body
    px(ctx, 4, 18 - bounce, 24, 7, body);
    px(ctx, 4, 23 - bounce, 24, 2, bodyDark);
    // cabin
    px(ctx, 9, 12 - bounce, 13, 6, body);
    px(ctx, 11, 13 - bounce, 9, 4, window);
    // driver (the girl)
    px(ctx, 13, 13 - bounce, 4, 2, hair);
    px(ctx, 14, 15 - bounce, 2, 2, skin);
    // headlight & taillight
    px(ctx, 26, 19 - bounce, 2, 2, light);
    px(ctx, 4, 19 - bounce, 1, 2, "#d98a6a");
    // wheels (hub dot spins between frames)
    px(ctx, 7, 24, 5, 5, wheel);
    px(ctx, 20, 24, 5, 5, wheel);
    px(ctx, frame === 0 ? 9 : 8, frame === 0 ? 26 : 25, 1, 1, hub);
    px(ctx, frame === 0 ? 22 : 21, frame === 0 ? 26 : 25, 1, 1, hub);
    ctx.restore();
  } else {
    // front (down) / back (up)
    px(ctx, 9, 27, 14, 3, "rgba(40,40,30,0.3)");
    px(ctx, 9, 14 - bounce, 14, 12, body);
    px(ctx, 9, 24 - bounce, 14, 2, bodyDark);
    px(ctx, 10, 10 - bounce, 12, 4, body);
    if (facing === "down") {
      px(ctx, 11, 11 - bounce, 10, 3, window);
      px(ctx, 14, 11 - bounce, 4, 2, hair);
      px(ctx, 15, 13 - bounce, 2, 1, skin);
      px(ctx, 10, 20 - bounce, 3, 2, light);
      px(ctx, 19, 20 - bounce, 3, 2, light);
    } else {
      px(ctx, 11, 11 - bounce, 10, 3, bodyDark);
      px(ctx, 10, 20 - bounce, 3, 2, "#d98a6a");
      px(ctx, 19, 20 - bounce, 3, 2, "#d98a6a");
    }
    const wheelShift = frame === 0 ? 0 : 1;
    px(ctx, 7, 16 + wheelShift, 2, 6, wheel);
    px(ctx, 23, 16 + wheelShift, 2, 6, wheel);
  }

  return canvas;
}

/** The girl's car for the desert chapter — same OverworldHero interface. */
export function createCarHero(): OverworldHero {
  const frames: Record<Facing, [THREE.CanvasTexture, THREE.CanvasTexture]> = {
    down: [0, 1].map((f) => {
      const t = new THREE.CanvasTexture(drawCarCanvas("down", f as 0 | 1));
      t.magFilter = THREE.NearestFilter;
      t.minFilter = THREE.NearestFilter;
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }) as [THREE.CanvasTexture, THREE.CanvasTexture],
    up: [0, 1].map((f) => {
      const t = new THREE.CanvasTexture(drawCarCanvas("up", f as 0 | 1));
      t.magFilter = THREE.NearestFilter;
      t.minFilter = THREE.NearestFilter;
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }) as [THREE.CanvasTexture, THREE.CanvasTexture],
    left: [0, 1].map((f) => {
      const t = new THREE.CanvasTexture(drawCarCanvas("left", f as 0 | 1));
      t.magFilter = THREE.NearestFilter;
      t.minFilter = THREE.NearestFilter;
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }) as [THREE.CanvasTexture, THREE.CanvasTexture],
    right: [0, 1].map((f) => {
      const t = new THREE.CanvasTexture(drawCarCanvas("right", f as 0 | 1));
      t.magFilter = THREE.NearestFilter;
      t.minFilter = THREE.NearestFilter;
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }) as [THREE.CanvasTexture, THREE.CanvasTexture],
  };

  const mat = new THREE.SpriteMaterial({
    map: frames.down[0],
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(1.5, 1.5, 1);
  sprite.center.set(0.5, 0);

  const group = new THREE.Group();
  group.add(sprite);

  const setPose = (
    facing: Facing,
    action: HeroAction,
    t: number,
    yOffset = 0,
  ) => {
    const moving =
      action === "walk" || action === "run" || action === "dance";
    const speed = action === "run" ? 14 : 9;
    const frameIndex = moving ? Math.floor(t * speed) % 2 : 0;
    mat.map = frames[facing][frameIndex as 0 | 1];
    mat.needsUpdate = true;
    sprite.position.y = yOffset;
  };

  return { group, setPose };
}

/** Data-URL portrait of the car, for DOM cutscenes. */
export function carSpriteUrl(facing: Facing = "down"): string {
  return drawCarCanvas(facing, 0).toDataURL();
}

export function facingFromDir(dx: number, dz: number): Facing {
  if (Math.abs(dx) > Math.abs(dz)) {
    return dx > 0 ? "right" : "left";
  }
  return dz > 0 ? "down" : "up";
}
