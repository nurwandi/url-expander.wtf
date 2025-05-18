
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getUrlMapping } from '@/lib/supabase';
import { Clock } from 'lucide-react';
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
const SURPRISE_IMAGE_URL = "https://surprise-for-sayang.s3.ap-southeast-2.amazonaws.com/url-extender.jpeg";

const ExpandedUrl = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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
        // First try to get the URL from Supabase
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
    <div className="flex flex-col h-screen bg-pastel-bg text-pastel-text">
      {/* Header consistent with main page */}
      <header className="py-4 md:py-5 bg-white shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold font-display header-title">
            <span className="text-bold-blue font-extrabold">url-</span>
            <span className="text-pastel-pink">expander</span>
            <span className="text-bold-blue font-extrabold">.wtf</span>
          </h1>
        </div>
      </header>

      {/* Main content that takes all available space */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className={`w-full max-w-md mx-auto p-6 ${isMobile ? 'h-auto' : 'h-auto max-h-[90vh]'} flex flex-col overflow-hidden`}>
          {isLoading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className="h-16 w-16 rounded-full bg-pastel-blue/20 flex items-center justify-center mb-2">
                <div className="w-10 h-10 border-4 border-t-transparent border-pastel-blue rounded-full animate-spin"></div>
              </div>
              
              <h1 className="text-2xl font-bold font-display text-pastel-text">Processing URL...</h1>
              
              <div className="w-full h-2 bg-pastel-blue/20 rounded-full overflow-hidden animate-pulse">
                <div className="h-full bg-pastel-blue animate-[slideIn_2s_ease-in-out_infinite]" style={{width: '70%'}}></div>
              </div>
            </div>
          ) : (
            // Redirect state
            <div className="flex flex-col items-center justify-between h-full">
              <div className="flex flex-col items-center text-center space-y-4 w-full">
                <div className="overflow-hidden rounded-lg w-full max-h-[50vh] flex-shrink-0">
                  <img 
                    src={SURPRISE_IMAGE_URL} 
                    alt="Surprise!" 
                    className="w-full h-auto object-cover"
                  />
                </div>
                
                <div className="h-12 w-12 rounded-full bg-pastel-blue/20 flex items-center justify-center mb-2">
                  <Clock className="h-8 w-8 text-pastel-pink" />
                </div>
                
                <div className="space-y-2 flex-grow">
                  <h1 className="text-xl md:text-2xl font-bold font-display text-pastel-text">Redirecting you...</h1>
                  
                  <p className="text-pastel-text/80 text-sm md:text-base">
                    {message}
                  </p>
                  
                  <p className="text-lg md:text-xl font-bold text-pastel-pink">
                    Redirecting in {countdown} seconds...
                  </p>
                </div>
              </div>
              
              <Progress 
                className="w-full h-2 mt-4 bg-pastel-blue/20" 
                value={(countdown / 5) * 100} 
              />
            </div>
          )}
        </Card>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-100 py-4 bg-pastel-bg">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-pastel-text text-xs md:text-sm mb-1 flex items-center justify-center gap-2">
              Built with <Clock size={18} className="text-pastel-pink" /> and with no single purpose
            </p>
            <p className="text-pastel-text/70 text-xs">
              © {new Date().getFullYear()} - I don't know how to build a good website. So advise me <a href="https://github.com/nurwandi" className="text-pastel-blue hover:underline" target="_blank" rel="noopener noreferrer">here</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ExpandedUrl;
