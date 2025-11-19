
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
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-the-frick-card-beige/80 to-the-frick-card-beige backdrop-blur-sm border-2 border-the-frick-rust/20 transition-all duration-500 hover:border-the-frick-rust/40 hover:shadow-2xl hover:shadow-the-frick-rust/10"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Animated circle background */}
        <div
          className={`absolute rounded-full border-[35px] border-the-frick-rust/10 blur-md transition-all duration-700 ease-out ${
            hovering
              ? 'w-[140px] h-[140px] -top-[30%] left-[50%]'
              : 'w-[100px] h-[100px] -top-[40%] -left-[20%]'
          }`}
          style={{
            transform: hovering ? 'translateX(-50%)' : 'none'
          }}
        />

        {/* Content area */}
        <div className="relative z-10 p-6 md:p-8 flex flex-col min-h-[280px]">
          {/* Text section */}
          <div className="flex-grow space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold text-the-frick-text">
              {title}
            </h3>

            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-the-frick-rust/20 max-h-32 overflow-y-auto">
              <p className="font-mono text-sm md:text-base text-the-frick-text break-all">
                {expandedUrl}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-the-frick-text-muted">
              <div className="flex items-center gap-2 bg-white/40 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4 text-the-frick-rust" />
                <span>Expires: {expirationDate}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/40 px-3 py-1.5 rounded-full">
                <BarChart3 className="w-4 h-4 text-the-frick-rust" />
                <span>{expandedUrl.length} chars</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex mt-6 border-t border-the-frick-rust/20 -mx-6 md:-mx-8">
            <button
              onClick={copyToClipboard}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/40 hover:bg-white/60 transition-all duration-200 border-r border-the-frick-rust/20 group"
            >
              <Copy className={`w-5 h-5 transition-colors duration-200 ${copied ? 'text-green-600' : 'text-the-frick-rust group-hover:text-the-frick-rust/80'}`} />
              <span className="font-medium text-the-frick-text">
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </button>

            <button
              onClick={openInNewTab}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/40 hover:bg-white/60 transition-all duration-200 border-r border-the-frick-rust/20 group"
            >
              <ExternalLink className="w-5 h-5 text-the-frick-rust group-hover:text-the-frick-rust/80 transition-colors duration-200" />
              <span className="font-medium text-the-frick-text">Open</span>
            </button>

            <button
              onClick={shareUrl}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/40 hover:bg-white/60 transition-all duration-200 group"
            >
              <Share2 className="w-5 h-5 text-the-frick-rust group-hover:text-the-frick-rust/80 transition-colors duration-200" />
              <span className="font-medium text-the-frick-text">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
