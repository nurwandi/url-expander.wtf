import React, { useCallback, useEffect, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
  emoji?: string;
  rotation: number;
  rotationSpeed: number;
}

interface CoolModeProps {
  children: React.ReactElement;
  config?: {
    particleCount?: number;
    speedHorz?: number;
    speedUp?: number;
    gravity?: number;
    colors?: string[];
    sizeRange?: [number, number];
    emojis?: string[];
  };
}

const defaultConfig = {
  particleCount: 30,
  speedHorz: 5,
  speedUp: 7,
  gravity: 0.5,
  colors: ["#D4A574", "#F5F1E8", "#E8DCC8", "#8B7355"],
  sizeRange: [4, 8] as [number, number],
};

export function CoolMode({ children, config = {} }: CoolModeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const particleIdRef = useRef(0);

  const finalConfig = { ...defaultConfig, ...config };

  const createParticles = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const newParticles: Particle[] = [];

      // Get random emoji for this click (all particles will use same emoji)
      let currentEmoji: string | undefined;
      if (finalConfig.emojis && finalConfig.emojis.length > 0) {
        const randomIndex = Math.floor(Math.random() * finalConfig.emojis.length);
        currentEmoji = finalConfig.emojis[randomIndex];
      }

      for (let i = 0; i < finalConfig.particleCount; i++) {
        const angle = (Math.PI * 2 * i) / finalConfig.particleCount;
        const velocity = 0.5 + Math.random() * 0.5;

        const particle: Particle = {
          id: particleIdRef.current++,
          x,
          y,
          vx: Math.cos(angle) * finalConfig.speedHorz * velocity,
          vy: Math.sin(angle) * finalConfig.speedHorz * velocity - finalConfig.speedUp,
          life: 1,
          color:
            finalConfig.colors[Math.floor(Math.random() * finalConfig.colors.length)],
          size:
            finalConfig.sizeRange[0] +
            Math.random() * (finalConfig.sizeRange[1] - finalConfig.sizeRange[0]),
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.3,
          emoji: currentEmoji, // All particles use same random emoji per click
        };

        newParticles.push(particle);
      }

      particlesRef.current = [...particlesRef.current, ...newParticles];
    },
    [finalConfig]
  );

  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += finalConfig.gravity;
      particle.life -= 0.01;
      particle.rotation += particle.rotationSpeed;

      if (particle.life <= 0) return false;

      ctx.globalAlpha = particle.life;

      if (particle.emoji) {
        // Render emoji with rotation
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.font = `${particle.size * 3}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(particle.emoji, 0, 0);
        ctx.restore();
      } else {
        // Render colored circle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      return true;
    });

    if (particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(updateParticles);
    }
  }, [finalConfig.gravity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleClick = (event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    createParticles(x, y);

    if (!animationRef.current) {
      updateParticles();
    }

    // Call original onClick if it exists
    const originalOnClick = children.props.onClick;
    if (originalOnClick) {
      originalOnClick(event);
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      {React.cloneElement(children, {
        onClick: handleClick,
      })}
    </>
  );
}
