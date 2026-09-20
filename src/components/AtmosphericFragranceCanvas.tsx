import React, { useEffect, useRef } from 'react';
import { isMobileOrLowPower } from '../motion/performance.js';

export type ScentFamilyAtmosphere =
  | 'citrus'
  | 'oud'
  | 'rose'
  | 'aquatic'
  | 'earthy'
  | 'woody'
  | 'khus'
  | 'alpine'
  | 'spicy'
  | 'default';

export interface AtmosphereMeta {
  id: ScentFamilyAtmosphere;
  name: string;
  subhead: string;
  glowColor1: string;
  glowColor2: string;
  accentColor: string;
  palette: string[];
  particleStyle: 'sparkle' | 'smoke' | 'petal' | 'mist' | 'dust' | 'organic';
  ambientSoundSuggested?: 'monsoon_deg' | 'temple_breeze' | 'amber_hearth' | 'none';
}

export const ATMOSPHERE_PROFILES: Record<ScentFamilyAtmosphere, AtmosphereMeta> = {
  earthy: {
    id: 'earthy',
    name: 'Alluvial Clay & Mitti',
    subhead: 'Warm terracotta twilight & damp petrichor earth',
    glowColor1: 'rgba(194, 65, 12, 0.16)', // terracotta rust
    glowColor2: 'rgba(120, 53, 15, 0.14)', // rich warm soil
    accentColor: '#EA580C',
    palette: ['#EA580C', '#D97706', '#9A3412', '#F97316', '#7C2D12'],
    particleStyle: 'dust',
    ambientSoundSuggested: 'monsoon_deg'
  },
  khus: {
    id: 'khus',
    name: 'Ruh Khus & Wild Vetiver',
    subhead: 'Crisp emerald dawn & cooling subterranean dew',
    glowColor1: 'rgba(16, 185, 129, 0.16)', // emerald
    glowColor2: 'rgba(6, 95, 70, 0.15)', // deep forest moss
    accentColor: '#10B981',
    palette: ['#34D399', '#10B981', '#059669', '#6EE7B7', '#A7F3D0'],
    particleStyle: 'mist',
    ambientSoundSuggested: 'temple_breeze'
  },
  oud: {
    id: 'oud',
    name: 'Assam Oud & Amber Coals',
    subhead: 'Deep honeyed cognac, smoldering resin & charcoal smoke',
    glowColor1: 'rgba(180, 83, 9, 0.20)', // cognac amber
    glowColor2: 'rgba(88, 28, 135, 0.15)', // violet smoked incense
    accentColor: '#D97706',
    palette: ['#B45309', '#78350F', '#D97706', '#6B21A8', '#451A03'],
    particleStyle: 'smoke',
    ambientSoundSuggested: 'amber_hearth'
  },
  spicy: {
    id: 'spicy',
    name: 'Warm Resins & Sacred Spices',
    subhead: 'Radiant saffron, Ceylon cinnamon & golden frankincense embers',
    glowColor1: 'rgba(234, 88, 12, 0.18)',
    glowColor2: 'rgba(185, 28, 28, 0.14)',
    accentColor: '#EA580C',
    palette: ['#EA580C', '#C2410C', '#B45309', '#F97316', '#7C2D12'],
    particleStyle: 'sparkle',
    ambientSoundSuggested: 'amber_hearth'
  },
  alpine: {
    id: 'alpine',
    name: 'Himalayan Cedar & Bergamot',
    subhead: 'Crisp alpine azure & high-altitude cedar needle breeze',
    glowColor1: 'rgba(56, 189, 248, 0.16)', // sky azure
    glowColor2: 'rgba(30, 58, 138, 0.14)', // mountain indigo
    accentColor: '#38BDF8',
    palette: ['#38BDF8', '#0284C7', '#7DD3FC', '#60A5FA', '#E0F2FE'],
    particleStyle: 'sparkle',
    ambientSoundSuggested: 'temple_breeze'
  },
  rose: {
    id: 'rose',
    name: 'Damask Rose of Kannauj',
    subhead: 'Velvety crimson petals & sun-warmed floral nectar',
    glowColor1: 'rgba(244, 63, 94, 0.16)', // damask rose
    glowColor2: 'rgba(190, 24, 93, 0.13)', // rich wine
    accentColor: '#FB7185',
    palette: ['#FB7185', '#F43F5E', '#FDA4AF', '#FDE047', '#E11D48'],
    particleStyle: 'petal',
    ambientSoundSuggested: 'temple_breeze'
  },
  citrus: {
    id: 'citrus',
    name: 'Solar Citrus & Orange Blossom',
    subhead: 'Effervescent golden sunlight & sparkling Mediterranean zest',
    glowColor1: 'rgba(245, 158, 11, 0.16)', // radiant amber
    glowColor2: 'rgba(234, 179, 8, 0.12)', // warm lemon gold
    accentColor: '#FBBF24',
    palette: ['#FDE047', '#FBBF24', '#34D399', '#FEF08A', '#F59E0B'],
    particleStyle: 'sparkle',
    ambientSoundSuggested: 'none'
  },
  aquatic: {
    id: 'aquatic',
    name: 'Oceanic Ozone & Sea Salt',
    subhead: 'Flowing coastal breeze & mineral brine currents',
    glowColor1: 'rgba(14, 165, 233, 0.16)',
    glowColor2: 'rgba(15, 118, 110, 0.13)',
    accentColor: '#06B6D4',
    palette: ['#38BDF8', '#0284C7', '#22D3EE', '#67E8F9', '#A5F3FC'],
    particleStyle: 'mist',
    ambientSoundSuggested: 'monsoon_deg'
  },
  woody: {
    id: 'woody',
    name: 'Mysore Sandalwood & Spices',
    subhead: 'Creamy lactonic santal & sacred temple resins',
    glowColor1: 'rgba(202, 138, 4, 0.17)',
    glowColor2: 'rgba(113, 63, 18, 0.15)',
    accentColor: '#CA8A04',
    palette: ['#CA8A04', '#A16207', '#EAB308', '#713F12', '#D97706'],
    particleStyle: 'organic',
    ambientSoundSuggested: 'temple_breeze'
  },
  default: {
    id: 'default',
    name: 'Atelier Signature Atmosphere',
    subhead: 'Calibrated luxury neutral ambient canvas',
    glowColor1: 'rgba(217, 119, 6, 0.12)',
    glowColor2: 'rgba(68, 64, 60, 0.10)',
    accentColor: '#F59E0B',
    palette: ['#F59E0B', '#E879F9', '#38BDF8', '#F43F5E'],
    particleStyle: 'organic',
    ambientSoundSuggested: 'none'
  }
};

