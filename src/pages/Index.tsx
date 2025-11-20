
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/HeroSection';
import UrlForm from '@/components/UrlForm';
import ResultDisplay from '@/components/ResultDisplay';
import FaqSection from '@/components/FaqSection';
import { Coffee, User, LogOut, LayoutDashboard, ChevronDown, ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import InteractiveHoverButton from '@/components/ui/interactive-hover-button';
import { MagicCard } from '@/components/ui/magic-card';
import { ScrollVelocityContainer, ScrollVelocityRow } from '@/components/ui/scroll-based-velocity';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Index = () => {
  const [expandedUrl, setExpandedUrl] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, login, logout } = useAuth();

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
    <div className="min-h-screen bg-the-frick-bg text-the-frick-text">
      {/* Header - Brutalist */}
      <header className="py-4 md:py-6 sticky top-0 z-40 bg-the-frick-bg border-b-4 border-the-frick-text">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-base md:text-2xl font-black font-display cursor-pointer hover:translate-x-1 transition-transform uppercase tracking-tight">
              <span className="text-the-frick-text">url-expander</span>
              <span className="text-the-frick-rust">.wtf</span>
            </h1>
          </Link>

          {/* Auth buttons - Brutalist */}
          {!isAuthenticated ? (
            <button
              onClick={login}
              className="bg-the-frick-rust text-white hover:translate-x-1 hover:-translate-y-1 rounded px-6 py-2.5 font-bold transition-transform border-3 border-the-frick-text uppercase tracking-wide text-sm shadow-[4px_4px_0_0_#1A1A1A] hover:shadow-[6px_6px_0_0_#1A1A1A] active:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-0.5 active:translate-y-0.5"
              style={{borderWidth: '3px'}}
            >
              Sign in
            </button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="bg-the-frick-rust text-white hover:translate-x-1 hover:-translate-y-1 rounded px-6 py-2.5 font-bold transition-transform border-3 border-the-frick-text uppercase tracking-wide text-sm shadow-[4px_4px_0_0_#1A1A1A] hover:shadow-[6px_6px_0_0_#1A1A1A] flex items-center gap-2 group focus-visible:ring-0 focus-visible:ring-offset-0"
                  style={{borderWidth: '3px'}}
                >
                  <span>{user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Account'}</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[200px] w-auto max-w-[300px] bg-white rounded-lg border-4 border-the-frick-text shadow-[6px_6px_0_0_#1A1A1A] p-2 mt-2">
                <DropdownMenuLabel className="text-the-frick-text-muted font-bold px-3 py-2 text-xs uppercase tracking-wide truncate">
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-the-frick-text h-0.5 my-2" />
                <DropdownMenuItem asChild className="focus:bg-the-frick-surface hover:bg-the-frick-surface rounded">
                  <Link to="/dashboard" className="cursor-pointer px-3 py-3 transition-colors">
                    <span className="font-bold text-the-frick-text text-sm uppercase tracking-wide">My URLs</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-the-frick-text h-0.5 my-2" />
                <DropdownMenuItem onClick={logout} className="cursor-pointer px-3 py-3 focus:bg-the-frick-surface hover:bg-the-frick-surface rounded transition-colors">
                  <span className="font-bold text-the-frick-text text-sm uppercase tracking-wide">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Main content with clean styling */}
      <main>
        {/* Hero section with custom SVG backgrounds - Very generous spacing like Modern */}
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

        {/* Satire Scroll Velocity Text Section - Brutalist */}
        <section className="w-full py-6 md:py-12 bg-the-frick-rust overflow-hidden relative isolate border-y-4 border-the-frick-text">
          {/* Zigzag pattern background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(26, 26, 26, 0.2) 10px,
              rgba(26, 26, 26, 0.2) 20px
            )`
          }} />

          <ScrollVelocityContainer>
            <ScrollVelocityRow baseVelocity={-2} className="text-white text-xl md:text-4xl font-black font-display py-2 md:py-4 uppercase tracking-tight">
              <span className="mx-8">Only 7 Days • </span>
              <span className="mx-8">Because Storage Costs Money • </span>
              <span className="mx-8">Use It or Lose It • </span>
              <span className="mx-8">No Refunds • </span>
              <span className="mx-8">No Exceptions • </span>
              <span className="mx-8">Temporary by Design • </span>
            </ScrollVelocityRow>
            <ScrollVelocityRow baseVelocity={2} className="text-white/80 text-base md:text-3xl font-black font-display py-2 md:py-4 uppercase tracking-tight">
              <span className="mx-8">I'm Too Cheap for Permanent Storage • </span>
              <span className="mx-8">Your Link Will Self-Destruct • </span>
              <span className="mx-8">Tick Tock Goes the Clock • </span>
              <span className="mx-8">Don't Blame Me Later • </span>
              <span className="mx-8">Budget Hosting Problems • </span>
              <span className="mx-8">7 Days Is All You Get • </span>
            </ScrollVelocityRow>
          </ScrollVelocityContainer>
        </section>

        {/* URL Input Form Section with Expiration Info - Brutalist */}
        <section className="w-full pt-24 pb-16 md:pt-32 md:pb-24 relative isolate bg-the-frick-bg">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="bg-white border-4 border-the-frick-text rounded-lg shadow-[12px_12px_0_0_#1A1A1A] relative overflow-hidden group transition-all duration-400 hover:shadow-[16px_16px_0_0_#1A1A1A] hover:-translate-y-1">
              {/* Grid Pattern Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-30 transition-opacity duration-400 group-hover:opacity-60" style={{
                backgroundImage: `linear-gradient(to right, rgba(26, 26, 26, 0.03) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(26, 26, 26, 0.03) 1px, transparent 1px)`,
                backgroundSize: '8px 8px',
                zIndex: 1
              }} />

              {/* Dots Pattern Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-400 group-hover:opacity-100" style={{
                backgroundImage: 'radial-gradient(#D4C9BA 1px, transparent 1px)',
                backgroundSize: '16px 16px',
                backgroundPosition: '-8px -8px',
                zIndex: 1
              }} />

              <div className="p-10 md:p-14 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                  {/* Left side - Form */}
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black font-display mb-4 text-the-frick-text leading-tight uppercase tracking-tight">
                      Enter Your URL
                    </h2>
                    <p className="text-base md:text-lg text-the-frick-text font-medium leading-relaxed mb-6">
                      Transform it into something unwieldy and ridiculously long.
                    </p>
                    <UrlForm onUrlExpanded={handleUrlExpanded} />
                  </div>

                  {/* Right side - Additional Info */}
                  <div className="lg:border-l-4 lg:border-the-frick-text lg:pl-12 lg:flex lg:items-center">
                    <div className="space-y-4 lg:px-8">
                      <div className="bg-the-frick-rust/10 border-3 border-the-frick-rust p-4 rounded" style={{borderWidth: '3px'}}>
                        <p className="text-sm md:text-base text-the-frick-text font-bold leading-relaxed">
                          Your extended link is only valid for 7 days, cause I don't wanna pay for more storage!
                        </p>
                      </div>
                      <p className="text-sm md:text-base text-the-frick-text-muted font-medium leading-relaxed">
                        Use it while it lasts. After expiration, the link will be permanently deleted and you'll need to create a new one.
                      </p>
                    </div>
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

      {/* Footer */}
      <footer className="border-t-4 border-the-frick-text py-12 md:py-16 bg-the-frick-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center">
            <p className="text-the-frick-text mb-2 flex items-center justify-center gap-2 text-base">
              Built with <Coffee size={18} className="text-the-frick-rust" /> and with no single purpose
            </p>
            <p className="text-the-frick-text-muted text-sm">
              © {new Date().getFullYear()} - I don't know how to build a good website. So advise me <a href="https://github.com/nurwandi" className="text-the-frick-rust hover:underline transition-colors" target="_blank" rel="noopener noreferrer">here</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
