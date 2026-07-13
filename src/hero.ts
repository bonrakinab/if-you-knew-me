import * as THREE from "three";

export type Facing = "down" | "up" | "left" | "right";

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

/** Tiny Pokémon-overworld style girl in a bright dress */
function drawSprite(
  facing: Facing,
  frame: 0 | 1,
): THREE.CanvasTexture {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);

  const skin = "#d4a07a";
  const hair = "#3b241c";
  const dressA = "#e85aa0";
  const dressB = "#9b4dff";
  const accent = "#ffb347";
  const shoe = "#5a3a2a";
  const eye = "#2a1a14";
  const white = "#fff6f0";

  const bob = frame === 1 ? 1 : 0;
  const legSwap = frame === 1;

  // shadow
  px(ctx, 10, 28, 12, 3, "rgba(40,50,40,0.25)");

  // legs / shoes
  if (facing === "left" || facing === "right") {
    px(ctx, 13, 22 + bob, 3, 5, skin);
    px(ctx, 17, 22 + bob, 3, 5, skin);
    px(ctx, legSwap ? 12 : 13, 26 + bob, 4, 2, shoe);
    px(ctx, legSwap ? 17 : 16, 26 + bob, 4, 2, shoe);
  } else {
    px(ctx, 12, 22 + bob, 3, 5, skin);
    px(ctx, 17, 22 + bob, 3, 5, skin);
    if (legSwap) {
      px(ctx, 11, 26 + bob, 4, 2, shoe);
      px(ctx, 17, 27 + bob, 4, 2, shoe);
    } else {
      px(ctx, 12, 27 + bob, 4, 2, shoe);
      px(ctx, 16, 26 + bob, 4, 2, shoe);
    }
  }

  // dress body
  px(ctx, 11, 14 + bob, 10, 9, dressA);
  px(ctx, 12, 15 + bob, 8, 2, dressB);
  px(ctx, 13, 18 + bob, 2, 2, accent);
  px(ctx, 17, 19 + bob, 2, 2, white);
  // skirt flare
  px(ctx, 9, 20 + bob, 14, 3, dressA);
  px(ctx, 10, 21 + bob, 12, 2, dressB);

  // puff sleeves
  if (facing !== "up") {
    px(ctx, 8, 14 + bob, 4, 4, dressA);
    px(ctx, 20, 14 + bob, 4, 4, dressA);
    px(ctx, 8, 15 + bob, 3, 2, white);
    px(ctx, 21, 15 + bob, 3, 2, white);
  } else {
    px(ctx, 8, 14 + bob, 4, 4, dressA);
    px(ctx, 20, 14 + bob, 4, 4, dressA);
  }

  // arms slight swing
  if (facing === "down" || facing === "up") {
    const armY = 16 + bob + (legSwap ? 1 : 0);
    px(ctx, 7, armY, 2, 4, skin);
    px(ctx, 23, armY + (legSwap ? -1 : 1), 2, 4, skin);
  } else if (facing === "right") {
    px(ctx, 22, 16 + bob, 3, 2, skin);
  } else {
    px(ctx, 7, 16 + bob, 3, 2, skin);
  }

  // head
  px(ctx, 12, 6 + bob, 8, 8, skin);
  // hair
  px(ctx, 11, 5 + bob, 10, 4, hair);
  px(ctx, 10, 7 + bob, 3, 8, hair);
  px(ctx, 19, 7 + bob, 3, 8, hair);
  if (facing === "down") {
    px(ctx, 11, 8 + bob, 10, 2, hair);
    // face
    px(ctx, 14, 10 + bob, 1, 1, eye);
    px(ctx, 17, 10 + bob, 1, 1, eye);
    px(ctx, 15, 12 + bob, 2, 1, "#c45a5a");
  } else if (facing === "up") {
    px(ctx, 11, 6 + bob, 10, 7, hair);
  } else if (facing === "right") {
    px(ctx, 12, 6 + bob, 9, 4, hair);
    px(ctx, 18, 10 + bob, 1, 1, eye);
    px(ctx, 16, 12 + bob, 2, 1, "#c45a5a");
  } else {
    px(ctx, 11, 6 + bob, 9, 4, hair);
    px(ctx, 13, 10 + bob, 1, 1, eye);
    px(ctx, 14, 12 + bob, 2, 1, "#c45a5a");
  }

  // necklace hint
  if (facing === "down") {
    px(ctx, 15, 14 + bob, 1, 1, white);
    px(ctx, 16, 14 + bob, 1, 1, "#6ec4b8");
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function buildFrames(): FrameSet {
  return {
    down: [drawSprite("down", 0), drawSprite("down", 1)],
    up: [drawSprite("up", 0), drawSprite("up", 1)],
    left: [drawSprite("left", 0), drawSprite("left", 1)],
    right: [drawSprite("right", 0), drawSprite("right", 1)],
  };
}

export type OverworldHero = {
  group: THREE.Group;
  setPose: (facing: Facing, walking: boolean, t: number) => void;
};

export function createOverworldHero(): OverworldHero {
  const frames = buildFrames();
  const mat = new THREE.SpriteMaterial({
    map: frames.down[0],
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(1.15, 1.15, 1);
  sprite.center.set(0.5, 0);

  const group = new THREE.Group();
  group.add(sprite);

  let facing: Facing = "down";
  let frameIndex = 0;

  const setPose = (next: Facing, walking: boolean, t: number) => {
    facing = next;
    if (walking) {
      frameIndex = Math.floor(t * 8) % 2;
    } else {
      frameIndex = 0;
    }
    mat.map = frames[facing][frameIndex];
    mat.needsUpdate = true;
  };

  return { group, setPose };
}

export function facingFromDir(dx: number, dz: number): Facing {
  if (Math.abs(dx) > Math.abs(dz)) {
    return dx > 0 ? "right" : "left";
  }
  return dz > 0 ? "down" : "up";
}
