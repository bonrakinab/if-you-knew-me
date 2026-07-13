import * as THREE from "three";
import { discoveries, type Discovery } from "./discoveries";
import { poetQuotes, type PoetQuote } from "./quotes";
import { createOverworldHero, facingFromDir, type Facing, type HeroAction } from "./hero";

export type WorldCallbacks = {
  onDiscover: (item: Discovery, foundCount: number, total: number) => void;
  onQuote: (
    quote: PoetQuote,
    info: { isNew: boolean; faithCoins: number; totalQuotes: number },
  ) => void;
  onConstellationComplete: () => void;
  onComplete: () => void;
  onHoverChange: (title: string | null) => void;
};

export type QuietTier = "path" | "moon" | "sky";

export type WorldProgress = {
  letters: string[];
  quotes: string[];
  foundCount: number;
  faithCoins: number;
  completed: boolean;
  constellationDone: boolean;
  unlocked: QuietTier[];
};

export type WorldApi = {
  enable: () => void;
  setHeld: (code: string, down: boolean) => void;
  setHour: (hour: number) => void;
  destroy: () => void;
  getProgress: () => WorldProgress;
  restoreProgress: (save: {
    letters: string[];
    quotes: string[];
    unlocked?: QuietTier[];
  }) => void;
  reopenLetter: (id: string) => boolean;
  reopenQuote: (id: string) => boolean;
  unlockQuietMoment: (tier: QuietTier) => boolean;
  lookAtConstellation: (ms?: number) => void;
  spawnPartner: () => void;
  hasPartner: () => boolean;
};

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeFlower(
  scale: number,
  petalColor: number,
  centerColor: number,
  glow = false,
): THREE.Group {
  const group = new THREE.Group();
  const stemH = 0.55 * scale;
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02 * scale, 0.03 * scale, stemH, 6),
    new THREE.MeshStandardMaterial({ color: 0x4f7a52, roughness: 0.9 }),
  );
  stem.position.y = stemH / 2;
  group.add(stem);

  const head = new THREE.Group();
  head.position.y = stemH;
  const petalMat = new THREE.MeshStandardMaterial({
    color: petalColor,
    roughness: 0.75,
    emissive: glow ? petalColor : 0x000000,
    emissiveIntensity: glow ? 0.35 : 0,
  });
  const petalGeo = new THREE.SphereGeometry(0.12 * scale, 10, 10);
  for (let i = 0; i < 5; i++) {
    const petal = new THREE.Mesh(petalGeo, petalMat);
    const a = (i / 5) * Math.PI * 2;
    petal.position.set(Math.cos(a) * 0.12 * scale, 0.02, Math.sin(a) * 0.12 * scale);
    petal.scale.set(1, 0.45, 1.15);
    head.add(petal);
  }
  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.07 * scale, 10, 10),
    new THREE.MeshStandardMaterial({
      color: centerColor,
      emissive: glow ? 0xfff0b0 : 0x000000,
      emissiveIntensity: glow ? 0.55 : 0,
      roughness: 0.5,
    }),
  );
  head.add(center);

  if (glow) {
    const aura = new THREE.Mesh(
      new THREE.SphereGeometry(0.32 * scale, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0xfff2c8,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    );
    head.add(aura);
  }

  group.add(head);
  return group;
}

function makeSakuraTree(): THREE.Group {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.2, 2.4, 8),
    new THREE.MeshStandardMaterial({ color: 0x6b4f3a, roughness: 0.92 }),
  );
  trunk.position.y = 1.2;
  tree.add(trunk);

  const canopy = new THREE.Group();
  canopy.position.y = 2.55;
  const pinks = [0xf6c6d4, 0xf3b7c9, 0xe8a0b5, 0xffd6e2];
  for (let i = 0; i < 9; i++) {
    const blob = new THREE.Mesh(
      new THREE.SphereGeometry(0.55 + (i % 3) * 0.12, 14, 14),
      new THREE.MeshStandardMaterial({
        color: pinks[i % pinks.length],
        roughness: 0.85,
        emissive: 0xf2b8c8,
        emissiveIntensity: 0.12,
      }),
    );
    const a = (i / 9) * Math.PI * 2;
    const r = 0.35 + (i % 4) * 0.15;
    blob.position.set(Math.cos(a) * r, (i % 3) * 0.25 - 0.1, Math.sin(a) * r);
    canopy.add(blob);
  }
  tree.add(canopy);

  const hit = new THREE.Mesh(
    new THREE.SphereGeometry(1.6, 16, 16),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );
  hit.position.y = 2.3;
  hit.name = "hit";
  tree.add(hit);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(1.9, 20, 20),
    new THREE.MeshBasicMaterial({
      color: 0xffd0de,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
    }),
  );
  glow.position.y = 2.4;
  tree.add(glow);

  return tree;
}

