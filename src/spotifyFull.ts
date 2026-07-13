/**
 * Full-track Spotify playback via Web Playback SDK + PKCE.
 * Requires Spotify Premium on the listener account and a Spotify app Client ID
 * (Dashboard → create app → Redirect URI must match this page).
 */

const CLIENT_KEY = "if-you-knew-me-spotify-client-id";
const VERIFIER_KEY = "if-you-knew-me-spotify-verifier";
const TOKEN_KEY = "if-you-knew-me-spotify-token";

type TokenBlob = {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
};

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    Spotify?: {
      Player: new (opts: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
      }) => SpotifyPlayer;
    };
  }
}

type SpotifyPlayer = {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, cb: (state: any) => void) => void;
  activateElement: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  getCurrentState: () => Promise<{ paused: boolean } | null>;
};

let player: SpotifyPlayer | null = null;
let deviceId: string | null = null;
let sdkReady: Promise<void> | null = null;

export function getSpotifyClientId(): string {
  const env = (import.meta.env.VITE_SPOTIFY_CLIENT_ID as string | undefined)?.trim();
  if (env) return env;
  try {
    return localStorage.getItem(CLIENT_KEY)?.trim() || "";
  } catch {
    return "";
  }
}

export function setSpotifyClientId(id: string) {
  localStorage.setItem(CLIENT_KEY, id.trim());
}

function redirectUri(): string {
  const base = `${window.location.origin}${import.meta.env.BASE_URL}`;
  return base.endsWith("/") ? base : `${base}/`;
}

function loadToken(): TokenBlob | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TokenBlob;
  } catch {
    return null;
  }
}

function saveToken(token: TokenBlob) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const data = new TextEncoder().encode(plain);
  return crypto.subtle.digest("SHA-256", data);
}

function base64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let str = "";
  bytes.forEach((b) => {
    str += String.fromCharCode(b);
  });
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomString(len = 64): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => chars[n % chars.length]).join("");
}

export function isSpotifyConnected(): boolean {
  const t = loadToken();
  return Boolean(t?.access_token);
}

export async function beginSpotifyLogin(clientId?: string): Promise<void> {
  const id = (clientId || getSpotifyClientId()).trim();
  if (!id) throw new Error("Missing Spotify Client ID");
  setSpotifyClientId(id);

  const verifier = randomString(64);
  const challenge = base64Url(await sha256(verifier));
  localStorage.setItem(VERIFIER_KEY, verifier);

  const params = new URLSearchParams({
    client_id: id,
    response_type: "code",
    redirect_uri: redirectUri(),
    scope: "streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state",
    code_challenge_method: "S256",
    code_challenge: challenge,
    state: "gulbahar-spotify",
  });
  window.location.assign(`https://accounts.spotify.com/authorize?${params}`);
}

async function exchangeCode(code: string, clientId: string): Promise<TokenBlob> {
  const verifier = localStorage.getItem(VERIFIER_KEY) || "";
  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri(),
    code_verifier: verifier,
  });
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error("Spotify token exchange failed");
  const data = (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };
  const token: TokenBlob = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000 - 15000,
  };
  saveToken(token);
  localStorage.removeItem(VERIFIER_KEY);
  return token;
}

async function refreshAccessToken(clientId: string): Promise<TokenBlob | null> {
  const prev = loadToken();
  if (!prev?.refresh_token) return null;
  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "refresh_token",
    refresh_token: prev.refresh_token,
  });
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    clearToken();
    return null;
  }
  const data = (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };
  const token: TokenBlob = {
    access_token: data.access_token,
    refresh_token: data.refresh_token || prev.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000 - 15000,
  };
  saveToken(token);
  return token;
}

export async function ensureSpotifyToken(): Promise<string | null> {
  const clientId = getSpotifyClientId();
  if (!clientId) return null;

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (code && params.get("state") === "gulbahar-spotify") {
    await exchangeCode(code, clientId);
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    window.history.replaceState({}, "", url.toString());
  }

  let token = loadToken();
  if (!token) return null;
  if (Date.now() > token.expires_at) {
    token = (await refreshAccessToken(clientId)) || null;
  }
  return token?.access_token ?? null;
}

function loadSdk(): Promise<void> {
  if (window.Spotify?.Player) return Promise.resolve();
  if (sdkReady) return sdkReady;
  sdkReady = new Promise((resolve, reject) => {
    const prior = window.onSpotifyWebPlaybackSDKReady;
    window.onSpotifyWebPlaybackSDKReady = () => {
      prior?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://sdk.scdn.co/spotify-player.js";
    tag.async = true;
    tag.onerror = () => reject(new Error("Spotify SDK failed to load"));
    document.head.appendChild(tag);
    window.setTimeout(() => reject(new Error("Spotify SDK timeout")), 15000);
  });
  return sdkReady;
}

export async function ensureSpotifyPlayer(): Promise<boolean> {
  const access = await ensureSpotifyToken();
  if (!access) return false;
  await loadSdk();
  if (player && deviceId) return true;

  player = new window.Spotify!.Player({
    name: "গুলবাহার Garden",
    getOAuthToken: (cb) => {
      void ensureSpotifyToken().then((t) => cb(t || access));
    },
    volume: 0.75,
  });

  player.addListener("ready", (state: { device_id: string }) => {
    deviceId = state.device_id;
  });
  player.addListener("not_ready", () => {
    deviceId = null;
  });
  player.addListener("initialization_error", (e: { message: string }) => {
    console.warn("Spotify init error", e.message);
  });
  player.addListener("authentication_error", (e: { message: string }) => {
    console.warn("Spotify auth error", e.message);
    clearToken();
  });
  player.addListener("account_error", (e: { message: string }) => {
    console.warn("Spotify account error (Premium required)", e.message);
  });

  const ok = await player.connect();
  // wait briefly for device id
  for (let i = 0; i < 20 && !deviceId; i++) {
    await new Promise((r) => setTimeout(r, 150));
  }
  try {
    await player.activateElement();
  } catch {
    /* ignore */
  }
  return ok && Boolean(deviceId);
}

export async function playFullSpotifyTrack(trackId: string): Promise<void> {
  const access = await ensureSpotifyToken();
  if (!access) throw new Error("Connect Spotify first");
  const ready = await ensureSpotifyPlayer();
  if (!ready || !deviceId) throw new Error("Spotify player not ready (Premium?)");

  const res = await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${encodeURIComponent(deviceId)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: [`spotify:track:${trackId}`],
      }),
    },
  );
  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(text || "Spotify play failed");
  }
}

export async function pauseSpotify(): Promise<void> {
  try {
    await player?.pause();
  } catch {
    /* ignore */
  }
}

export function disconnectSpotify(): void {
  try {
    player?.disconnect();
  } catch {
    /* ignore */
  }
  player = null;
  deviceId = null;
  clearToken();
}