interface AtmosphericFragranceCanvasProps {
  atmosphere?: ScentFamilyAtmosphere;
  intensity?: number;
  opacity?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  color: string;
  twinkle?: number;
  twinkleSpeed?: number;
  sinOffset?: number;
}

const AtmosphericFragranceCanvasComponent: React.FC<AtmosphericFragranceCanvasProps> = ({
  atmosphere = 'default',
  intensity = 1.0,
  opacity = 0.55
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeProfile = ATMOSPHERE_PROFILES[atmosphere] || ATMOSPHERE_PROFILES.default;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let isVisible = !document.hidden;

    const isMobile = isMobileOrLowPower();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
        animId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    let particles: Particle[] = [];
    const palette = activeProfile.palette;

    const initParticles = () => {
      particles = [];
      const baseCount = isMobile ? 14 : 32;
      const count = Math.round(baseCount * Math.min(1.5, Math.max(0.5, intensity)));

      for (let i = 0; i < count; i++) {
        const color = palette[Math.floor(Math.random() * palette.length)];
        let vx = 0;
        let vy = 0;
        let radius = 2;
        let baseAlpha = 0.25;

        if (activeProfile.particleStyle === 'sparkle') {
          // Energetic sparkling upward motes
          vx = (Math.random() - 0.5) * 1.2;
          vy = -Math.random() * 1.1 - 0.3;
          radius = Math.random() * 2.2 + 1;
          baseAlpha = Math.random() * 0.4 + 0.25;
        } else if (activeProfile.particleStyle === 'smoke') {
          // Slow expansive charcoal / oud smoke puffs
          vx = (Math.random() - 0.5) * 0.3;
          vy = -Math.random() * 0.3 - 0.08;
          radius = isMobile ? Math.random() * 10 + 10 : Math.random() * 14 + 18;
          baseAlpha = Math.random() * 0.12 + 0.04;
        } else if (activeProfile.particleStyle === 'petal') {
          // Gently floating falling petals
          vx = (Math.random() - 0.5) * 0.6;
          vy = Math.random() * 0.35 + 0.12;
          radius = Math.random() * 3.2 + 1.6;
          baseAlpha = Math.random() * 0.3 + 0.18;
        } else if (activeProfile.particleStyle === 'mist') {
          // Flowing horizontal dewy currents (Vetiver / Aquatic)
          vx = Math.random() * 0.8 + 0.2;
          vy = (Math.random() - 0.5) * 0.25;
          radius = Math.random() * 2.8 + 1.2;
          baseAlpha = Math.random() * 0.3 + 0.12;
        } else if (activeProfile.particleStyle === 'dust') {
          // Clay & Petrichor settling dust particles
          vx = (Math.random() - 0.5) * 0.25;
          vy = Math.random() * 0.3 + 0.1;
          radius = Math.random() * 2.2 + 1.0;
          baseAlpha = Math.random() * 0.28 + 0.15;
        } else {
          // Woody organic drift
          vx = (Math.random() - 0.5) * 0.35;
          vy = -Math.random() * 0.3 - 0.1;
          radius = Math.random() * 3.0 + 1.2;
          baseAlpha = Math.random() * 0.25 + 0.12;
        }

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx,
          vy,
          radius,
          baseAlpha,
          alpha: baseAlpha,
          color,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          sinOffset: Math.random() * Math.PI * 2
        });
      }
    };

    initParticles();

    let lastTime = performance.now();

    const render = (currentTime: number) => {
      if (!isVisible) return;

      const elapsed = currentTime - lastTime;
      lastTime = currentTime;
      // Clamp delta to avoid leaps after tab resumes
      const delta = Math.min(elapsed / 16.67, 2.0);

      ctx.clearRect(0, 0, width, height);

      const effectiveSpeed = Math.max(0.6, intensity) * delta;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * effectiveSpeed;
        p.y += p.vy * effectiveSpeed;

        if (p.sinOffset !== undefined) {
          p.sinOffset += 0.015 * delta;
          p.x += Math.sin(p.sinOffset) * 0.25 * delta;
        }

        if (p.twinkle !== undefined && p.twinkleSpeed) {
          p.twinkle += p.twinkleSpeed * delta;
          p.alpha = Math.max(0.04, p.baseAlpha + Math.sin(p.twinkle) * 0.15);
        }

        // Boundary wrap
        if (p.x < -50) p.x = width + 40;
        if (p.x > width + 50) p.x = -40;
        if (p.y < -50) p.y = height + 40;
        if (p.y > height + 50) p.y = -40;

        ctx.beginPath();
        if (activeProfile.particleStyle === 'smoke' && !isMobile) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, p.color);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.globalAlpha = p.alpha * opacity;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * opacity;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [atmosphere, intensity, opacity, activeProfile]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden transition-colors duration-1000 ease-in-out">
      {/* Morphing Liquid Fluid Glass Mesh */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Liquid Fluid Orb 1 - Primary accord essence */}
        <div
          className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] rounded-full filter blur-[90px] animate-liquid-1 transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle, ${activeProfile.glowColor1} 0%, rgba(251, 191, 36, 0.14) 50%, transparent 80%)`,
            opacity: 0.85
          }}
        />

        {/* Liquid Fluid Orb 2 - Secondary base note anchor */}
        <div
          className="absolute -bottom-[20%] -right-[15%] w-[70vw] h-[70vw] rounded-full filter blur-[100px] animate-liquid-2 transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle, ${activeProfile.glowColor2} 0%, rgba(244, 114, 182, 0.12) 55%, transparent 80%)`,
            opacity: 0.8
          }}
        />

        {/* Liquid Fluid Orb 3 - Central visceral refraction */}
        <div
          className="absolute top-[35%] left-[25%] w-[50vw] h-[50vw] rounded-full filter blur-[80px] animate-liquid-3 transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(245, 208, 160, 0.16) 45%, transparent 75%)`,
            opacity: 0.7
          }}
        />

        {/* Subtle Liquid Caustics / Prismatic Glass Overlay */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1.5px, transparent 1.5px)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* Atmospheric Micro-Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity }}
      />
    </div>
  );
};

export const AtmosphericFragranceCanvas = React.memo(AtmosphericFragranceCanvasComponent);
