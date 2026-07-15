import * as THREE from "three";

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

function drawBeeFrame(frame: 0 | 1): THREE.CanvasTexture {
  const size = 16;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);

  const wingY = frame === 0 ? 4 : 3;
  px(ctx, 2, wingY, 4, 3, "rgba(255,255,255,0.75)");
  px(ctx, 10, wingY, 4, 3, "rgba(255,255,255,0.75)");

  px(ctx, 5, 6, 6, 6, "#f2c94c");
  px(ctx, 5, 7, 6, 1, "#2a2118");
  px(ctx, 5, 9, 6, 1, "#2a2118");
  px(ctx, 5, 6, 2, 6, "#1f1812");
  px(ctx, 10, 7, 1, 1, "#1f1812");
  px(ctx, 4, 5, 1, 2, "#1f1812");
  px(ctx, 11, 5, 1, 2, "#1f1812");

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function drawScorpionFrame(frame: 0 | 1): THREE.CanvasTexture {
  const size = 16;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);

  const body = "#7a4326";
  const dark = "#54301c";
  const sting = "#c9772e";

  // body segments
  px(ctx, 6, 9, 5, 3, body);
  px(ctx, 7, 8, 3, 1, body);

  // pincers (open/close between frames)
  const pinch = frame === 0 ? 0 : 1;
  px(ctx, 3, 8 - pinch, 2, 2, dark);
  px(ctx, 3, 11 + pinch, 2, 2, dark);
  px(ctx, 5, 9, 1, 3, dark);

  // legs
  const legShift = frame === 0 ? 0 : 1;
  px(ctx, 6 + legShift, 12, 1, 2, dark);
  px(ctx, 9 - legShift, 12, 1, 2, dark);
  px(ctx, 6 + legShift, 7, 1, 2, dark);
  px(ctx, 9 - legShift, 7, 1, 2, dark);

  // curved tail with stinger (sways between frames)
  const sway = frame === 0 ? 0 : -1;
  px(ctx, 11, 9, 2, 2, body);
  px(ctx, 12, 7 + sway, 2, 2, body);
  px(ctx, 13, 5 + sway, 2, 2, dark);
  px(ctx, 14, 4 + sway, 1, 1, sting);

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function drawLeechFrame(frame: 0 | 1): THREE.CanvasTexture {
  const size = 16;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);

  const body = "#3a4a2c";
  const dark = "#232e1a";
  const belly = "#5c724a";

  // segmented body that stretches / contracts between frames
  const stretch = frame === 0 ? 0 : 2;
  px(ctx, 3, 9, 8 + stretch, 3, body);
  px(ctx, 4, 10, 6 + stretch, 1, belly);
  px(ctx, 3 + stretch, 8, 3, 1, dark);
  px(ctx, 8, 8, 2, 1, dark);
  // head + sucker
  px(ctx, 10 + stretch, 8, 3, 4, body);
  px(ctx, 12 + stretch, 9, 2, 2, dark);
  // tail sucker
  px(ctx, 2, 10, 2, 2, dark);

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function drawCrowFrame(frame: 0 | 1): THREE.CanvasTexture {
  const size = 16;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);

  const body = "#20242c";
  const dark = "#12151a";
  const beak = "#c9a23e";
  const eye = "#d8dce4";

  // wings up / down between frames
  const wingY = frame === 0 ? 3 : 7;
  px(ctx, 1, wingY, 5, 2, dark);
  px(ctx, 10, wingY, 5, 2, dark);

  // body
  px(ctx, 5, 6, 6, 5, body);
  px(ctx, 4, 8, 2, 3, dark);
  // head
  px(ctx, 9, 4, 4, 4, body);
  px(ctx, 13, 5, 2, 2, beak);
  px(ctx, 11, 5, 1, 1, eye);
  // tail
  px(ctx, 2, 6, 3, 2, dark);
  // feet tucked
  px(ctx, 7, 11, 1, 2, beak);
  px(ctx, 9, 11, 1, 2, beak);

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function drawWispFrame(frame: 0 | 1): THREE.CanvasTexture {
  const size = 16;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);

  const core = "#dff2ff";
  const mid = "rgba(170,215,245,0.85)";
  const halo = "rgba(140,190,235,0.4)";

  // swirling frost spirit — arms rotate between frames
  const swirl = frame === 0 ? 0 : 1;
  px(ctx, 6, 5, 4, 6, mid);
  px(ctx, 7, 6, 2, 3, core);
  px(ctx, 4 - swirl, 4 + swirl, 2, 2, halo);
  px(ctx, 10 + swirl, 4 - swirl * 0, 2, 2, halo);
  px(ctx, 5 + swirl, 11, 2, 2, halo);
  px(ctx, 9 - swirl, 12, 2, 2, halo);
  // icy eyes
  px(ctx, 7, 7, 1, 1, "#3d6a8a");
  px(ctx, 9, 7, 1, 1, "#3d6a8a");

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export type Bee = {
  group: THREE.Group;
  sprite: THREE.Sprite;
  frames: [THREE.CanvasTexture, THREE.CanvasTexture];
  x: number;
  z: number;
  y: number;
  tx: number;
  tz: number;
  speed: number;
  phase: number;
};

