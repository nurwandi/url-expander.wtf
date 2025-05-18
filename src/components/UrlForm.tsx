
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { expandUrl } from '@/utils/urlExpander';
import { useIsMobile } from '@/hooks/use-mobile';

interface UrlFormProps {
  onUrlExpanded: (expandedUrl: string) => void;
}

const UrlForm: React.FC<UrlFormProps> = ({ onUrlExpanded }) => {
  const [url, setUrl] = useState('');
  const [isExpanding, setIsExpanding] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error("Hey friend! You forgot to enter a URL. I need something to work with here!");
      return;
    }
    
    // Check for valid URL format
    try {
      // If URL doesn't have protocol, add https://
      const urlToCheck = url.startsWith('http') ? url : `https://${url}`;
      new URL(urlToCheck);
      
      setIsExpanding(true);
      
      try {
        // Expand the URL with our service
        const expanded = await expandUrl(url);
        onUrlExpanded(expanded);
        toast.success("URL unnecessarily expanded! It's completely ridiculous now!");
      } catch (error) {
        console.error("Error expanding URL:", error);
        toast.error("Something went wrong while expanding your URL. Please try again.");
      } finally {
        setIsExpanding(false);
      }
      
    } catch (error) {
      toast.error("That doesn't look like a valid URL. Even I have standards!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Enter your boring short URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="px-4 py-6 text-base bg-white border-2 border-pastel-blue text-pastel-text rounded-xl shadow-sm focus-visible:ring-2 focus-visible:ring-pastel-blue focus-visible:ring-offset-1"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isExpanding}
          className={`bg-pastel-pink hover:bg-pastel-pink/90 text-white font-bold text-base px-8 py-6 rounded-xl shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all ${isExpanding ? 'opacity-80' : ''}`}
        >
          {isExpanding ? "EXPANDING..." : "EXPAND URL"}
        </Button>
      </div>
    </form>
  );
};

export default UrlForm;
