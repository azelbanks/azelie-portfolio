'use client';

import { useCallback, useEffect, useState } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine, ISourceOptions } from '@tsparticles/engine';
import { useAppStore } from '@/lib/store';

export function ParticleField() {
  const mode = useAppStore((state) => state.mode);
  const [isReady, setIsReady] = useState(false);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
    setIsReady(true);
  }, []);

  const strategistOptions: ISourceOptions = {
    fullScreen: false,
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: ['#C9A962', '#D4B87A', '#1E3A5F'],
      },
      links: {
        color: '#C9A962',
        distance: 150,
        enable: true,
        opacity: 0.15,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.8,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'bounce',
        },
      },
      number: {
        density: {
          enable: true,
          width: 1920,
          height: 1080,
        },
        value: 60,
      },
      opacity: {
        value: { min: 0.2, max: 0.5 },
        animation: {
          enable: true,
          speed: 0.5,
          sync: false,
        },
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'grab',
        },
        onClick: {
          enable: true,
          mode: 'push',
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.4,
          },
        },
        push: {
          quantity: 2,
        },
      },
    },
    detectRetina: true,
  };

  const techOptions: ISourceOptions = {
    fullScreen: false,
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: ['#00F0FF', '#FF00E5', '#00F0FF'],
      },
      links: {
        color: '#00F0FF',
        distance: 120,
        enable: true,
        opacity: 0.2,
        width: 1,
        triangles: {
          enable: true,
          opacity: 0.02,
        },
      },
      move: {
        enable: true,
        speed: 1.2,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'bounce',
        },
        trail: {
          enable: true,
          length: 3,
          fill: {
            color: '#00F0FF',
          },
        },
      },
      number: {
        density: {
          enable: true,
          width: 1920,
          height: 1080,
        },
        value: 80,
      },
      opacity: {
        value: { min: 0.3, max: 0.7 },
        animation: {
          enable: true,
          speed: 1,
          sync: false,
        },
      },
      shape: {
        type: ['circle', 'triangle'],
      },
      size: {
        value: { min: 1, max: 4 },
        animation: {
          enable: true,
          speed: 2,
          sync: false,
        },
      },
      shadow: {
        blur: 5,
        color: {
          value: '#00F0FF',
        },
        enable: true,
        offset: {
          x: 0,
          y: 0,
        },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse',
        },
        onClick: {
          enable: true,
          mode: 'push',
        },
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
          speed: 1,
        },
        push: {
          quantity: 4,
        },
      },
    },
    detectRetina: true,
  };

  const options = mode === 'strategist' ? strategistOptions : techOptions;

  return (
    <Particles
      id="hero-particles"
      className="absolute inset-0 z-0"
      init={particlesInit}
      options={options}
      key={mode} // Force re-render on mode change
    />
  );
}

// Simpler fallback if particles don't load
export function ParticleFieldFallback() {
  const mode = useAppStore((state) => state.mode);
  const [dots, setDots] = useState<Array<{ x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const newDots = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
    }));
    setDots(newDots);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {dots.map((dot, i) => (
        <div
          key={i}
          className={`absolute rounded-full animate-pulse ${
            mode === 'strategist' ? 'bg-accent-primary' : 'bg-accent-primary shadow-glow'
          }`}
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            opacity: 0.3,
            animationDelay: `${dot.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default ParticleField;
