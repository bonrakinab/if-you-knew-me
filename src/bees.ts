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
    speed: 1.55 + (phase % 5) * 0.18,
    phase,
  };
}

export function flapBee(bee: Bee, t: number): void {
  const frame = Math.floor(t * 14 + bee.phase) % 2;
  const mat = bee.sprite.material as THREE.SpriteMaterial;
  mat.map = bee.frames[frame];
  mat.needsUpdate = true;
}