export function createBee(x: number, z: number, phase: number): Bee {
  const frames: [THREE.CanvasTexture, THREE.CanvasTexture] = [
    drawBeeFrame(0),
    drawBeeFrame(1),
  ];
  const mat = new THREE.SpriteMaterial({
    map: frames[0],
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(0.55, 0.55, 1);
  sprite.center.set(0.5, 0.35);

  const group = new THREE.Group();
  group.add(sprite);
  group.position.set(x, 0.55, z);

  return {
    group,
    sprite,
    frames,
    x,
    z,
    y: 0.55,
    tx: x,
    tz: z,
    speed: 2.35 + (phase % 5) * 0.22,
    phase,
  };
}

/** Desert variant: ground-crawling scorpion using the same Bee shape. */
export function createScorpion(x: number, z: number, phase: number): Bee {
  const frames: [THREE.CanvasTexture, THREE.CanvasTexture] = [
    drawScorpionFrame(0),
    drawScorpionFrame(1),
  ];
  const mat = new THREE.SpriteMaterial({
    map: frames[0],
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(0.62, 0.62, 1);
  sprite.center.set(0.5, 0.3);

  const group = new THREE.Group();
  group.add(sprite);
  group.position.set(x, 0.12, z);

  return {
    group,
    sprite,
    frames,
    x,
    z,
    y: 0.12,
    tx: x,
    tz: z,
    speed: 2.1 + (phase % 5) * 0.2,
    phase,
  };
}

function makeCreature(
  frames: [THREE.CanvasTexture, THREE.CanvasTexture],
  x: number,
  z: number,
  phase: number,
  opts: { scale: number; centerY: number; y: number; speed: number },
): Bee {
  const mat = new THREE.SpriteMaterial({
    map: frames[0],
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(opts.scale, opts.scale, 1);
  sprite.center.set(0.5, opts.centerY);

  const group = new THREE.Group();
  group.add(sprite);
  group.position.set(x, opts.y, z);

  return {
    group,
    sprite,
    frames,
    x,
    z,
    y: opts.y,
    tx: x,
    tz: z,
    speed: opts.speed + (phase % 5) * 0.2,
    phase,
  };
}

/** Monsoon variant: a ground-slinking leech. */
export function createLeech(x: number, z: number, phase: number): Bee {
  return makeCreature([drawLeechFrame(0), drawLeechFrame(1)], x, z, phase, {
    scale: 0.6,
    centerY: 0.3,
    y: 0.1,
    speed: 2.0,
  });
}

/** Rooftop variant: a swooping city crow. */
export function createCrow(x: number, z: number, phase: number): Bee {
  return makeCreature([drawCrowFrame(0), drawCrowFrame(1)], x, z, phase, {
    scale: 0.72,
    centerY: 0.35,
    y: 0.6,
    speed: 2.5,
  });
}

/** Mountain variant: a drifting frost wisp. */
export function createWisp(x: number, z: number, phase: number): Bee {
  return makeCreature([drawWispFrame(0), drawWispFrame(1)], x, z, phase, {
    scale: 0.66,
    centerY: 0.35,
    y: 0.5,
    speed: 2.2,
  });
}

export function flapBee(bee: Bee, t: number): void {
  const frame = Math.floor(t * 14 + bee.phase) % 2;
  const mat = bee.sprite.material as THREE.SpriteMaterial;
  mat.map = bee.frames[frame];
  mat.needsUpdate = true;
}
