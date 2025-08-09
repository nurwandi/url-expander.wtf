
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
      <Card className="overflow-hidden relative bg-white dark:bg-dark-surface rounded-xl border-none shadow-md transition-colors duration-200">
        <div className="absolute top-0 left-0 w-full h-1 bg-pastel-blue dark:bg-blue-400 transition-colors duration-200" />
        
        <div className="space-y-6 p-6 md:p-8">
          <div>
            <h3 className="text-xl md:text-2xl font-display font-bold text-pastel-pink dark:text-pink-400 mb-4 transition-colors duration-200">Your Unnecessarily Long URL:</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <p className="font-mono text-sm md:text-base text-pastel-text dark:text-dark-text break-all transition-colors duration-200">{expandedUrl}</p>
            </div>
            
            <div className="flex mt-5">
              <Button 
                onClick={copyToClipboard}
                className={`${copied ? 'bg-pastel-mint dark:bg-emerald-500' : 'bg-pastel-blue dark:bg-blue-500'} text-white hover:bg-opacity-90 dark:hover:bg-opacity-80 flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 shadow-sm`}
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
          
          <div className="border-t border-gray-100 dark:border-gray-700 pt-6 transition-colors duration-200">
            <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl transition-colors duration-200">
              <p className="text-pastel-text dark:text-dark-text italic mb-0 text-sm md:text-base transition-colors duration-200">"{joke}"</p>
            </div>
          </div>
          
          <div className="bg-pastel-pink/10 dark:bg-pink-900/20 p-5 rounded-xl transition-colors duration-200">
            <div className="flex items-start gap-3">
              <AlertTriangle size={isMobile ? 20 : 24} className="text-pastel-pink dark:text-pink-400 mt-1 transition-colors duration-200" />
              <div>
                <h4 className="text-pastel-pink dark:text-pink-400 text-lg font-medium mb-2 transition-colors duration-200">URL Expiration Notice:</h4>
                <p className="text-pastel-text dark:text-dark-text text-sm md:text-base transition-colors duration-200">This URL will self-destruct on: <span className="font-medium">{expirationDate}</span></p>
                <p className="text-pastel-text/70 dark:text-dark-text/70 mt-2 text-xs md:text-sm transition-colors duration-200">This URL is approximately {expandedUrl.length} characters long, which is {Math.round(expandedUrl.length / 20)} tweets worth of characters. Use responsibly.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResultDisplay;
