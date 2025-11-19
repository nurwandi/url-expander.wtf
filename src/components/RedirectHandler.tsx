import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader2, ExternalLink } from 'lucide-react';

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
        <div className="text-center">
          <h1 className="text-4xl font-bold font-display text-the-frick-text mb-4">
            Oops!
          </h1>
          <p className="text-the-frick-text-muted text-lg mb-8">{error}</p>
          <a
            href="/"
            className="inline-block bg-the-frick-rust text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // Show redirect page with countdown
  if (redirectInfo) {
    return (
      <div className="min-h-screen bg-the-frick-bg flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-the-frick-card-beige rounded-3xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-the-frick-text mb-6">
              Redirecting...
            </h1>

            <div className="flex items-center justify-center mb-8">
              <div className="text-6xl md:text-8xl font-bold text-the-frick-rust">
                {redirectInfo.countdown}
              </div>
            </div>

            <p className="text-lg text-the-frick-text-muted mb-6">
              You will be redirected to:
            </p>

            <div className="bg-white/50 p-4 rounded-2xl mb-8">
              <a
                href={redirectInfo.url}
                className="text-the-frick-rust hover:underline break-all text-sm md:text-base"
                target="_blank"
                rel="noopener noreferrer"
              >
                {redirectInfo.url}
              </a>
            </div>

            <button
              onClick={() => window.location.href = redirectInfo.url}
              className="inline-flex items-center gap-2 bg-the-frick-rust text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity font-medium"
            >
              <span>Go Now</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen bg-the-frick-bg flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-the-frick-rust mx-auto mb-4" />
        <p className="text-the-frick-text-muted">Loading...</p>
      </div>
    </div>
  );
};

export default RedirectHandler;
