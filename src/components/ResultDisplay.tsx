
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { getExpirationDate, getRandomJoke } from '@/utils/urlExpander';
import { Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResultDisplayProps {
  expandedUrl: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ expandedUrl }) => {
  const [joke, setJoke] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (expandedUrl) {
      setJoke(getRandomJoke());
      setExpirationDate(getExpirationDate());
      
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
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  if (!expandedUrl) return null;
  
  return (
    <div className="w-full" ref={resultRef}>
      <Card className="overflow-hidden relative bg-gray-50 dark:bg-anthropic-slate-light border border-gray-200 dark:border-anthropic-cream-subtle transition-colors duration-200">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-anthropic-rust transition-colors duration-200" />

        <div className="space-y-8 p-8 md:p-10">
          <div>
            <h3 className="text-xl md:text-2xl font-medium text-gray-900 dark:text-anthropic-cream mb-4 transition-colors duration-200">Your Unnecessarily Long URL:</h3>
            <div className="bg-white dark:bg-anthropic-slate-dark p-6 border border-gray-200 dark:border-anthropic-cream-subtle transition-colors duration-200">
              <p className="font-mono text-sm md:text-base text-gray-900 dark:text-anthropic-cream break-all transition-colors duration-200">{expandedUrl}</p>
            </div>

            <div className="flex mt-6">
              <Button
                onClick={copyToClipboard}
                className={`${copied ? 'bg-gray-900 dark:bg-anthropic-slate-dark border-gray-900 dark:border-anthropic-cream' : 'bg-anthropic-rust border-anthropic-rust'} text-white dark:text-anthropic-cream hover:bg-anthropic-rust-muted flex items-center gap-2 px-6 py-3 border transition-all duration-200`}
              >
                {copied ? (
                  <>
                    <CheckCircle size={isMobile ? 16 : 18} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={isMobile ? 16 : 18} /> Copy This Monstrosity
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-anthropic-cream-subtle pt-8 transition-colors duration-200">
            <div className="bg-white dark:bg-anthropic-slate-dark p-6 border border-gray-200 dark:border-anthropic-cream-subtle transition-colors duration-200">
              <p className="text-gray-600 dark:text-anthropic-cream-muted italic mb-0 text-sm md:text-base transition-colors duration-200">"{joke}"</p>
            </div>
          </div>

          <div className="bg-white dark:bg-anthropic-slate-medium p-6 border border-gray-200 dark:border-anthropic-cream-subtle transition-colors duration-200">
            <div className="flex items-start gap-4">
              <AlertTriangle size={isMobile ? 20 : 24} className="text-anthropic-rust mt-1 transition-colors duration-200" />
              <div>
                <h4 className="text-anthropic-rust text-lg font-medium mb-2 transition-colors duration-200">URL Expiration Notice:</h4>
                <p className="text-gray-900 dark:text-anthropic-cream text-sm md:text-base transition-colors duration-200">This URL will self-destruct on: <span className="font-medium">{expirationDate}</span></p>
                <p className="text-gray-600 dark:text-anthropic-cream-muted mt-2 text-xs md:text-sm transition-colors duration-200">This URL is approximately {expandedUrl.length} characters long, which is {Math.round(expandedUrl.length / 20)} tweets worth of characters. Use responsibly.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResultDisplay;
