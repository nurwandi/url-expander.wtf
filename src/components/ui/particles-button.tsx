import { useEffect, useMemo, useState, forwardRef } from "react";
import { Sparkle } from "lucide-react";
import { loadFull } from "tsparticles";

import type { ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";

const options: ISourceOptions = {
  key: "star",
  name: "Star",
  particles: {
    number: {
      value: 20,
      density: {
        enable: false,
      },
    },
    color: {
      value: ["#CC7A63", "#D4A574", "#E8DCC8", "#F5F1E8", "#A67C52", "#B88D68"],
    },
    shape: {
      type: "star",
      options: {
        star: {
          sides: 4,
        },
      },
    },
    opacity: {
      value: 0.8,
    },
    size: {
      value: { min: 1, max: 4 },
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      enable: true,
      direction: "clockwise",
      animation: {
        enable: true,
        speed: 10,
        sync: false,
      },
    },
    links: {
      enable: false,
    },
    reduceDuplicates: true,
    move: {
      enable: true,
      center: {
        x: 50,
        y: 50,
      },
    },
  },
  interactivity: {
    events: {},
  },
  smooth: true,
  fpsLimit: 120,
  background: {
    color: "transparent",
    size: "cover",
  },
  fullScreen: {
    enable: false,
  },
  detectRetina: true,
  absorbers: [
    {
      enable: true,
      opacity: 0,
      size: {
        value: 1,
        density: 1,
        limit: {
          radius: 5,
          mass: 5,
        },
      },
      position: {
        x: 50,
        y: 50,
      },
    },
  ],
  emitters: [
    {
      autoPlay: true,
      fill: true,
      life: {
        wait: true,
      },
      rate: {
        quantity: 5,
        delay: 0.5,
      },
      position: {
        x: 50,
        y: 50,
      },
    },
  ],
};

interface ParticlesButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const ParticlesButton = forwardRef<HTMLButtonElement, ParticlesButtonProps>(
  ({ children, className, ...props }, ref) => {
    const [particleState, setParticlesReady] = useState<"loaded" | "ready">();
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
      initParticlesEngine(async (engine) => {
        await loadFull(engine);
      }).then(() => {
        setParticlesReady("loaded");
      });
    }, []);

    const modifiedOptions = useMemo(() => {
      options.autoPlay = isHovering;
      return options;
    }, [isHovering]);

    return (
      <button
        ref={ref}
        className="group relative bg-the-frick-rust hover:bg-the-frick-rust/90 text-white font-medium text-base px-8 py-3 rounded-full transition-all duration-200 shrink-0 overflow-visible"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        {...props}
      >
        <span className="relative z-20 flex items-center gap-2">
          <Sparkle className="size-4 fill-white animate-pulse" />
          {children}
        </span>
        <Sparkle
          style={{
            animationDelay: "1s",
          }}
          className="absolute bottom-2 left-4 z-20 size-1.5 rotate-12 animate-pulse fill-white"
        />
        <Sparkle
          style={{
            animationDelay: "1.5s",
            animationDuration: "2.5s",
          }}
          className="absolute right-4 top-2 size-1 -rotate-12 animate-pulse fill-white"
        />
        <Sparkle
          style={{
            animationDelay: "0.5s",
            animationDuration: "2.5s",
          }}
          className="absolute left-5 top-2 size-1 animate-pulse fill-white"
        />
        {!!particleState && (
          <Particles
            id="particles-button"
            className={`pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 ${particleState === "ready" ? "group-hover:opacity-100" : ""}`}
            particlesLoaded={async () => {
              setParticlesReady("ready");
            }}
            options={modifiedOptions}
          />
        )}
      </button>
    );
  }
);

ParticlesButton.displayName = "ParticlesButton";
