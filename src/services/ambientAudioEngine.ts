/**
 * Ambient Atmospheric Audio Engine
 * Procedural Web Audio API soundscape generator for Kannauj Heritage & Atelier Ambiance.
 * Requires zero external audio files - synthesized purely in browser memory with zero network latency.
 */

export type SoundscapeType = 'none' | 'monsoon_deg' | 'temple_breeze' | 'amber_hearth';

interface SoundscapeMeta {
  id: SoundscapeType;
  title: string;
  description: string;
  atmosphereKey: string;
  icon: string;
}

export const SOUNDSCAPE_PRESETS: SoundscapeMeta[] = [
  {
    id: 'none',
    title: 'Silent Atelier',
    description: 'Serene silence for focused olfactory analysis.',
    atmosphereKey: 'default',
    icon: '🔇'
  },
  {
    id: 'monsoon_deg',
    title: 'Monsoon on Kannauj Degs',
    description: 'Gentle raindrops falling on antique copper distillation vessels and wet alluvial earth.',
    atmosphereKey: 'earthy',
    icon: '🌧️'
  },
  {
    id: 'temple_breeze',
    title: 'Evening Temple Breeze',
    description: 'Gentle night wind rustling through sandalwood groves and sacred night-blooming jasmine.',
    atmosphereKey: 'khus',
    icon: '🍃'
  },
  {
    id: 'amber_hearth',
    title: 'Atelier Amber Hearth',
    description: 'Distant crackling charcoal embers warming copper hydro-distillation cauldrons.',
    atmosphereKey: 'oud',
    icon: '🔥'
  }
];

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeSoundscape: SoundscapeType = 'none';
  private currentVolume: number = 0.4;
  private isMuted: boolean = false;
  private activeNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  private rainInterval: number | null = null;
  private crackleInterval: number | null = null;
  private stopTimer: ReturnType<typeof setTimeout> | null = null;
  private startTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    try {
      const savedVol = localStorage.getItem('olfactive_ambient_volume');
      if (savedVol !== null) {
        this.currentVolume = Math.max(0, Math.min(1, parseFloat(savedVol)));
      }
    } catch {
      // Ignore storage errors
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (this.ctx) {
          if (document.hidden && this.ctx.state === 'running') {
            this.ctx.suspend().catch(() => {});
          } else if (!document.hidden && this.ctx.state === 'suspended' && this.activeSoundscape !== 'none') {
            this.ctx.resume().catch(() => {});
          }
        }
      });
    }
  }

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public subscribe(cb: () => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public getActiveSoundscape(): SoundscapeType {
    return this.activeSoundscape;
  }

  public isPlaying(): boolean {
    return this.activeSoundscape !== 'none' && !this.isMuted;
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('olfactive_ambient_volume', this.currentVolume.toString());
    } catch {}

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.currentVolume, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.currentVolume, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public stopSoundscape() {
    if (this.startTimer) {
      clearTimeout(this.startTimer);
      this.startTimer = null;
    }

    if (!this.ctx || !this.masterGain) {
      this.activeSoundscape = 'none';
      this.notify();
      return;
    }

    if (this.rainInterval) {
      window.clearInterval(this.rainInterval);
      this.rainInterval = null;
    }
    if (this.crackleInterval) {
      window.clearInterval(this.crackleInterval);
      this.crackleInterval = null;
    }

    // Smooth fade out over 250ms
    const now = this.ctx.currentTime;
    this.masterGain.gain.setTargetAtTime(0, now, 0.08);

    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
    }

    this.stopTimer = setTimeout(() => {
      this.stopTimer = null;
      this.activeNodes.forEach((n) => {
        try {
          n.stop?.();
          n.disconnect?.();
        } catch {}
      });
      this.activeNodes = [];
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume, this.ctx.currentTime);
      }
      this.activeSoundscape = 'none';
      this.notify();
    }, 280);
  }

  public startSoundscape(type: SoundscapeType) {
    if (type === 'none') {
      this.stopSoundscape();
      return;
    }

    if (this.activeSoundscape === type && this.isPlaying()) {
      return;
    }

    const ctx = this.initContext();
    this.stopSoundscape();

    if (this.startTimer) {
      clearTimeout(this.startTimer);
    }

    this.startTimer = setTimeout(() => {
      this.startTimer = null;
      this.activeSoundscape = type;
      this.isMuted = false;
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
        this.masterGain.gain.setTargetAtTime(this.currentVolume, ctx.currentTime, 0.3);
      }

      if (type === 'monsoon_deg') {
        this.synthesizeMonsoonDeg(ctx);
      } else if (type === 'temple_breeze') {
        this.synthesizeTempleBreeze(ctx);
      } else if (type === 'amber_hearth') {
        this.synthesizeAmberHearth(ctx);
      }

      this.notify();
    }, 300);
  }

  // ================= PROCEDURAL SYNTHESIZERS =================

  /**
   * Generates continuous soft monsoon rainfall with resonant copper droplet pings.
   */
  private synthesizeMonsoonDeg(ctx: AudioContext) {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate filtered pink/brown noise
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Atmospheric Rain Filter (muffled continuous rainfall)
    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(650, ctx.currentTime);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.55, ctx.currentTime);

    whiteNoise.connect(rainFilter);
    rainFilter.connect(rainGain);
    if (this.masterGain) rainGain.connect(this.masterGain);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, rainGain);

    // Sporadic resonant metallic droplets (rain on copper deg pot)
    this.rainInterval = window.setInterval(() => {
      if (this.activeSoundscape !== 'monsoon_deg' || this.isMuted) return;

      const dropOsc = ctx.createOscillator();
      const dropGain = ctx.createGain();
      const dropFilter = ctx.createBiquadFilter();

      // Tuned copper resonance between 800Hz and 1750Hz
      const freq = 800 + Math.random() * 950;
      dropOsc.type = 'sine';
      dropOsc.frequency.setValueAtTime(freq, ctx.currentTime);
      dropOsc.frequency.exponentialRampToValueAtTime(freq * 0.7, ctx.currentTime + 0.12);

      dropFilter.type = 'bandpass';
      dropFilter.frequency.setValueAtTime(freq, ctx.currentTime);
      dropFilter.Q.setValueAtTime(14, ctx.currentTime); // high metallic ring

      const dropVol = 0.04 + Math.random() * 0.06;
      dropGain.gain.setValueAtTime(0, ctx.currentTime);
      dropGain.gain.linearRampToValueAtTime(dropVol, ctx.currentTime + 0.015);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18 + Math.random() * 0.12);

      dropOsc.connect(dropFilter);
      dropFilter.connect(dropGain);
      if (this.masterGain) dropGain.connect(this.masterGain);

      dropOsc.start();
      dropOsc.stop(ctx.currentTime + 0.35);
    }, 180 + Math.random() * 220);
  }

  /**
   * Generates a slow, undulating sacred breeze with soft whispering resonance.
   */
  private synthesizeTempleBreeze(ctx: AudioContext) {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink noise
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.25;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Dual resonant bandpass filter for whispering wind
    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(320, ctx.currentTime);
    filter1.Q.setValueAtTime(2.5, ctx.currentTime);

    // Slow LFO for organic wind gusts
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 sec wave
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(160, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter1.frequency);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.45, ctx.currentTime);

    noiseSource.connect(filter1);
    filter1.connect(windGain);
    if (this.masterGain) windGain.connect(this.masterGain);

    noiseSource.start();
    lfo.start();

    this.activeNodes.push(noiseSource, lfo, windGain);
  }

  /**
   * Generates a deep warm charcoal hearth hum with gentle sporadic crackles.
   */
  private synthesizeAmberHearth(ctx: AudioContext) {
    // Warm low frequency hum
    const humOsc = ctx.createOscillator();
    humOsc.type = 'triangle';
    humOsc.frequency.setValueAtTime(54, ctx.currentTime);

    const humGain = ctx.createGain();
    humGain.gain.setValueAtTime(0.12, ctx.currentTime);

    humOsc.connect(humGain);
    if (this.masterGain) humGain.connect(this.masterGain);
    humOsc.start();

    // Gentle low-pass air turbulence
    const bufferSize = ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(220, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, ctx.currentTime);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    if (this.masterGain) noiseGain.connect(this.masterGain);
    noise.start();

    this.activeNodes.push(humOsc, noise, noiseGain);

    // Sporadic tiny embers crackles
    this.crackleInterval = window.setInterval(() => {
      if (this.activeSoundscape !== 'amber_hearth' || this.isMuted) return;

      const popBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.02), ctx.sampleRate);
      const popData = popBuffer.getChannelData(0);
      for (let i = 0; i < popData.length; i++) {
        popData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (popData.length * 0.3));
      }

      const popSource = ctx.createBufferSource();
      popSource.buffer = popBuffer;

      const popFilter = ctx.createBiquadFilter();
      popFilter.type = 'bandpass';
      popFilter.frequency.setValueAtTime(1200 + Math.random() * 1800, ctx.currentTime);
      popFilter.Q.setValueAtTime(3, ctx.currentTime);

      const popGain = ctx.createGain();
      popGain.gain.setValueAtTime(0.04 + Math.random() * 0.05, ctx.currentTime);

      popSource.connect(popFilter);
      popFilter.connect(popGain);
      if (this.masterGain) popGain.connect(this.masterGain);

      popSource.start();
    }, 250 + Math.random() * 400);
  }

  /**
   * Plays a delicate procedural alchemical chord / chime for surprises, discoveries, and rituals.
   */
  public playSpatialChord(frequencies: number[] = [528, 660, 792], volume: number = 0.12) {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const baseGain = ctx.createGain();
      baseGain.gain.setValueAtTime(0, now);
      baseGain.gain.linearRampToValueAtTime(Math.min(0.2, volume * this.currentVolume), now + 0.04);
      baseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
      baseGain.connect(ctx.destination);

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(baseGain);
        osc.start(now);
        osc.stop(now + 1.8);
      });

      setTimeout(() => {
        try {
          baseGain.disconnect();
        } catch {}
      }, 2000);
    } catch {
      // Audio context restricted or unavailable
    }
  }
}

export const ambientAudioEngine = new AmbientAudioEngine();
