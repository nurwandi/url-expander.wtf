
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { getExpirationDate } from '@/utils/urlExpander';
import { Copy, ExternalLink, Share2, Clock, BarChart3 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResultDisplayProps {
  expandedUrl: string;
}

const funnyTitles = [
  "Your Unnecessarily Long URL",
  "Behold! Your Monstrosity",
  "Your Beautiful Disaster",
  "This Ridiculous Thing You Created",
  "Your Absurdly Elongated Link",
  "The Monster You Summoned",
  "Your Gloriously Stupid URL",
  "This Magnificent Waste of Characters",
  "Your Hilariously Long Mess",
  "The Abomination You Requested",
  "Your Perfectly Impractical URL",
  "This Wonderfully Useless Thing",
  "Your Excessively Extended Link",
  "The Chaos You Unleashed",
  "Your Spectacularly Pointless URL"
];

const ResultDisplay: React.FC<ResultDisplayProps> = ({ expandedUrl }) => {
  const [expirationDate, setExpirationDate] = useState('');
  const [copied, setCopied] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [title, setTitle] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (expandedUrl) {
      setExpirationDate(getExpirationDate());
      setTitle(funnyTitles[Math.floor(Math.random() * funnyTitles.length)]);

      // Add a slight delay to ensure the component is rendered
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [expandedUrl]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(expandedUrl);
    setCopied(true);
    toast.success("Copied this monstrosity to your clipboard!");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const openInNewTab = () => {
    window.open(expandedUrl, '_blank', 'noopener,noreferrer');
    toast.success("Opening in new tab!");
  };

  const shareUrl = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this ridiculously long URL!',
          url: expandedUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      copyToClipboard();
    }
  };

  if (!expandedUrl) return null;

  return (
    <div className="w-full max-w-2xl mx-auto" ref={resultRef}>
      <div
        className="group relative overflow-hidden rounded-lg bg-white border-4 border-the-frick-text shadow-[12px_12px_0_0_#1A1A1A] transition-all duration-400 hover:shadow-[16px_16px_0_0_#1A1A1A] hover:-translate-y-1"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
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

        {/* Content area */}
        <div className="relative z-10 p-6 md:p-8 flex flex-col min-h-[280px]">
          {/* Text section */}
          <div className="flex-grow space-y-4">
            <h3 className="text-2xl md:text-3xl font-black text-the-frick-text uppercase tracking-tight">
              {title}
            </h3>

            <div className="bg-the-frick-card-beige p-4 rounded border-3 border-the-frick-text max-h-32 overflow-y-auto shadow-[4px_4px_0_0_rgba(26,26,26,0.2)]" style={{borderWidth: '3px'}}>
              <p className="font-mono text-sm md:text-base text-the-frick-text break-all font-semibold">
                {expandedUrl}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-the-frick-text">
              <div className="flex items-center gap-2 bg-white border-2 border-the-frick-text px-3 py-1.5 rounded font-bold uppercase tracking-wide">
                <Clock className="w-4 h-4 text-the-frick-rust" />
                <span>Expires: {expirationDate}</span>
              </div>
              <div className="flex items-center gap-2 bg-white border-2 border-the-frick-text px-3 py-1.5 rounded font-bold uppercase tracking-wide">
                <BarChart3 className="w-4 h-4 text-the-frick-rust" />
                <span>{expandedUrl.length} chars</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex mt-6 border-t-3 border-the-frick-text -mx-6 md:-mx-8" style={{borderTopWidth: '3px'}}>
            <button
              onClick={copyToClipboard}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-white hover:bg-the-frick-rust hover:text-white transition-all duration-200 border-r-3 border-the-frick-text font-bold uppercase tracking-wide text-sm"
              style={{borderRightWidth: '3px'}}
            >
              <Copy className="w-5 h-5" />
              <span>
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </button>

            <button
              onClick={openInNewTab}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-white hover:bg-the-frick-rust hover:text-white transition-all duration-200 border-r-3 border-the-frick-text font-bold uppercase tracking-wide text-sm"
              style={{borderRightWidth: '3px'}}
            >
              <ExternalLink className="w-5 h-5" />
              <span>Open</span>
            </button>

            <button
              onClick={shareUrl}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-white hover:bg-the-frick-rust hover:text-white transition-all duration-200 font-bold uppercase tracking-wide text-sm"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
