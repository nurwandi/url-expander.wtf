
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { expandUrl } from '@/utils/urlExpander';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { isValidUrl, normalizeUrl, isCommonInvalidInput } from '@/utils/urlValidator';

interface UrlFormProps {
  onUrlExpanded: (expandedUrl: string) => void;
}

const UrlForm: React.FC<UrlFormProps> = ({ onUrlExpanded }) => {
  const [url, setUrl] = useState('');
  const [isExpanding, setIsExpanding] = useState(false);
  const isMobile = useIsMobile();
  const { getAccessToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      toast.error("Hey friend! You forgot to enter a URL. I need something to work with here!");
      return;
    }

    // Check for common invalid inputs first
    if (isCommonInvalidInput(trimmedUrl)) {
      toast.error("That doesn't look like a valid URL. Try something like 'google.com' or 'https://example.com'");
      return;
    }

    // Validate URL format
    if (!isValidUrl(trimmedUrl)) {
      toast.error("Please enter a valid URL. Examples: google.com, https://github.com, example.org/path");
      return;
    }

    setIsExpanding(true);

    try {
      // Normalize the URL (add protocol if missing)
      const normalizedUrl = normalizeUrl(trimmedUrl);

      // Get access token if user is logged in
      const accessToken = await getAccessToken();

      // Expand the URL with our service
      const expanded = await expandUrl(normalizedUrl, accessToken);
      onUrlExpanded(expanded);
      toast.success("URL unnecessarily expanded! It's completely ridiculous now!");
    } catch (error) {
      console.error("Error expanding URL:", error);
      toast.error("Something went wrong while expanding your URL. Please try again.");
    } finally {
      setIsExpanding(false);
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
            className="px-5 py-6 text-base bg-white dark:bg-the-frick-slate-light border border-gray-300 dark:border-the-frick-cream-subtle text-gray-900 dark:text-the-frick-cream placeholder:text-gray-500 dark:placeholder:text-the-frick-cream-muted focus-visible:ring-1 focus-visible:ring-the-frick-rust focus-visible:border-the-frick-rust transition-all duration-200"
          />
        </div>

        <Button
          type="submit"
          disabled={isExpanding}
          className={`bg-the-frick-rust hover:bg-the-frick-rust-muted text-white dark:text-the-frick-cream font-medium text-base px-8 py-6 border border-the-frick-rust hover:border-the-frick-rust-muted transition-all duration-200 ${isExpanding ? 'opacity-70' : ''}`}
        >
          {isExpanding ? "Expanding..." : "Expand URL"}
        </Button>
      </div>
    </form>
  );
};

export default UrlForm;
