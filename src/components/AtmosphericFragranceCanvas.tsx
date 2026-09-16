import React, { useEffect, useRef } from 'react';

export type ScentFamilyAtmosphere = 'citrus' | 'oud' | 'rose' | 'aquatic' | 'earthy' | 'woody' | 'default';

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

export const AtmosphericFragranceCanvas: React.FC<AtmosphericFragranceCanvasProps> = ({
  atmosphere = 'default',
  intensity = 1.0,
  opacity = 0.45
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    let particles: Particle[] = [];

    const getPalette = (type: string) => {
      switch (type) {
        case 'citrus':
          return ['#FDE047', '#FBBF24', '#34D399', '#FEF08A']; // sparkling yellow-amber-mint
        case 'oud':
          return ['#78350F', '#3B0764', '#451A03', '#A855F7']; // slow deep smoked quartz & violet smoke
        case 'rose':
          return ['#FB7185', '#F43F5E', '#FDA4AF', '#FDE047']; // soft floating pink petals & honey
        case 'aquatic':
          return ['#38BDF8', '#0284C7', '#67E8F9', '#A5F3FC']; // flowing oceanic mist & cyan
        case 'earthy':
          return ['#D97706', '#92400E', '#B45309', '#78350F']; // slow warm petrichor clay dust
        case 'woody':
          return ['#CA8A04', '#A16207', '#EAB308', '#713F12']; // organic golden cedar & sandalwood drift
        default:
          return ['#F59E0B', '#E879F9', '#38BDF8', '#F43F5E'];
      }
    };

    const initParticles = () => {
      particles = [];
      const count = atmosphere === 'oud' ? 28 : (atmosphere === 'citrus' ? 65 : 45);
      const palette = getPalette(atmosphere);

      for (let i = 0; i < count; i++) {
        const color = palette[Math.floor(Math.random() * palette.length)];
        let vx = 0;
        let vy = 0;
        let radius = 2;
        let baseAlpha = 0.25;

        if (atmosphere === 'citrus') {
          // Energetic sparkling particles
          vx = (Math.random() - 0.5) * 1.8;
          vy = -Math.random() * 1.6 - 0.5;
          radius = Math.random() * 2.5 + 1;
          baseAlpha = Math.random() * 0.4 + 0.3;
        } else if (atmosphere === 'oud') {
          // Slow dense smoke
          vx = (Math.random() - 0.5) * 0.35;
          vy = -Math.random() * 0.4 - 0.1;
          radius = Math.random() * 14 + 18; // large diffuse clouds
          baseAlpha = Math.random() * 0.12 + 0.04;
        } else if (atmosphere === 'rose') {
          // Soft floating particles
          vx = (Math.random() - 0.5) * 0.6;
          vy = -Math.random() * 0.5 - 0.2;
          radius = Math.random() * 3.5 + 1.5;
          baseAlpha = Math.random() * 0.3 + 0.2;
        } else if (atmosphere === 'aquatic') {
          // Flowing horizontal/diagonal currents
          vx = Math.random() * 1.2 + 0.3;
          vy = (Math.random() - 0.5) * 0.4;
          radius = Math.random() * 3 + 1.2;
          baseAlpha = Math.random() * 0.35 + 0.15;
        } else if (atmosphere === 'earthy') {
          // Slow dust-like particles settling and floating
          vx = (Math.random() - 0.5) * 0.25;
          vy = Math.random() * 0.3 + 0.1;
          radius = Math.random() * 2.2 + 1;
          baseAlpha = Math.random() * 0.3 + 0.15;
        } else {
          // Woody organic drift
          vx = (Math.random() - 0.5) * 0.4;
          vy = -Math.random() * 0.4 - 0.15;
          radius = Math.random() * 4 + 2;
          baseAlpha = Math.random() * 0.25 + 0.15;
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
          twinkleSpeed: Math.random() * 0.04 + 0.01,
          sinOffset: Math.random() * Math.PI * 2
        });
      }
    };

    initParticles();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.sinOffset !== undefined) {
          p.sinOffset += 0.015;
          p.x += Math.sin(p.sinOffset) * 0.25;
        }

        if (p.twinkle !== undefined && p.twinkleSpeed) {
          p.twinkle += p.twinkleSpeed;
          p.alpha = Math.max(0.05, p.baseAlpha + Math.sin(p.twinkle) * 0.15);
        }

        // Boundary wrap
        if (p.x < -40) p.x = width + 30;
        if (p.x > width + 40) p.x = -30;
        if (p.y < -40) p.y = height + 30;
        if (p.y > height + 40) p.y = -30;

        ctx.beginPath();
        if (atmosphere === 'oud') {
          // Soft radial gradient for smoke puff
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
    };
  }, [atmosphere, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
      style={{ opacity }}
    />
  );
};
