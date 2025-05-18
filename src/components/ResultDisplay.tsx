
import React, { useState, useEffect } from 'react';
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
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (expandedUrl) {
      setJoke(getRandomJoke());
      setExpirationDate(getExpirationDate());
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
    <div className="w-full">
      <Card className="overflow-hidden relative bg-white rounded-xl border-none shadow-md">
        <div className="absolute top-0 left-0 w-full h-1 bg-pastel-blue" />
        
        <div className="space-y-6 p-6 md:p-8">
          <div>
            <h3 className="text-xl md:text-2xl font-display font-bold text-pastel-pink mb-4">Your Unnecessarily Long URL:</h3>
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <p className="font-mono text-sm md:text-base text-pastel-text break-all">{expandedUrl}</p>
            </div>
            
            <div className="flex mt-5">
              <Button 
                onClick={copyToClipboard}
                className={`${copied ? 'bg-pastel-mint' : 'bg-pastel-blue'} text-white hover:bg-opacity-90 flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 shadow-sm`}
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
          
          <div className="border-t border-gray-100 pt-6">
            <div className="bg-gray-50 p-5 rounded-xl">
              <p className="text-pastel-text italic mb-0 text-sm md:text-base">"{joke}"</p>
            </div>
          </div>
          
          <div className="bg-pastel-pink/10 p-5 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle size={isMobile ? 20 : 24} className="text-pastel-pink mt-1" />
              <div>
                <h4 className="text-pastel-pink text-lg font-medium mb-2">URL Expiration Notice:</h4>
                <p className="text-pastel-text text-sm md:text-base">This URL will self-destruct on: <span className="font-medium">{expirationDate}</span></p>
                <p className="text-pastel-text/70 mt-2 text-xs md:text-sm">This URL is approximately {expandedUrl.length} characters long, which is {Math.round(expandedUrl.length / 20)} tweets worth of characters. Use responsibly.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResultDisplay;
