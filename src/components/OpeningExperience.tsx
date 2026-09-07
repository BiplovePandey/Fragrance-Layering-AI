import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Droplets, ArrowRight, X } from 'lucide-react';

interface OpeningExperienceProps {
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  targetAlpha: number;
  type: 'ember' | 'rose_petal' | 'sandalwood' | 'saffron' | 'jasmine' | 'mitti_grain' | 'rain_drop' | 'oud_smoke' | 'cool_mist';
  rotation: number;
  rotSpeed: number;
  size: number;
  seed: number;
}

export const OpeningExperience: React.FC<OpeningExperienceProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [activeMessage, setActiveMessage] = useState<string>('Discovering fragrance notes...');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // Time milestones in seconds
  // Phase 0: 0 -> 1.1s (Glowing particle, "A fragrance is more than a scent...")
  // Phase 1: 1.1 -> 2.5s (Mist swirl, Indian botanicals, "It's a memory. A mood. A moment.")
  // Phase 2: 2.5 -> 4.0s (Indian + International convergence, Rose + Sandalwood + Oud, Mitti petrichor drop)
  // Phase 3: 4.0 -> 5.5s (Brand Logo, "Find your perfect layer", cycling messages)
  // Phase 4: > 5.5s (Dissolve & Enter)

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();
    const duration = 5400; // 5.4 seconds total sequence

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize luxury olfactory particles
    const particles: Particle[] = [];
    const PARTICLE_COUNT = 95;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const typeRand = Math.random();
      let type: Particle['type'] = 'ember';
      let color = '#D6AA62'; // soft gold
      let size = 2 + Math.random() * 3;

      if (typeRand < 0.20) {
        type = 'rose_petal';
        color = '#C86D74'; // antique Damascena rose
        size = 3 + Math.random() * 4;
      } else if (typeRand < 0.38) {
        type = 'sandalwood';
        color = '#C58B45'; // warm amber Mysore wood
        size = 2.5 + Math.random() * 3;
      } else if (typeRand < 0.50) {
        type = 'saffron';
        color = '#E06D34'; // Kashmiri zafran
        size = 2 + Math.random() * 2.5;
      } else if (typeRand < 0.65) {
        type = 'jasmine';
        color = '#F5E9D0'; // night-blooming mogra cream
        size = 3 + Math.random() * 3;
      } else if (typeRand < 0.80) {
        type = 'mitti_grain';
        color = '#8C6239'; // Kannauj parched clay
        size = 2 + Math.random() * 3;
      } else if (typeRand < 0.90) {
        type = 'oud_smoke';
        color = '#382218'; // dark Assam agarwood
        size = 4 + Math.random() * 6;
      } else {
        type = 'cool_mist';
        color = '#E2E8F0'; // international cool crystalline
        size = 3 + Math.random() * 4;
      }

      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 40,
        y: height / 2 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: size,
        color,
        alpha: 0,
        targetAlpha: 0.3 + Math.random() * 0.5,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        size,
        seed: Math.random() * 1000
      });
    }

    // Raindrop simulation for the mitti / petrichor moment
    const rainDrops: { x: number; y: number; vy: number; targetY: number; splashed: boolean }[] = [];

    const render = (currentTime: number) => {
      const elapsedMs = currentTime - startTime;
      const t = elapsedMs / 1000; // in seconds
      setElapsedTime(t);

      const progress = Math.min(100, Math.round((elapsedMs / duration) * 100));
      setProgressPercent(progress);

      // Cycle status message smoothly
      if (t < 1.2) {
        setActiveMessage('Discovering fragrance notes...');
      } else if (t < 2.5) {
        setActiveMessage('Exploring Indian perfumery & heritage...');
      } else if (t < 3.8) {
        setActiveMessage('Harmonizing cross-cultural accords...');
      } else if (t < 4.8) {
        setActiveMessage('Building your signature layer...');
      } else {
        setActiveMessage('Welcome to L\'Atelier Olfactif');
      }

      // Draw Atmospheric Background (#0D0A08 with subtle warm amber-brown radial glow)
      ctx.fillStyle = '#0D0A08';
      ctx.fillRect(0, 0, width, height);

      // Warm ambient radial glow in the center
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.65
      );
      gradient.addColorStop(0, 'rgba(197, 139, 69, 0.16)'); // amber
      gradient.addColorStop(0.35, 'rgba(36, 24, 18, 0.45)'); // deep brown
      gradient.addColorStop(1, 'rgba(13, 10, 8, 1)'); // dark ground
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Phase 0: Central glowing spark / particle
      if (t < 1.5) {
        const sparkPulse = Math.sin(t * 5) * 0.2 + 0.8;
        const sparkRadius = Math.min(t * 12, 14) * sparkPulse;

        // Outer glow
        const glowGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80 * sparkPulse);
        glowGrad.addColorStop(0, 'rgba(214, 170, 98, 0.8)');
        glowGrad.addColorStop(0.3, 'rgba(197, 139, 69, 0.4)');
        glowGrad.addColorStop(1, 'rgba(197, 139, 69, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80 * sparkPulse, 0, Math.PI * 2);
        ctx.fill();

        // Inner glowing core
        ctx.fillStyle = '#FFF8EB';
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(2, sparkRadius * 0.35), 0, Math.PI * 2);
        ctx.fill();
      }

      // Phase 2 special: Mitti petrichor water drops
      if (t >= 2.4 && t <= 3.8 && rainDrops.length < 12) {
        if (Math.random() < 0.25) {
          rainDrops.push({
            x: centerX + (Math.random() - 0.5) * 160,
            y: centerY - 140,
            vy: 4 + Math.random() * 3,
            targetY: centerY + 40 + Math.random() * 40,
            splashed: false
          });
        }
      }

      // Update and draw raindrops (geeli mitti falling into earth)
      for (let i = rainDrops.length - 1; i >= 0; i--) {
        const drop = rainDrops[i];
        drop.y += drop.vy;

        if (drop.y >= drop.targetY && !drop.splashed) {
          drop.splashed = true;
          // Spawn rising golden petrichor mist
          for (let k = 0; k < 4; k++) {
            particles.push({
              x: drop.x + (Math.random() - 0.5) * 15,
              y: drop.targetY,
              vx: (Math.random() - 0.5) * 0.6,
              vy: -0.8 - Math.random() * 0.9,
              radius: 3 + Math.random() * 3,
              color: '#D6AA62',
              alpha: 0.8,
              targetAlpha: 0.1,
              type: 'sandalwood',
              rotation: Math.random() * Math.PI,
              rotSpeed: 0.02,
              size: 3,
              seed: Math.random() * 100
            });
          }
        }

        if (!drop.splashed) {
          ctx.strokeStyle = 'rgba(214, 235, 255, 0.75)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y - 8);
          ctx.lineTo(drop.x, drop.y);
          ctx.stroke();
        } else {
          // Splashed ripple
          ctx.strokeStyle = 'rgba(214, 170, 98, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(drop.x, drop.targetY, 12, 4, 0, 0, Math.PI * 2);
          ctx.stroke();
          rainDrops.splice(i, 1);
        }
      }

      // Update and render main fragrance mist particles
      for (const p of particles) {
        // Phase logic
        if (t < 1.1) {
          // Gathering towards center
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          p.vx += dx * 0.02;
          p.vy += dy * 0.02;
          p.vx *= 0.85;
          p.vy *= 0.85;
          p.alpha = Math.min(p.targetAlpha * 0.6, p.alpha + 0.02);
        } else if (t < 2.5) {
          // Phase 1: Swirl of fragrance mist spiraling outwards
          const angle = Math.atan2(p.y - centerY, p.x - centerX) + 0.025;
          const dist = Math.hypot(p.x - centerX, p.y - centerY);
          const targetDist = dist + 0.6;
          p.x = centerX + Math.cos(angle) * targetDist + p.vx;
          p.y = centerY + Math.sin(angle) * targetDist + p.vy;
          p.alpha = Math.min(p.targetAlpha, p.alpha + 0.04);
        } else if (t < 4.0) {
          // Phase 2: Indian mist (left) meets International cool mist (right)
          if (p.type === 'cool_mist') {
            // Coming from right towards center
            p.x += (centerX - p.x) * 0.015 - 0.4;
          } else {
            // Indian warm elements coming from left towards center
            p.x += (centerX - p.x) * 0.015 + 0.4;
          }
          p.y += (centerY - p.y) * 0.01 + Math.sin(t * 3 + p.seed) * 0.5;
          p.alpha = Math.min(p.targetAlpha * 1.2, p.alpha + 0.03);
        } else {
          // Phase 3: Rotating halo around brand emblem
          const angle = Math.atan2(p.y - centerY, p.x - centerX) + 0.015;
          const orbitRadius = 140 + Math.sin(p.seed + t) * 40;
          p.x = centerX + Math.cos(angle) * orbitRadius;
          p.y = centerY + Math.sin(angle) * orbitRadius;
          p.alpha = Math.min(p.targetAlpha * 0.8, p.alpha + 0.02);
        }

        p.rotation += p.rotSpeed;

        // Render abstract botanical silhouettes & mist puffs
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;

        if (p.type === 'rose_petal') {
          // Stylized rose petal curve
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.9, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'saffron') {
          // Slender saffron zafran filament
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-p.size, -p.size * 1.5);
          ctx.quadraticCurveTo(0, 0, p.size, p.size * 1.5);
          ctx.stroke();
        } else if (p.type === 'jasmine') {
          // Delicate 4-pointed mogra starlet
          ctx.fillStyle = p.color;
          ctx.beginPath();
          for (let s = 0; s < 4; s++) {
            ctx.rotate(Math.PI / 2);
            ctx.ellipse(p.size * 0.7, 0, p.size * 0.8, p.size * 0.35, 0, 0, Math.PI * 2);
          }
          ctx.fill();
        } else {
          // Soft Gaussian mist puff / glowing particle
          const rad = Math.max(1, p.radius * (1 + Math.sin(t * 2 + p.seed) * 0.2));
          const pGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, rad * 2);
          pGrad.addColorStop(0, p.color);
          pGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(0, 0, rad * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Auto-trigger completion when time exceeds duration
      if (elapsedMs >= duration && !isFadingOut) {
        handleFinish();
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isFadingOut]);

  const handleFinish = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 600); // smooth outward fade transition
  };

  return (
    <div
      id="opening-experience-overlay"
      className={`fixed inset-0 z-50 overflow-hidden select-none transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#0D0A08' }}
    >
      {/* 60fps Luxury Olfactory Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Top Header Controls: Skip */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          id="skip-intro-btn"
          type="button"
          onClick={handleFinish}
          className="group px-4 py-1.5 rounded-full border border-stone-700/80 bg-stone-900/60 hover:bg-stone-800 text-stone-300 hover:text-amber-300 text-xs font-medium tracking-wider uppercase transition-all backdrop-blur-md flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Center Stage: Dynamic Poetic Text & Layering Accords */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6 text-center z-10">
        {/* Sequence 0–1.2s: "A fragrance is more than a scent..." */}
        {elapsedTime < 1.25 && (
          <div className="animate-fade-in space-y-3 max-w-md">
            <div className="text-amber-400/80 font-serif text-xs tracking-[0.25em] uppercase font-light">
              ✦ The First Impression ✦
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F5E9D0] tracking-wide leading-tight">
              A fragrance is more<br />than a scent...
            </h1>
          </div>
        )}

        {/* Sequence 1.25–2.6s: "A memory. A mood. A moment." + Indian botanicals */}
        {elapsedTime >= 1.25 && elapsedTime < 2.65 && (
          <div className="animate-fade-in space-y-4 max-w-md">
            <div className="flex items-center justify-center gap-3 text-xs tracking-widest uppercase font-mono text-amber-300/80">
              <span>Rose</span>
              <span>&bull;</span>
              <span>Sandalwood</span>
              <span>&bull;</span>
              <span>Mitti</span>
              <span>&bull;</span>
              <span>Oud</span>
            </div>
            <div className="space-y-1.5">
              <h2 className="font-serif text-3xl sm:text-4xl text-[#F5E9D0] font-normal tracking-wide">
                A memory.
              </h2>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#D6AA62] font-normal tracking-wide">
                A mood.
              </h2>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#C86D74] font-normal tracking-wide">
                A moment.
              </h2>
            </div>
          </div>
        )}

        {/* Sequence 2.65–4.0s: The Layering Demonstration & Cross-Cultural Fusion */}
        {elapsedTime >= 2.65 && elapsedTime < 4.05 && (
          <div className="animate-fade-in space-y-4 max-w-lg">
            <div className="text-[11px] font-mono tracking-widest uppercase text-stone-400">
              The Alchemy of Harmony
            </div>

            {/* Layering Visual Accords */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="px-3 py-1 rounded-full bg-rose-950/70 text-rose-200 border border-rose-500/40 text-xs font-serif tracking-wider shadow-sm">
                ROSE
              </span>
              <span className="text-amber-400 text-sm font-bold">+</span>
              <span className="px-3 py-1 rounded-full bg-amber-950/70 text-amber-200 border border-amber-500/40 text-xs font-serif tracking-wider shadow-sm">
                SANDALWOOD
              </span>
              <span className="text-amber-400 text-sm font-bold">+</span>
              <span className="px-3 py-1 rounded-full bg-stone-900/90 text-stone-300 border border-stone-600 text-xs font-serif tracking-wider shadow-sm">
                OUD
              </span>
            </div>

            <div className="text-amber-400/90 text-sm font-serif italic">
              ↓
            </div>

            <div className="inline-block px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/25 to-amber-500/20 border border-amber-400/50 shadow-lg">
              <span className="font-serif text-lg sm:text-xl text-[#F5E9D0] tracking-widest uppercase font-medium">
                YOUR SIGNATURE
              </span>
            </div>

            <p className="text-[11px] text-stone-400 tracking-wider uppercase font-mono pt-1">
              Indian Heritage &bull; Global Benchmarks &bull; Perfect Equilibrium
            </p>
          </div>
        )}

        {/* Sequence 4.05–5.5s: App Logo & Arrival Crest */}
        {elapsedTime >= 4.05 && (
          <div className="animate-fade-in space-y-5 max-w-md">
            {/* Crest Emblem */}
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-b from-stone-850 to-stone-950 text-amber-300 flex items-center justify-center border border-amber-400/60 shadow-2xl ring-4 ring-amber-500/15 animate-pulse">
              <Droplets className="w-8 h-8 text-amber-300" />
            </div>

            <div className="space-y-1.5">
              <h1 className="font-serif text-3xl sm:text-4xl text-[#F5E9D0] tracking-[0.08em] font-medium uppercase">
                L'ATELIER OLFACTIF
              </h1>
              <p className="font-serif italic text-base sm:text-lg text-amber-200/90 tracking-wide">
                Find your perfect layer.
              </p>
            </div>

            <div className="pt-2 pointer-events-auto">
              <button
                id="enter-atelier-btn"
                type="button"
                onClick={handleFinish}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-semibold text-xs rounded-full uppercase tracking-widest shadow-xl transition-all transform hover:scale-105 cursor-pointer flex items-center gap-2 mx-auto"
              >
                <span>Enter Atelier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Progress Bar & Poetic Status Messages */}
      <div className="absolute bottom-10 inset-x-0 max-w-sm mx-auto px-6 space-y-2 text-center z-10 pointer-events-none">
        <p className="text-xs text-[#D6AA62] font-sans tracking-wide transition-opacity duration-300">
          {activeMessage}
        </p>

        {/* Luxury Hairline Progress Indicator */}
        <div className="w-full h-1 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-[#F5E9D0] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="text-[10px] text-stone-500 font-mono tracking-widest uppercase">
          Olfactory Intelligence &bull; {progressPercent}%
        </div>
      </div>
    </div>
  );
};