export function createWorld(
  canvas: HTMLCanvasElement,
  callbacks: WorldCallbacks,
): WorldApi {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2),
  );
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x7fa888, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x8fb396, 0.022);

  const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    140,
  );

  const ambient = new THREE.AmbientLight(0xddeedd, 0.95);
  const key = new THREE.DirectionalLight(0xfff1da, 1.15);
  key.position.set(6, 10, 4);
  const fill = new THREE.DirectionalLight(0x9ec4a0, 0.6);
  fill.position.set(-5, 3, -4);
  const rim = new THREE.DirectionalLight(0xffc9d6, 0.25);
  rim.position.set(0, 4, -8);
  scene.add(ambient, key, fill, rim);

  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x6f9a72,
    roughness: 0.96,
    metalness: 0.02,
  });
  // Ground — greener meadow
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(28, 80),
    groundMat,
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const path = new THREE.Mesh(
    new THREE.RingGeometry(3.2, 3.5, 64),
    new THREE.MeshBasicMaterial({
      color: 0xd9cfb4,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    }),
  );
  path.rotation.x = -Math.PI / 2;
  path.position.y = 0.02;
  scene.add(path);

  // Moon
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(1.35, 48, 48),
    new THREE.MeshStandardMaterial({
      color: 0xf3ead4,
      emissive: 0xe7d7b0,
      emissiveIntensity: 0.45,
      roughness: 0.88,
    }),
  );
  moon.position.set(11, 10, -14);
  scene.add(moon);
  const moonHalo = new THREE.Mesh(
    new THREE.SphereGeometry(2.05, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xf0e6d0,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    }),
  );
  moon.add(moonHalo);

  const pathMat = path.material as THREE.MeshBasicMaterial;
  const moonMat = moon.material as THREE.MeshStandardMaterial;
  const moonHaloMat = moonHalo.material as THREE.MeshBasicMaterial;
  const unlocked = new Set<QuietTier>();
  let silentRestore = false;
  let moonPulse = false;
  let skySoft = false;
  let camMode: "follow" | "sky" = "follow";
  let skyCamUntil = 0;
  let breadcrumbId: string | null = null;

  // Shared constellation — one star per faith coin
  const constellation = new THREE.Group();
  constellation.position.set(0, 14, -8);
  scene.add(constellation);
  const starGeo = new THREE.SphereGeometry(0.12, 10, 10);
  const stars: THREE.Mesh[] = [];
  let constellationDone = false;

  const applyQuietMoment = (tier: QuietTier) => {
    unlocked.add(tier);
    if (tier === "path") {
      pathMat.opacity = 0.78;
      pathMat.color.setHex(0xfff3d6);
    } else if (tier === "moon") {
      moonPulse = true;
      moonMat.emissiveIntensity = 0.95;
      moonHaloMat.opacity = 0.28;
    } else if (tier === "sky") {
      skySoft = true;
      if (scene.fog instanceof THREE.FogExp2) scene.fog.density = 0.014;
      constellation.scale.setScalar(1.25);
    }
  };

  const starSlot = (i: number, total: number) => {
    const a = (i / Math.max(total, 1)) * Math.PI * 1.6 - 0.8;
    const r = 3.2 + (i % 3) * 0.45;
    return new THREE.Vector3(Math.sin(a) * r, Math.cos(a) * 1.1, (i % 4) * 0.35);
  };

  const addConstellationStar = (index: number) => {
    if (stars[index]) return;
    const star = new THREE.Mesh(
      starGeo,
      new THREE.MeshBasicMaterial({
        color: 0xfff1c2,
        transparent: true,
        opacity: 0.95,
      }),
    );
    star.position.copy(starSlot(index, poetQuotes.length));
    star.scale.setScalar(0.01);
    constellation.add(star);
    stars[index] = star;

    if (
      !constellationDone &&
      stars.filter(Boolean).length >= poetQuotes.length
    ) {
      constellationDone = true;
      // Twin dedication stars
      for (const offset of [-0.55, 0.55]) {
        const twin = new THREE.Mesh(
          starGeo,
          new THREE.MeshBasicMaterial({ color: 0xffd0de }),
        );
        twin.position.set(offset, -1.6, 0.2);
        twin.scale.setScalar(1.35);
        constellation.add(twin);
      }
      if (!silentRestore) {
        callbacks.onConstellationComplete();
      }
    }
  };

  // Petal trail behind the hero
  type TrailBit = {
    mesh: THREE.Mesh;
    life: number;
  };
  const trail: TrailBit[] = [];
  const trailGeo = new THREE.CircleGeometry(0.08, 8);
  const trailMat = new THREE.MeshBasicMaterial({
    color: 0xffc9d8,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });
  let trailAcc = 0;

  let dayBlend = 0.55; // 0 night → 1 day
  const dayColor = new THREE.Color(0x7fa888);
  const duskColor = new THREE.Color(0xb08a6a);
  const nightColor = new THREE.Color(0x2a3548);
  const fogDay = new THREE.Color(0x8fb396);
  const fogDusk = new THREE.Color(0xb89a7c);
  const fogNight = new THREE.Color(0x243044);
  const tmpColor = new THREE.Color();

  const applyDayNight = () => {
    if (dayBlend > 0.55) {
      const t = (dayBlend - 0.55) / 0.45;
      tmpColor.copy(duskColor).lerp(dayColor, t);
    } else {
      const t = dayBlend / 0.55;
      tmpColor.copy(nightColor).lerp(duskColor, t);
    }
    renderer.setClearColor(tmpColor, 1);
    if (scene.fog instanceof THREE.FogExp2) {
      if (dayBlend > 0.55) {
        const t = (dayBlend - 0.55) / 0.45;
        scene.fog.color.copy(fogDusk).lerp(fogDay, t);
        scene.fog.density = 0.02;
      } else {
        const t = dayBlend / 0.55;
        scene.fog.color.copy(fogNight).lerp(fogDusk, t);
        scene.fog.density = 0.028;
      }
    }
    ambient.intensity = 0.35 + dayBlend * 0.7;
    key.intensity = 0.35 + dayBlend * 0.9;
    fill.intensity = 0.2 + dayBlend * 0.45;
    moon.visible = dayBlend < 0.72;
    (moon.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.25 + (1 - dayBlend) * 0.55;
    groundMat.color.set(dayBlend < 0.4 ? 0x3f5a48 : 0x6f9a72);
  };

  const rand = mulberry32(11);

  // Decorative flowers everywhere (not interactive)
  const flowerColors = [0xf2d6e0, 0xf7e2a8, 0xe8c4d4, 0xd9ecb8, 0xffd9c8, 0xe4d4f0, 0xf0c8b8, 0xc8e4f0];
  for (let i = 0; i < 170; i++) {
    const angle = rand() * Math.PI * 2;
    const radius = 2.0 + rand() * 19;
    const f = makeFlower(
      0.5 + rand() * 0.85,
      flowerColors[i % flowerColors.length],
      0xf0d878,
      false,
    );
    f.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    f.rotation.y = rand() * Math.PI;
    scene.add(f);
  }

  // Falling sakura petals
  const PETAL_COUNT = 220;
  const petalPositions = new Float32Array(PETAL_COUNT * 3);
  const petalPhase = new Float32Array(PETAL_COUNT);
  for (let i = 0; i < PETAL_COUNT; i++) {
    petalPositions[i * 3] = (rand() - 0.5) * 40;
    petalPositions[i * 3 + 1] = 0.3 + rand() * 9;
    petalPositions[i * 3 + 2] = (rand() - 0.5) * 40;
    petalPhase[i] = rand() * Math.PI * 2;
  }
  const petalGeo = new THREE.BufferGeometry();
  petalGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(petalPositions, 3),
  );
  const petalMat = new THREE.PointsMaterial({
    color: 0xffc9d8,
    size: 0.11,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    sizeAttenuation: true,
  });
  scene.add(new THREE.Points(petalGeo, petalMat));

  // Fireflies
  const FIREFLY_COUNT = 80;
  const firePos = new Float32Array(FIREFLY_COUNT * 3);
  const firePhase = new Float32Array(FIREFLY_COUNT);
  const fireSpeed = new Float32Array(FIREFLY_COUNT);
  for (let i = 0; i < FIREFLY_COUNT; i++) {
    firePos[i * 3] = (rand() - 0.5) * 30;
    firePos[i * 3 + 1] = 0.4 + rand() * 3.5;
    firePos[i * 3 + 2] = (rand() - 0.5) * 30;
    firePhase[i] = rand() * Math.PI * 2;
    fireSpeed[i] = 0.4 + rand() * 0.9;
  }
  const fireGeo = new THREE.BufferGeometry();
  fireGeo.setAttribute("position", new THREE.BufferAttribute(firePos, 3));
  const fireMat = new THREE.PointsMaterial({
    color: 0xe8ff9a,
    size: 0.14,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const fireflies = new THREE.Points(fireGeo, fireMat);
  scene.add(fireflies);

  type Marker = {
    data: Discovery;
    group: THREE.Group;
    core: THREE.Object3D;
    glow: THREE.Object3D;
    found: boolean;
  };

  type QuoteMarker = {
    data: PoetQuote;
    group: THREE.Group;
    hitObjects: THREE.Object3D[];
    collected: boolean;
  };

  const markers: Marker[] = [];
  const markerById = new Map<string, Marker>();
  const quoteMarkers: QuoteMarker[] = [];
  const quoteById = new Map<string, QuoteMarker>();
  const interactables: THREE.Object3D[] = [];

  // Letter discoveries as glowing flowers
  for (const data of discoveries) {
    const group = new THREE.Group();
    group.position.set(data.position[0], 0, data.position[2]);
    group.userData.id = data.id;
    group.userData.kind = "letter";

    const flower = makeFlower(1.15, 0xffe6a8, 0xfff6d0, true);
    flower.position.y = 0;
    group.add(flower);
    scene.add(group);

    const core = flower.children[1];
    const glow = core;
    const marker: Marker = { data, group, core, glow, found: false };
    markers.push(marker);
    markerById.set(data.id, marker);
    flower.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        interactables.push(obj);
        obj.userData.id = data.id;
        obj.userData.kind = "letter";
      }
    });
  }

  // Poet quote flowers & sakura trees
  for (const data of poetQuotes) {
    const group = new THREE.Group();
    group.position.set(data.position[0], 0, data.position[2]);
    group.userData.id = data.id;
    group.userData.kind = "quote";

    const hitObjects: THREE.Object3D[] = [];

    if (data.kind === "sakura") {
      const tree = makeSakuraTree();
      group.add(tree);
      tree.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          interactables.push(obj);
          hitObjects.push(obj);
          obj.userData.id = data.id;
          obj.userData.kind = "quote";
        }
      });
    } else {
      const flower = makeFlower(1.35, 0xffb7d0, 0xfff0a8, true);
      group.add(flower);
      flower.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          interactables.push(obj);
          hitObjects.push(obj);
          obj.userData.id = data.id;
          obj.userData.kind = "quote";
        }
      });
    }

    scene.add(group);
    const qm: QuoteMarker = { data, group, hitObjects, collected: false };
    quoteMarkers.push(qm);
    quoteById.set(data.id, qm);
  }

  // Extra decorative sakura (non-interactive)
  for (let i = 0; i < 14; i++) {
    const tree = makeSakuraTree();
    const a = (i / 14) * Math.PI * 2 + 0.35;
    const r = 12.5 + (i % 4) * 1.4;
    tree.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    tree.scale.setScalar(0.75 + (i % 4) * 0.12);
    tree.rotation.y = rand() * Math.PI;
    scene.add(tree);
  }

  // Meadow clusters of small trees near the ring
  for (let i = 0; i < 8; i++) {
    const tree = makeSakuraTree();
    const a = (i / 8) * Math.PI * 2;
    tree.position.set(Math.cos(a) * 5.8, 0, Math.sin(a) * 5.8);
    tree.scale.setScalar(0.55 + (i % 3) * 0.08);
    scene.add(tree);
  }

  const hero = createOverworldHero("girl");
  hero.group.position.set(0, 0, 6.5);
  scene.add(hero.group);

  let partner: ReturnType<typeof createOverworldHero> | null = null;
  const partnerPos = { x: 0, z: 7.3 };
  let partnerJoined = false;

  const player = {
    x: 0,
    z: 6.5,
    y: 0,
    vy: 0,
    facing: "down" as Facing,
    walking: false,
    running: false,
    jumping: false,
    dancing: false,
    danceUntil: 0,
    enabled: false,
  };

  const spawnPartner = () => {
    if (partnerJoined) return;
    partnerJoined = true;
    partner = createOverworldHero("boy");
    partnerPos.x = player.x - 0.85;
    partnerPos.z = player.z + 0.55;
    partner.group.position.set(partnerPos.x, 0, partnerPos.z);
    scene.add(partner.group);
  };

  const keys = new Set<string>();
  const walkTarget = new THREE.Vector3();
  let hasWalkTarget = false;
  let foundCount = 0;
  let completed = false;
  let hoveringId: string | null = null;
  let walkKind: "letter" | "quote" | null = null;
  let walkId: string | null = null;

  const camPos = new THREE.Vector3();
  const camLook = new THREE.Vector3();
  const wish = new THREE.Vector3();

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const BOUND = 20;
  const WALK_SPEED = 3.2;
  const RUN_SPEED = 5.4;

  // Pokémon-style overworld camera: high and tilted down
  const syncCamera = () => {
    if (camMode === "sky") {
      const desired = new THREE.Vector3(0, 9.2, 5.2);
      const look = new THREE.Vector3(0, 14, -8);
      const blend = reducedMotion ? 1 : 0.055;
      camPos.lerp(desired, blend);
      camLook.lerp(look, blend);
      camera.position.copy(camPos);
      camera.lookAt(camLook);
      if (performance.now() > skyCamUntil) camMode = "follow";
      return;
    }
    const desired = new THREE.Vector3(player.x, 11.5, player.z + 10.5);
    camPos.lerp(desired, 0.12);
    camLook.set(player.x, 0.4, player.z);
    camera.position.copy(camPos);
    camera.lookAt(camLook);
  };
  camPos.set(player.x, 11.5, player.z + 10.5);
  syncCamera();

  hero.group.position.set(player.x, 0, player.z);

  const markLetterFoundVisual = (marker: Marker) => {
    marker.group.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as
        | THREE.MeshStandardMaterial
        | THREE.MeshBasicMaterial;
      if ("emissiveIntensity" in mat) {
        mat.emissiveIntensity = Math.min(mat.emissiveIntensity, 0.12);
      }
      if ("opacity" in mat && mat.transparent) {
        mat.opacity = Math.min(mat.opacity, 0.12);
      }
    });
  };

  const setBreadcrumbGlow = (marker: Marker, active: boolean) => {
    marker.group.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as
        | THREE.MeshStandardMaterial
        | THREE.MeshBasicMaterial;
      if ("emissiveIntensity" in mat && mat.emissiveIntensity > 0) {
        mat.emissiveIntensity = active ? 0.85 : marker.found ? 0.12 : 0.35;
      }
      if ("opacity" in mat && mat.transparent) {
        mat.opacity = active ? 0.42 : marker.found ? 0.12 : 0.22;
      }
    });
    marker.group.scale.setScalar(active ? 1.18 : 1);
  };

  const discover = (marker: Marker, forceShow = false) => {
    if (marker.found && !forceShow) return;
    if (!marker.found) {
      marker.found = true;
      foundCount += 1;
      markLetterFoundVisual(marker);
    }
    if (!silentRestore) {
      callbacks.onDiscover(marker.data, foundCount, discoveries.length);
    }
    if (!completed && foundCount >= discoveries.length) {
      completed = true;
      if (!silentRestore) callbacks.onComplete();
    }
  };

  let lastQuoteAt = 0;
  let lastQuoteId: string | null = null;
  let faithCoins = 0;

  const revealQuote = (qm: QuoteMarker, force = false) => {
    const now = performance.now();
    if (!force && lastQuoteId === qm.data.id && now - lastQuoteAt < 2500) return;
    lastQuoteId = qm.data.id;
    lastQuoteAt = now;

    const isNew = !qm.collected;
    if (isNew) {
      qm.collected = true;
      faithCoins += 1;
      addConstellationStar(faithCoins - 1);
    }
    if (!silentRestore) {
      callbacks.onQuote(qm.data, {
        isNew,
        faithCoins,
        totalQuotes: poetQuotes.length,
      });
    }
  };

  const setWalkTo = (
    x: number,
    z: number,
    kind: "letter" | "quote" | null = null,
    id: string | null = null,
  ) => {
    walkTarget.set(
      THREE.MathUtils.clamp(x, -BOUND, BOUND),
      0,
      THREE.MathUtils.clamp(z, -BOUND, BOUND),
    );
    hasWalkTarget = true;
    walkKind = kind;
    walkId = id;
  };

  const tryRevealNear = () => {
    for (const marker of markers) {
      if (marker.found) continue;
      const mx = marker.group.position.x - player.x;
      const mz = marker.group.position.z - player.z;
      if (Math.hypot(mx, mz) < 1.7) {
        discover(marker);
        return;
      }
    }
    for (const qm of quoteMarkers) {
      const mx = qm.group.position.x - player.x;
      const mz = qm.group.position.z - player.z;
      const reach = qm.data.kind === "sakura" ? 2.3 : 1.65;
      if (Math.hypot(mx, mz) < reach) {
        revealQuote(qm);
        return;
      }
    }
  };

  const pickAt = (clientX: number, clientY: number) => {
    pointer.x = (clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((clientY / window.innerHeight) * 2 - 1);
    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObjects(interactables, false);
    if (hits.length > 0) {
      const hit = hits[0].object;
      const id = hit.userData.id as string | undefined;
      const kind = hit.userData.kind as "letter" | "quote" | undefined;
      if (id && kind === "letter") {
        const marker = markerById.get(id);
        if (marker) {
          setWalkTo(
            marker.group.position.x,
            marker.group.position.z,
            "letter",
            id,
          );
          const dx = marker.group.position.x - player.x;
          const dz = marker.group.position.z - player.z;
          if (Math.hypot(dx, dz) < 2.2) {
            hasWalkTarget = false;
            discover(marker, true);
          }
          return;
        }
      }
      if (id && kind === "quote") {
        const qm = quoteById.get(id);
        if (qm) {
          setWalkTo(qm.group.position.x, qm.group.position.z, "quote", id);
          const reach = qm.data.kind === "sakura" ? 2.8 : 2.2;
          const dx = qm.group.position.x - player.x;
          const dz = qm.group.position.z - player.z;
          if (Math.hypot(dx, dz) < reach) {
            hasWalkTarget = false;
            revealQuote(qm, true);
          }
          return;
        }
      }
    }

    const groundHits = raycaster.intersectObject(ground);
    if (groundHits.length > 0) {
      setWalkTo(groundHits[0].point.x, groundHits[0].point.z);
    }
  };

  const resolveHoverTitle = (id: string | null, kind: string | null) => {
    if (!id || !kind) return null;
    if (kind === "letter") return markerById.get(id)?.data.title ?? null;
    if (kind === "quote") {
      const q = quoteById.get(id)?.data;
      return q ? `${q.poet}` : null;
    }
    return null;
  };

  const updateHover = (clientX: number, clientY: number) => {
    if (!player.enabled) return;
    pointer.x = (clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((clientY / window.innerHeight) * 2 - 1);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(interactables, false);
    const obj = hits[0]?.object;
    const id = (obj?.userData.id as string | undefined) ?? null;
    const kind = (obj?.userData.kind as string | undefined) ?? null;
    const key = id ? `${kind}:${id}` : null;
    if (key !== hoveringId) {
      hoveringId = key;
      callbacks.onHoverChange(resolveHoverTitle(id, kind));
      canvas.style.cursor = id ? "pointer" : "default";
    }
  };

  const isTypingTarget = () => {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName;
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      (el as HTMLElement).isContentEditable ||
      Boolean(el.closest(".letterbox"))
    );
  };

  const onPointerDown = (e: PointerEvent) => {
    if (!player.enabled) return;
    if ((e.target as HTMLElement | null)?.closest?.(
      ".letterbox, .note, .finale, .dpad, .mute, .atmos, .journal, .song-panel, .sound-dock",
    ))
      return;
    pickAt(e.clientX, e.clientY);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!player.enabled) return;
    updateHover(e.clientX, e.clientY);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (!player.enabled || isTypingTarget()) return;
    keys.add(e.code);
    if (
      [
        "KeyW",
        "KeyA",
        "KeyS",
        "KeyD",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Space",
        "ShiftLeft",
        "ShiftRight",
        "KeyE",
      ].includes(e.code)
    ) {
      hasWalkTarget = false;
      e.preventDefault();
    }
    if (e.code === "Space" && !player.jumping) {
      player.jumping = true;
      player.vy = 5.2;
      player.dancing = false;
    }
    if (e.code === "KeyE") {
      player.dancing = true;
      player.danceUntil = performance.now() + 2200;
      hasWalkTarget = false;
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    if (isTypingTarget()) return;
    keys.delete(e.code);
  };

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("resize", onResize);

  let raf = 0;
  const start = performance.now();
  let last = start;

  const animate = (now: number) => {
    raf = requestAnimationFrame(animate);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = (now - start) / 1000;
    const drift = reducedMotion ? 0 : 1;

    player.walking = false;
    player.running = false;

    if (player.enabled) {
      if (player.dancing && performance.now() > player.danceUntil) {
        player.dancing = false;
      }

      // Classic overworld axes: W north (-Z), S south (+Z), A west (-X), D east (+X)
      wish.set(0, 0, 0);
      if (!player.dancing) {
        if (keys.has("KeyW") || keys.has("ArrowUp")) wish.z -= 1;
        if (keys.has("KeyS") || keys.has("ArrowDown")) wish.z += 1;
        if (keys.has("KeyA") || keys.has("ArrowLeft")) wish.x -= 1;
        if (keys.has("KeyD") || keys.has("ArrowRight")) wish.x += 1;
      }

      const sprint =
        keys.has("ShiftLeft") || keys.has("ShiftRight") || keys.has("KeyR");
      const speed = sprint ? RUN_SPEED : WALK_SPEED;

      if (wish.lengthSq() > 0) {
        wish.normalize().multiplyScalar(speed * dt);
        player.x = THREE.MathUtils.clamp(player.x + wish.x, -BOUND, BOUND);
        player.z = THREE.MathUtils.clamp(player.z + wish.z, -BOUND, BOUND);
        player.facing = facingFromDir(wish.x, wish.z);
        player.walking = true;
        player.running = sprint;
        player.dancing = false;
      } else if (hasWalkTarget && !player.dancing) {
        const dx = walkTarget.x - player.x;
        const dz = walkTarget.z - player.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 0.15) {
          hasWalkTarget = false;
          if (walkKind === "letter" && walkId) {
            const m = markerById.get(walkId);
            if (m) discover(m, true);
          } else if (walkKind === "quote" && walkId) {
            const q = quoteById.get(walkId);
            if (q) revealQuote(q, true);
          } else {
            tryRevealNear();
          }
          walkKind = null;
          walkId = null;
        } else {
          const step = Math.min(dist, WALK_SPEED * dt);
          player.x += (dx / dist) * step;
          player.z += (dz / dist) * step;
          player.facing = facingFromDir(dx, dz);
          player.walking = true;
        }
      }

      // Jump physics
      if (player.jumping) {
        player.vy -= 14 * dt;
        player.y += player.vy * dt;
        if (player.y <= 0) {
          player.y = 0;
          player.vy = 0;
          player.jumping = false;
        }
      }

      tryRevealNear();
    }

    let action: HeroAction = "idle";
    if (player.dancing) action = "dance";
    else if (player.jumping) action = "jump";
    else if (player.running) action = "run";
    else if (player.walking) action = "walk";

    hero.group.position.set(player.x, 0, player.z);
    hero.setPose(player.facing, action, t, player.y);

    if (partner) {
      let ox = 0;
      let oz = 0.9;
      if (player.facing === "up") {
        ox = 0.15;
        oz = 0.95;
      } else if (player.facing === "down") {
        ox = -0.15;
        oz = -0.95;
      } else if (player.facing === "left") {
        ox = 0.95;
        oz = 0.1;
      } else {
        ox = -0.95;
        oz = 0.1;
      }
      const targetX = player.x + ox;
      const targetZ = player.z + oz;
      partnerPos.x += (targetX - partnerPos.x) * Math.min(1, dt * 3.2);
      partnerPos.z += (targetZ - partnerPos.z) * Math.min(1, dt * 3.2);
      const moving = Math.hypot(targetX - partnerPos.x, targetZ - partnerPos.z) > 0.08;
      const pFacing = moving
        ? facingFromDir(targetX - partnerPos.x, targetZ - partnerPos.z)
        : player.facing;
      let pAction: HeroAction = "idle";
      if (player.dancing) pAction = "dance";
      else if (player.jumping) pAction = "jump";
      else if (player.running && moving) pAction = "run";
      else if (moving || player.walking) pAction = "walk";
      partner.group.position.set(partnerPos.x, 0, partnerPos.z);
      partner.setPose(pFacing, pAction, t, player.jumping ? player.y * 0.85 : 0);
    }

    // Petal trail
    if ((player.walking || player.running) && !reducedMotion) {
      trailAcc += dt;
      if (trailAcc > 0.12) {
        trailAcc = 0;
        const bit: TrailBit = {
          mesh: new THREE.Mesh(trailGeo, trailMat.clone()),
          life: 1,
        };
        bit.mesh.rotation.x = -Math.PI / 2;
        bit.mesh.position.set(
          player.x + (Math.random() - 0.5) * 0.2,
          0.04,
          player.z + (Math.random() - 0.5) * 0.2,
        );
        scene.add(bit.mesh);
        trail.push(bit);
      }
    }
    for (let i = trail.length - 1; i >= 0; i--) {
      const bit = trail[i];
      bit.life -= dt * 0.85;
      bit.mesh.position.y += dt * 0.15;
      (bit.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(
        0,
        bit.life * 0.7,
      );
      bit.mesh.scale.setScalar(0.7 + (1 - bit.life) * 0.8);
      if (bit.life <= 0) {
        scene.remove(bit.mesh);
        (bit.mesh.material as THREE.Material).dispose();
        trail.splice(i, 1);
      }
    }

    // Grow new constellation stars
    for (const star of stars) {
      if (!star) continue;
      if (star.scale.x < 1) {
        star.scale.setScalar(Math.min(1, star.scale.x + dt * 2.2));
      }
      star.position.y += Math.sin(t * 2 + star.position.x) * 0.002 * drift;
    }

    for (const marker of markers) {
      const bob = Math.sin(t * 1.5 + marker.group.position.x) * 0.04 * drift;
      marker.group.position.y = bob;
    }

    // Soft breadcrumb toward nearest unread letter
    let nearest: Marker | null = null;
    let nearestDist = Infinity;
    for (const marker of markers) {
      if (marker.found) continue;
      const d = Math.hypot(
        marker.group.position.x - player.x,
        marker.group.position.z - player.z,
      );
      if (d < nearestDist) {
        nearestDist = d;
        nearest = marker;
      }
    }
    const nextBreadcrumb = nearest?.data.id ?? null;
    if (nextBreadcrumb !== breadcrumbId) {
      if (breadcrumbId) {
        const prev = markerById.get(breadcrumbId);
        if (prev && !prev.found) setBreadcrumbGlow(prev, false);
      }
      breadcrumbId = nextBreadcrumb;
      if (nearest) setBreadcrumbGlow(nearest, true);
    }

    for (const qm of quoteMarkers) {
      if (qm.data.kind === "flower") {
        qm.group.position.y =
          Math.sin(t * 1.4 + qm.group.position.z) * 0.05 * drift;
      }
    }

    moon.position.y = 10 + Math.sin(t * 0.2) * 0.15 * drift;
    if (moonPulse) {
      moonMat.emissiveIntensity = 0.75 + Math.sin(t * 1.6) * 0.35 * drift;
      moonHaloMat.opacity = 0.2 + Math.sin(t * 1.2) * 0.12 * drift;
    }
    if (skySoft) {
      constellation.rotation.y = Math.sin(t * 0.15) * 0.08 * drift;
    }

    const pos = petalGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < PETAL_COUNT; i++) {
      let y = pos.getY(i) + (0.35 + (i % 5) * 0.05) * dt * drift;
      if (y > 9) y = 0.2;
      const x =
        petalPositions[i * 3] +
        Math.sin(t * 0.35 + petalPhase[i]) * 0.02 * drift;
      pos.setXYZ(i, x, y, petalPositions[i * 3 + 2]);
    }
    pos.needsUpdate = true;

    const fpos = fireGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      const phase = firePhase[i];
      const speed = fireSpeed[i];
      const x =
        firePos[i * 3] + Math.sin(t * speed + phase) * 0.35 * drift;
      const y =
        firePos[i * 3 + 1] +
        Math.sin(t * speed * 1.3 + phase) * 0.25 * drift;
      const z =
        firePos[i * 3 + 2] + Math.cos(t * speed * 0.8 + phase) * 0.35 * drift;
      fpos.setXYZ(i, x, y, z);
    }
    fpos.needsUpdate = true;
    fireMat.opacity =
      (0.35 + (1 - dayBlend) * 0.5) *
      (0.55 + Math.sin(t * 3.2) * 0.35 * drift);

    syncCamera();
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(animate);

  return {
    enable() {
      player.enabled = true;
    },
    setHeld(code: string, down: boolean) {
      if (down) {
        keys.add(code);
        hasWalkTarget = false;
      } else {
        keys.delete(code);
      }
    },
    setHour(hour: number) {
      // Map hour to dayBlend: peak day ~13, night ~0/24
      const x = (hour % 24) / 24;
      // cosine bump: 1 at noon-ish, 0 at midnight
      dayBlend = Math.max(0, Math.min(1, 0.5 + 0.5 * Math.cos((x - 0.5) * Math.PI * 2)));
      // Prefer warmer dusk around 17–20
      if (hour >= 17 && hour < 20) dayBlend = 0.35 + (20 - hour) * 0.08;
      if (hour >= 20 || hour < 5) dayBlend = Math.min(dayBlend, 0.22);
      applyDayNight();
      if (skySoft && scene.fog instanceof THREE.FogExp2) {
        scene.fog.density = 0.014;
      }
    },
    getProgress() {
      return {
        letters: markers.filter((m) => m.found).map((m) => m.data.id),
        quotes: quoteMarkers.filter((q) => q.collected).map((q) => q.data.id),
        foundCount,
        faithCoins,
        completed,
        constellationDone,
        unlocked: [...unlocked],
      };
    },
    restoreProgress(save) {
      silentRestore = true;
      for (const id of save.letters) {
        const marker = markerById.get(id);
        if (!marker || marker.found) continue;
        marker.found = true;
        foundCount += 1;
        markLetterFoundVisual(marker);
      }
      if (foundCount >= discoveries.length) completed = true;
      for (const id of save.quotes) {
        const qm = quoteById.get(id);
        if (!qm || qm.collected) continue;
        qm.collected = true;
        faithCoins += 1;
        addConstellationStar(faithCoins - 1);
      }
      for (const tier of save.unlocked ?? []) applyQuietMoment(tier);
      if (constellationDone) spawnPartner();
      silentRestore = false;
    },
    reopenLetter(id: string) {
      const marker = markerById.get(id);
      if (!marker?.found) return false;
      discover(marker, true);
      return true;
    },
    reopenQuote(id: string) {
      const qm = quoteById.get(id);
      if (!qm?.collected) return false;
      revealQuote(qm, true);
      return true;
    },
    unlockQuietMoment(tier: QuietTier) {
      if (unlocked.has(tier)) return false;
      if (tier === "path" && faithCoins < 3) return false;
      if (tier === "moon" && faithCoins < 6) return false;
      if (tier === "sky" && faithCoins < poetQuotes.length) return false;
      applyQuietMoment(tier);
      return true;
    },
    lookAtConstellation(ms = 4800) {
      if (!constellationDone) return;
      camMode = "sky";
      skyCamUntil = performance.now() + (reducedMotion ? 1200 : ms);
    },
    spawnPartner() {
      spawnPartner();
    },
    hasPartner() {
      return partnerJoined;
    },
    destroy() {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    },
  };
}
