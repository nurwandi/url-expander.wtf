
import { useState } from 'react';
import { expandUrl } from '@/utils/urlExpander';
import { toast } from 'sonner';

export function useUrlExpander() {
  const [isExpanding, setIsExpanding] = useState(false);
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null);

  const expandUrlWithStatus = async (url: string) => {
    if (!url.trim()) {
      toast.error("Please enter a URL to expand");
      return null;
    }
    
    setIsExpanding(true);
    
    try {
      // Expand the URL with our service
      const expanded = await expandUrl(url);
      setExpandedUrl(expanded);
      return expanded;
    } catch (error) {
      console.error("Error expanding URL:", error);
      toast.error("Something went wrong while expanding your URL. Please try again.");
      return null;
    } finally {
      setIsExpanding(false);
    }
  };

  return {
    isExpanding,
    expandedUrl,
    expandUrlWithStatus,
  };
}
