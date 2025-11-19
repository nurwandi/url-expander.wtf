
import React from 'react';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { ConfettiButton } from '@/components/ui/confetti';

// Icon components as inline SVGs wrapped in divs
const UnnecessaryIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="3"/>
    <circle cx="44" cy="20" r="8" stroke="currentColor" strokeWidth="3"/>
    <circle cx="32" cy="44" r="8" stroke="currentColor" strokeWidth="3"/>
    <line x1="26" y1="24" x2="38" y2="40" stroke="currentColor" strokeWidth="3"/>
    <line x1="38" y1="24" x2="26" y2="40" stroke="currentColor" strokeWidth="3"/>
  </svg>
);

const ComplexIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="20" height="20" stroke="currentColor" strokeWidth="3"/>
    <rect x="36" y="8" width="20" height="20" stroke="currentColor" strokeWidth="3"/>
    <rect x="8" y="36" width="20" height="20" stroke="currentColor" strokeWidth="3"/>
    <rect x="36" y="36" width="20" height="20" stroke="currentColor" strokeWidth="3"/>
    <line x1="28" y1="18" x2="36" y2="18" stroke="currentColor" strokeWidth="3"/>
    <line x1="18" y1="28" x2="18" y2="36" stroke="currentColor" strokeWidth="3"/>
    <line x1="46" y1="28" x2="46" y2="36" stroke="currentColor" strokeWidth="3"/>
  </svg>
);

const UselessIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="3"/>
    <path d="M20 32 L28 40 L44 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const features = [
  {
    Icon: UnnecessaryIcon,
    name: "Completely Unnecessary",
    description: "Why make URLs shorter when you can make them absurdly longer? Breaking conventions since 2025.",
    className: "col-span-3 md:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-the-frick-rust/20 via-transparent to-transparent opacity-50" />
    ),
  },
  {
    Icon: ComplexIcon,
    name: "Ridiculously Complex",
    description: "Advanced algorithms to generate maximum character chaos. Over-engineering at its finest.",
    className: "col-span-3 md:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-transparent opacity-50" />
    ),
  },
  {
    Icon: UselessIcon,
    name: "Wonderfully Useless",
    description: "Achieving absolutely nothing productive while having a great time doing it. Peak performance.",
    className: "col-span-3 md:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-transparent to-transparent opacity-50" />
    ),
  },
];

const HeroSection: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto relative">
      {/* Content - centered layout with max-width */}
      <div className="mb-12 md:mb-16 relative z-10">
        {/* Large heading with underline style */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-6 md:mb-8 leading-tight max-w-5xl">
          <span className="inline-block">Making URLs</span>
          <br />
          <ConfettiButton
            options={{
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#D4A574', '#F5F1E8', '#E8DCC8', '#8B7355'],
            }}
            className="inline-block underline decoration-4 decoration-the-frick-rust underline-offset-4 cursor-pointer hover:text-the-frick-rust transition-colors duration-300 bg-transparent border-none p-0 font-bold font-display text-4xl md:text-6xl lg:text-7xl"
          >
            Ridiculously
          </ConfettiButton>{' '}
          <span className="inline-block">Pointless</span>
        </h1>

        {/* Subtitle */}
        <div className="max-w-3xl">
          <p className="text-lg md:text-2xl text-the-frick-text leading-relaxed font-normal">
            URL will have a vast impact on the world. url-expander.wtf is a satirical project dedicated to making URLs absurdly longer and mitigating their efficiency.
          </p>
        </div>
      </div>

      {/* Bento Grid - Feature Cards */}
      <BentoGrid>
        {features.map((feature) => (
          <BentoCard
            key={feature.name}
            {...feature}
            className={`${feature.className} bg-white/40 backdrop-blur-md border-2 border-white/60 shadow-lg hover:border-the-frick-rust/30 hover:bg-white/60`}
          />
        ))}
      </BentoGrid>
    </div>
  );
};

export default HeroSection;
