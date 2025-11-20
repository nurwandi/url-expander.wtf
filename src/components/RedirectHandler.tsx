import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Clock, ExternalLink } from 'lucide-react';
import HamsterLoader from '@/components/ui/hamster-loader';

const RedirectHandler = () => {
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [redirectInfo, setRedirectInfo] = useState<{ url: string; countdown: number; code: string } | null>(null);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      console.log('[REDIRECT] Component mounted, pathname:', location.pathname);

      // Extract code from path
      let code = location.pathname.slice(1); // Remove leading slash

      // Check if path starts with /e/
      if (code.startsWith('e/')) {
        code = code.slice(2); // Remove 'e/' prefix
        console.log('[REDIRECT] Extracted code from /e/ route:', code);
      } else {
        // Ignore known routes that are NOT /e/
        const knownRoutes = ['dashboard'];
        if (knownRoutes.some(route => code.startsWith(route)) || code === '') {
          console.log('[REDIRECT] Ignoring known route or empty path');
          return;
        }
        console.log('[REDIRECT] Extracted code from root route:', code);
      }

      try {
        // Don't double-encode - the code from pathname is already properly formatted
        // Use it as-is in the URL path
        const apiUrl = `https://e4lqku9uee.execute-api.ap-southeast-3.amazonaws.com/v1/url-mappings/${code}`;
        console.log('[REDIRECT] Fetching from API URL:', apiUrl);

        const response = await fetch(apiUrl);

        console.log('[REDIRECT] Response status:', response.status);
        console.log('[REDIRECT] Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('[REDIRECT] Error response body:', errorText);

          if (response.status === 404) {
            setError('URL not found or expired');
          } else {
            setError(`Failed to fetch URL (${response.status})`);
          }
          return;
        }

        const responseData = await response.json();
        const originalUrl = responseData.data?.original_url || responseData.original_url;

        if (!originalUrl) {
          setError('Invalid URL data received');
          return;
        }

        console.log('[REDIRECT] Will redirect to:', originalUrl);

        // Show redirect page with countdown
        setRedirectInfo({ url: originalUrl, countdown: 3, code });
      } catch (err) {
        console.error('[REDIRECT] Error:', err);
        setError('An error occurred while redirecting');
      }
    };

    fetchAndRedirect();
  }, [location.pathname]);

  // Countdown and redirect effect
  useEffect(() => {
    if (!redirectInfo) return;

    // Increment click count when redirect page is shown (only once)
    if (redirectInfo.countdown === 3) {
      fetch(`https://e4lqku9uee.execute-api.ap-southeast-3.amazonaws.com/v1/url-mappings/${redirectInfo.code}/click`, {
        method: 'POST'
      }).catch(err => console.error('[REDIRECT] Failed to increment click count:', err));
    }

    // Countdown timer
    if (redirectInfo.countdown > 0) {
      const timer = setTimeout(() => {
        setRedirectInfo({ ...redirectInfo, countdown: redirectInfo.countdown - 1 });
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Redirect when countdown reaches 0
      window.location.href = redirectInfo.url;
    }
  }, [redirectInfo]);

  if (error) {
    return (
      <div className="min-h-screen bg-the-frick-bg flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="bg-white border-4 border-the-frick-text rounded-lg shadow-[12px_12px_0_0_#1A1A1A] p-8 md:p-12 relative overflow-hidden">
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
              backgroundImage: `linear-gradient(to right, rgba(26, 26, 26, 0.03) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(26, 26, 26, 0.03) 1px, transparent 1px)`,
              backgroundSize: '8px 8px',
              zIndex: 1
            }} />

            <div className="relative z-10 text-center">
              <h1 className="text-3xl md:text-4xl font-black font-display text-the-frick-text mb-4 uppercase tracking-tight">
                Oops!
              </h1>
              <p className="text-the-frick-text-muted text-base md:text-lg mb-8 font-medium">{error}</p>
              <a
                href="/"
                className="inline-block bg-the-frick-rust text-white px-6 py-3 border-3 border-the-frick-text shadow-[4px_4px_0_0_#1A1A1A] hover:shadow-[6px_6px_0_0_#1A1A1A] hover:-translate-y-0.5 transition-all font-black uppercase tracking-wide text-sm"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show redirect page with countdown
  if (redirectInfo) {
    return (
      <div className="min-h-screen bg-the-frick-bg flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white border-4 border-the-frick-text rounded-lg shadow-[12px_12px_0_0_#1A1A1A] p-8 sm:p-10 md:p-12 relative overflow-hidden">
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
              backgroundImage: `linear-gradient(to right, rgba(26, 26, 26, 0.03) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(26, 26, 26, 0.03) 1px, transparent 1px)`,
              backgroundSize: '8px 8px',
              zIndex: 1
            }} />

            <div className="relative z-10">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-the-frick-rust border-4 border-the-frick-text flex items-center justify-center rotate-6">
                  <Clock className="h-8 w-8 text-white" />
                </div>

                <div className="space-y-3">
                  <div className="text-2xl md:text-3xl font-black font-display text-the-frick-text uppercase tracking-tight">
                    Redirecting you...
                  </div>

                  <p className="text-base md:text-lg font-black text-the-frick-rust uppercase tracking-wide pt-2">
                    Redirecting in {redirectInfo.countdown} seconds...
                  </p>
                </div>

                <div className="w-full max-w-sm sm:max-w-md mt-4">
                  <div className="w-full h-3 bg-the-frick-card-beige border-2 border-the-frick-text rounded overflow-hidden">
                    <div
                      className="h-full bg-the-frick-rust transition-all duration-1000 ease-linear"
                      style={{width: `${(3 - redirectInfo.countdown) / 3 * 100}%`}}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-the-frick-text-muted mb-3 font-medium">
                    You will be redirected to:
                  </p>

                  <div className="bg-the-frick-card-beige/50 p-3 border-2 border-the-frick-text rounded mb-6 max-w-md">
                    <a
                      href={redirectInfo.url}
                      className="text-the-frick-rust hover:underline break-all text-xs md:text-sm font-mono"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {redirectInfo.url}
                    </a>
                  </div>

                  <button
                    onClick={() => window.location.href = redirectInfo.url}
                    className="inline-flex items-center gap-2 bg-the-frick-rust text-white px-6 py-3 border-3 border-the-frick-text shadow-[4px_4px_0_0_#1A1A1A] hover:shadow-[6px_6px_0_0_#1A1A1A] hover:-translate-y-0.5 transition-all font-black uppercase tracking-wide text-sm"
                  >
                    <span>Go Now</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen bg-the-frick-bg flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white border-4 border-the-frick-text rounded-lg shadow-[12px_12px_0_0_#1A1A1A] p-8 sm:p-10 md:p-12 relative overflow-hidden">
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
            backgroundImage: `linear-gradient(to right, rgba(26, 26, 26, 0.03) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(26, 26, 26, 0.03) 1px, transparent 1px)`,
            backgroundSize: '8px 8px',
            zIndex: 1
          }} />

          <div className="relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 py-8">
              <HamsterLoader />

              <div className="text-lg sm:text-xl md:text-2xl font-black font-display text-the-frick-text uppercase tracking-tight">
                Processing URL...
              </div>

              <p className="text-sm text-the-frick-text-muted font-medium">
                Our server hamsters are running to process your URL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedirectHandler;
