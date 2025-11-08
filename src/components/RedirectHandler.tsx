import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const RedirectHandler = () => {
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      // Extract code from path (remove leading slash)
      const code = location.pathname.slice(1);

      console.log('[REDIRECT] Component mounted, pathname:', location.pathname);
      console.log('[REDIRECT] Extracted code:', code);

      // Ignore known routes
      const knownRoutes = ['dashboard', 'e'];
      if (knownRoutes.some(route => code.startsWith(route)) || code === '') {
        console.log('[REDIRECT] Ignoring known route or empty path');
        return;
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

        console.log('[REDIRECT] Redirecting to:', originalUrl);

        // Redirect to original URL
        window.location.href = originalUrl;
      } catch (err) {
        console.error('[REDIRECT] Error:', err);
        setError('An error occurred while redirecting');
      }
    };

    fetchAndRedirect();
  }, [location]);

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

  return (
    <div className="min-h-screen bg-the-frick-bg flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-the-frick-rust mx-auto mb-4" />
        <p className="text-the-frick-text-muted">Redirecting...</p>
      </div>
    </div>
  );
};

export default RedirectHandler;
