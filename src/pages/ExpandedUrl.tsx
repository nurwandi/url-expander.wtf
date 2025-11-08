import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getUrlMapping } from '@/lib/aws';
import { useTheme } from '@/contexts/ThemeContext';
import { Clock, Link } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

// Array of satirical messages for the redirect screen
const SATIRICAL_MESSAGES = [
  "Goodness me, I can't believe you're using this dumbass URL",
  "Redirecting you to a website that actually makes sense...",
  "Unwrapping this absurd monstrosity of a link...",
  "Decoding this unnecessarily long URL, please hold...",
  "What kind of monster would use this URL? Redirecting anyway...",
  "This link is so long it could win a limbo contest. Redirecting...",
  "Converting this digital abomination back to a normal URL...",
  "Plot twist: You're using the internet's most inefficient link. Redirecting...",
  "Translating this URL from ridiculous back to reasonable...",
  "Our server hamsters are running extra fast to process this nonsense URL"
];

// URL for surprise image
const SURPRISE_IMAGE_URL = "https://asset-projects-905418210727.s3.ap-southeast-3.amazonaws.com/images/meme.jpg";

const ExpandedUrl = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  
  // Select a random message
  const [message] = useState(() => 
    SATIRICAL_MESSAGES[Math.floor(Math.random() * SATIRICAL_MESSAGES.length)]
  );
  
  useEffect(() => {
    if (!code) {
      toast.error("Invalid URL code");
      navigate('/');
      return;
    }
    
    const fetchUrl = async () => {
      try {
        // First try to get the URL from AWS DynamoDB
        const mapping = await getUrlMapping(code);
        
        if (mapping && mapping.original_url) {
          // URL found in database, store it to redirect later
          setOriginalUrl(mapping.original_url);
          setIsLoading(false);
          return;
        }
        
        // If not found in database, try to parse from URL (backward compatibility)
        try {
          // The expanded URL format includes the original URL as a base64 component
          const parts = code.split('_');
          if (parts.length > 2) {
            const encodedUrl = parts[parts.length - 1];
            const decodedUrl = atob(encodedUrl);
            
            // Validate that it's a proper URL before storing
            if (decodedUrl.startsWith('http')) {
              setOriginalUrl(decodedUrl);
              setIsLoading(false);
              return;
            }
          }
          throw new Error("URL not found");
        } catch (parseError) {
          console.error("Error parsing URL:", parseError);
          toast.error("This URL has expired or is invalid.");
          navigate('/');
        }
      } catch (error) {
        console.error("Error retrieving URL:", error);
        toast.error("Something went wrong with this URL. It may be invalid or expired.");
        navigate('/');
      }
    };
    
    fetchUrl();
  }, [code, navigate]);
  
  // Handle the countdown and redirection
  useEffect(() => {
    if (!isLoading && originalUrl) {
      const countdownInterval = setInterval(() => {
        setCountdown(prevCount => {
          if (prevCount <= 1) {
            clearInterval(countdownInterval);
            window.location.href = originalUrl;
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
      
      return () => clearInterval(countdownInterval);
    }
  }, [isLoading, originalUrl]);

  return (
    <div className="min-h-screen bg-anthropic-bg text-anthropic-text flex flex-col">
      {/* Header - matching landing page */}
      <header className="py-3 md:py-6 bg-anthropic-bg/80 backdrop-blur-md border-b border-anthropic-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold font-display">
            <span className="text-anthropic-text">url-expander</span>
            <span className="text-anthropic-rust">.wtf</span>
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center w-full py-6 md:py-8">
        <div className="max-w-2xl mx-auto px-6 sm:px-8 md:px-12 w-full">
          <div className="bg-[#E8DCC8] rounded-xl md:rounded-2xl lg:rounded-3xl p-8 sm:p-10 md:p-12">
            {isLoading ? (
              // Loading state
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 py-4 sm:py-8">
                <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full bg-anthropic-rust/20 flex items-center justify-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-3 sm:border-4 border-t-transparent border-anthropic-rust rounded-full animate-spin"></div>
                </div>

                <div className="text-lg sm:text-xl md:text-2xl font-bold font-display text-[#1A1A1A]">
                  Processing URL...
                </div>

                <div className="w-full max-w-md h-2 bg-anthropic-rust/20 rounded-full overflow-hidden">
                  <div className="h-full bg-anthropic-rust animate-pulse" style={{width: '70%'}}></div>
                </div>
              </div>
            ) : (
              // Redirect state
              <div className="flex flex-col items-center space-y-4 sm:space-y-5 md:space-y-6">
                <div className="overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md">
                  <img
                    src={SURPRISE_IMAGE_URL}
                    alt="Surprise!"
                    className="w-full h-auto object-cover"
                  />
                </div>

                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 md:space-y-5 w-full">
                  <div className="h-12 w-12 sm:h-13 sm:w-13 md:h-14 md:w-14 rounded-full bg-anthropic-rust/20 flex items-center justify-center">
                    <Clock className="h-6 w-6 sm:h-6 sm:w-6 md:h-7 md:w-7 text-anthropic-rust" />
                  </div>

                  <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-[#1A1A1A] leading-tight">
                      Redirecting you...
                    </div>

                    <p className="text-xs sm:text-sm md:text-base text-[#1A1A1A]/70 max-w-md mx-auto leading-relaxed px-2 sm:px-4">
                      {message}
                    </p>

                    <p className="text-sm sm:text-base md:text-lg font-bold text-anthropic-rust pt-1 sm:pt-2">
                      Redirecting in {countdown} seconds...
                    </p>
                  </div>

                  <div className="w-full max-w-sm sm:max-w-md mt-2 sm:mt-3 md:mt-4">
                    <div className="w-full h-2 bg-[#1A1A1A]/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-anthropic-rust transition-all duration-1000 ease-linear"
                        style={{width: `${(5 - countdown) / 5 * 100}%`}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExpandedUrl;