
import React, { useState, useRef, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import UrlForm from '@/components/UrlForm';
import ResultDisplay from '@/components/ResultDisplay';
import FaqSection from '@/components/FaqSection';
import { Coffee } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [expandedUrl, setExpandedUrl] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  const handleUrlExpanded = (url: string) => {
    setExpandedUrl(url);
    // We'll let the ResultDisplay component handle the scroll
  };

  // Track mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroSectionRef.current) {
        const rect = heroSectionRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div className="min-h-screen bg-anthropic-bg text-anthropic-text">
      {/* Header - Clean and minimal like Anthropic */}
      <header className="py-4 md:py-6 sticky top-0 z-40 bg-anthropic-bg/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-xl md:text-2xl font-bold font-display">
            <span className="text-anthropic-text">url-expander</span>
            <span className="text-anthropic-rust">.wtf</span>
          </h1>
        </div>
      </header>

      {/* Main content with clean styling */}
      <main>
        {/* Hero section with custom SVG backgrounds - Very generous spacing like Anthropic */}
        <section ref={heroSectionRef} className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden">
          {/* Right background - Frame 2 (1).png with mouse tracking (pushed to right and down) */}
          <div
            className="absolute inset-0 overflow-visible pointer-events-none bg-[length:120%] bg-no-repeat opacity-10 transition-transform duration-300 ease-out"
            style={{
              backgroundImage: 'url(/hero-background-right.png)',
              backgroundPosition: '-190% -30%',
              transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
            }}
          />
          {/* Left background - Frame 2 with mouse tracking (opposite direction, pushed to left) */}
          <div
            className="absolute inset-0 overflow-visible pointer-events-none bg-[length:90%] bg-no-repeat opacity-20 transition-transform duration-300 ease-out"
            style={{
              backgroundImage: 'url(/hero-background-left.png)',
              backgroundPosition: '-330% center',
              transform: `translate(${mousePosition.x * -25}px, ${mousePosition.y * -25}px)`,
            }}
          />
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <HeroSection />
          </div>
        </section>

        {/* URL Input Form Section with Expiration Info */}
        <section className="w-full py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="bg-[#E8DCC8] rounded-[2rem] p-10 md:p-14">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Left side - Form */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-[#1A1A1A] leading-tight">
                    Enter Your URL
                  </h2>
                  <p className="text-base md:text-lg text-[#1A1A1A]/70 leading-relaxed mb-6">
                    Transform it into something unwieldy and ridiculously long.
                  </p>
                  <UrlForm onUrlExpanded={handleUrlExpanded} />
                </div>

                {/* Right side - Additional Info */}
                <div className="lg:border-l lg:border-[#1A1A1A]/15 lg:pl-12">
                  <div className="space-y-4">
                    <p className="text-sm md:text-base text-[#1A1A1A]/80 leading-relaxed">
                      Your extended link is only valid for 7 days, cause I don't wanna pay for more storage!
                    </p>
                    <p className="text-sm md:text-base text-[#1A1A1A]/80 leading-relaxed">
                      Use it while it lasts. After expiration, the link will be permanently deleted and you'll need to create a new one.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
          
        {/* Results Display (conditionally rendered) */}
        {expandedUrl && (
          <section className="w-full py-16 md:py-24" ref={resultSectionRef}>
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="max-w-4xl mx-auto">
                <ResultDisplay expandedUrl={expandedUrl} />
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <FaqSection />
          </div>
        </section>
      </main>

      {/* Footer - Clean like Anthropic */}
      <footer className="border-t border-anthropic-border py-12 md:py-16 bg-anthropic-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center">
            <p className="text-anthropic-text mb-2 flex items-center justify-center gap-2 text-base">
              Built with <Coffee size={18} className="text-anthropic-rust" /> and with no single purpose
            </p>
            <p className="text-anthropic-text-muted text-sm">
              © {new Date().getFullYear()} - I don't know how to build a good website. So advise me <a href="https://github.com/nurwandi" className="text-anthropic-rust hover:underline transition-colors" target="_blank" rel="noopener noreferrer">here</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
