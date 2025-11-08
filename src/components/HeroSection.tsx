
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection: React.FC = () => {
  const isMobile = useIsMobile();
  return (
    <div className="w-full max-w-7xl mx-auto relative">
      {/* Content - centered layout with max-width */}
      <div className="mb-12 md:mb-16 relative z-10">
        {/* Large heading with underline style like Modern */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-6 md:mb-8 leading-tight max-w-5xl">
          <span className="inline-block">Making URLs</span>
          <br />
          <span className="inline-block underline decoration-4 decoration-the-frick-rust underline-offset-4">Ridiculously</span>{' '}
          <span className="inline-block">Pointless</span>
        </h1>

        {/* Subtitle - Modern style */}
        <div className="max-w-3xl">
          <p className="text-lg md:text-2xl text-the-frick-text leading-relaxed font-normal">
            URL will have a vast impact on the world. url-expander.wtf is a satirical project dedicated to making URLs absurdly longer and mitigating their efficiency.
          </p>
        </div>
      </div>

      {/* Feature Cards - Glass effect style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {/* Card 1 - Unnecessary */}
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 transition-all duration-300 group cursor-pointer border border-white/60 shadow-lg hover:bg-white/50">
          <div className="mb-6">
            <svg className="w-16 h-16 text-the-frick-rust" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="3"/>
              <circle cx="44" cy="20" r="8" stroke="currentColor" strokeWidth="3"/>
              <circle cx="32" cy="44" r="8" stroke="currentColor" strokeWidth="3"/>
              <line x1="26" y1="24" x2="38" y2="40" stroke="currentColor" strokeWidth="3"/>
              <line x1="38" y1="24" x2="26" y2="40" stroke="currentColor" strokeWidth="3"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold font-display mb-3 text-the-frick-text group-hover:text-the-frick-rust transition-colors">
            Completely Unnecessary
          </h3>
          <p className="text-sm text-the-frick-text-muted leading-relaxed">
            Why make URLs shorter when you can make them absurdly longer? Breaking conventions since 2025.
          </p>
        </div>

        {/* Card 2 - Complex */}
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 transition-all duration-300 group cursor-pointer border border-white/60 shadow-lg hover:bg-white/50">
          <div className="mb-6">
            <svg className="w-16 h-16 text-the-frick-rust" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="8" width="20" height="20" stroke="currentColor" strokeWidth="3"/>
              <rect x="36" y="8" width="20" height="20" stroke="currentColor" strokeWidth="3"/>
              <rect x="8" y="36" width="20" height="20" stroke="currentColor" strokeWidth="3"/>
              <rect x="36" y="36" width="20" height="20" stroke="currentColor" strokeWidth="3"/>
              <line x1="28" y1="18" x2="36" y2="18" stroke="currentColor" strokeWidth="3"/>
              <line x1="18" y1="28" x2="18" y2="36" stroke="currentColor" strokeWidth="3"/>
              <line x1="46" y1="28" x2="46" y2="36" stroke="currentColor" strokeWidth="3"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold font-display mb-3 text-the-frick-text group-hover:text-the-frick-rust transition-colors">
            Ridiculously Complex
          </h3>
          <p className="text-sm text-the-frick-text-muted leading-relaxed">
            Advanced algorithms to generate maximum character chaos. Over-engineering at its finest.
          </p>
        </div>

        {/* Card 3 - Useless */}
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 transition-all duration-300 group cursor-pointer border border-white/60 shadow-lg hover:bg-white/50">
          <div className="mb-6">
            <svg className="w-16 h-16 text-the-frick-rust" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="3"/>
              <path d="M20 32 L28 40 L44 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold font-display mb-3 text-the-frick-text group-hover:text-the-frick-rust transition-colors">
            Wonderfully Useless
          </h3>
          <p className="text-sm text-the-frick-text-muted leading-relaxed">
            Achieving absolutely nothing productive while having a great time doing it. Peak performance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
