/** Soft procedural garden ambience (wind + distant chirps). No external files. */

export type AmbientApi = {
  start: () => Promise<void>;
  setMuted: (muted: boolean) => void;
  isMuted: () => boolean;
  destroy: () => void;
};

export function createAmbient(): AmbientApi {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let muted = false;
  let chirpTimer = 0;
  let started = false;

  const ensure = async () => {
    if (ctx) return ctx;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.045;
    master.connect(ctx.destination);

    // Soft wind via filtered noise
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    filter.Q.value = 0.7;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.55;
    noise.connect(filter);
    filter.connect(windGain);
    windGain.connect(master);
    noise.start();

    // Slow wind swell
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.2;
    lfo.connect(lfoGain);
    lfoGain.connect(windGain.gain);
    lfo.start();

    return ctx;
  };

  const chirp = () => {
    if (!ctx || !master || muted) return;
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    const base = 1800 + Math.random() * 900;
    osc.frequency.setValueAtTime(base, t0);
    osc.frequency.exponentialRampToValueAtTime(base * 1.35, t0 + 0.08);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.03, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + 0.16);
  };

  const scheduleChirps = () => {
    chirp();
    chirpTimer = window.setTimeout(
      scheduleChirps,
      2800 + Math.random() * 5200,
    );
  };

  return {
    async start() {
      const audio = await ensure();
      if (audio.state === "suspended") await audio.resume();
      if (!started) {
        started = true;
        scheduleChirps();
      }
      if (master) master.gain.value = muted ? 0 : 0.045;
    },
    setMuted(next: boolean) {
      muted = next;
      if (master) master.gain.value = muted ? 0 : 0.045;
    },
    isMuted: () => muted,
    destroy() {
      window.clearTimeout(chirpTimer);
      void ctx?.close();
      ctx = null;
      master = null;
    },
  };
}
