
import React, { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import UrlForm from '@/components/UrlForm';
import ResultDisplay from '@/components/ResultDisplay';
import FaqSection from '@/components/FaqSection';
import { Button } from '@/components/ui/button';
import { Github, Coffee } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [expandedUrl, setExpandedUrl] = useState('');
  const isMobile = useIsMobile();
  
  const handleUrlExpanded = (url: string) => {
    setExpandedUrl(url);
  };
  
  return (
    <div className="min-h-screen bg-pastel-bg text-pastel-text">
      {/* Header with clean design */}
      <header className="py-4 md:py-5 sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold font-display header-title">
            <span className="text-bold-blue font-extrabold">url-</span>
            <span className="text-pastel-pink">expander</span>
            <span className="text-bold-blue font-extrabold">.wtf</span>
          </h1>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 bg-white border border-gray-200 text-pastel-text hover:bg-gray-50 rounded-lg"
            onClick={() => window.open('https://github.com/nurwandi/url-expander.wtf', '_blank')}
          >
            <Github size={isMobile ? 16 : 18} />
            {!isMobile && <span>Fork on <span className="font-bold">GitHub</span></span>}
          </Button>
        </div>
      </header>

      {/* Main content with clean styling */}
      <main>
        <div className="flex flex-col items-center">
          {/* Hero section */}
          <div className="w-full pt-12 md:pt-24 pb-12 md:pb-20 container mx-auto px-4">
            <HeroSection />
          </div>
          
          {/* URL Input Form */}
          <div className="w-full py-16 md:py-24 bg-pastel-blue/10 url-form-section">            
            <div className="container mx-auto px-4 md:px-6">
              <div className="mb-10 md:mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Enter Your URL Below</h2>
                <p className="text-base md:text-lg text-pastel-text/80 max-w-2xl mx-auto">And watch as we transform it into something unwieldy and ridiculously long</p>
              </div>
              
              <div className="w-full max-w-3xl mx-auto">
                <UrlForm onUrlExpanded={handleUrlExpanded} />
              </div>
            </div>
          </div>
          
          {/* Results Display (conditionally rendered) */}
          {expandedUrl && (
            <div className="w-full py-16 md:py-24 bg-white">
              <div className="container mx-auto px-4">
                <div className="w-full max-w-3xl mx-auto">
                  <ResultDisplay expandedUrl={expandedUrl} />
                </div>
              </div>
            </div>
          )}
          
          {/* Satirical Information Section */}
          <div className="w-full py-16 md:py-24 bg-pastel-pink/10">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
              <div className="bg-white p-8 flex flex-col items-center text-center space-y-4 rounded-xl shadow-sm">
                <div className="h-16 w-16 rounded-full bg-pastel-blue/20 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pastel-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-display text-pastel-text">Your Link Will Expire</h3>
                <p className="text-pastel-text/80">Your extended link only valid for 7 days, cause I don't wanna pay for more storage!</p>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="w-full py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
              <FaqSection />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 md:py-12 bg-pastel-bg">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-pastel-text mb-1 flex items-center justify-center gap-2">
              Built with <Coffee size={18} className="text-pastel-pink" /> and with no single purpose
            </p>
            <p className="text-pastel-text/70 text-sm">
              © {new Date().getFullYear()} - I don't know how to build a good website. So advise me <a href="https://github.com/nurwandi" className="text-pastel-blue hover:underline" target="_blank" rel="noopener noreferrer">here</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
