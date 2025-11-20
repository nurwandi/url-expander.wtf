import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'sonner';
import { getUrlMapping } from '@/lib/aws';
import { Clock } from 'lucide-react';
import HamsterLoader from '@/components/ui/hamster-loader';

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
    <div className="min-h-screen bg-the-frick-bg text-the-frick-text flex flex-col">
      {/* Header - Brutalist */}
      <header className="py-4 md:py-6 sticky top-0 z-40 bg-the-frick-bg border-b-4 border-the-frick-text">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <RouterLink to="/">
            <h1 className="text-base md:text-2xl font-black font-display cursor-pointer hover:translate-x-1 transition-transform uppercase tracking-tight">
              <span className="text-the-frick-text">url-expander</span>
              <span className="text-the-frick-rust">.wtf</span>
            </h1>
          </RouterLink>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center w-full py-6 md:py-8">
        <div className="max-w-2xl mx-auto px-6 sm:px-8 md:px-12 w-full">
          <div className="bg-white border-4 border-the-frick-text rounded-lg shadow-[12px_12px_0_0_#1A1A1A] p-8 sm:p-10 md:p-12 relative overflow-hidden">
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
              backgroundImage: `linear-gradient(to right, rgba(26, 26, 26, 0.03) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(26, 26, 26, 0.03) 1px, transparent 1px)`,
              backgroundSize: '8px 8px',
              zIndex: 1
            }} />

            <div className="relative z-10">
              {isLoading ? (
                // Loading state with hamster
                <div className="flex flex-col items-center justify-center space-y-6 py-8">
                  <HamsterLoader />

                  <div className="text-lg sm:text-xl md:text-2xl font-black font-display text-the-frick-text uppercase tracking-tight">
                    Processing URL...
                  </div>

                  <p className="text-sm text-the-frick-text-muted font-medium">
                    Our server hamsters are running to process your URL
                  </p>
                </div>
              ) : (
                // Redirect state
                <div className="flex flex-col items-center space-y-6">
                  <div className="overflow-hidden rounded-lg border-4 border-the-frick-text shadow-[8px_8px_0_0_#1A1A1A] w-full max-w-xs sm:max-w-sm md:max-w-md">
                    <img
                      src={SURPRISE_IMAGE_URL}
                      alt="Surprise!"
                      className="w-full h-auto object-cover"
                    />
                  </div>

                  <div className="flex flex-col items-center text-center space-y-5 w-full">
                    <div className="w-16 h-16 bg-the-frick-rust border-4 border-the-frick-text flex items-center justify-center rotate-6">
                      <Clock className="h-8 w-8 text-white" />
                    </div>

                    <div className="space-y-3">
                      <div className="text-2xl md:text-3xl font-black font-display text-the-frick-text uppercase tracking-tight">
                        Redirecting you...
                      </div>

                      <p className="text-sm md:text-base text-the-frick-text font-medium max-w-md mx-auto">
                        {message}
                      </p>

                      <p className="text-base md:text-lg font-black text-the-frick-rust uppercase tracking-wide pt-2">
                        Redirecting in {countdown} seconds...
                      </p>
                    </div>

                    <div className="w-full max-w-sm sm:max-w-md mt-4">
                      <div className="w-full h-3 bg-the-frick-card-beige border-2 border-the-frick-text rounded overflow-hidden">
                        <div
                          className="h-full bg-the-frick-rust transition-all duration-1000 ease-linear"
                          style={{width: `${(5 - countdown) / 5 * 100}%`}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExpandedUrl;