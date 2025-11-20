import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BorderBeam } from '@/components/ui/border-beam';
import { ExternalLink, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface UrlItem {
  id: string;
  code: string;
  original_url: string;
  created_at: string;
  expires_at: string;
  click_count: number;
  expanded_url: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, getIdToken } = useAuth();
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pressingId, setPressingId] = useState<string | null>(null);
  const pressTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Cache configuration
  const CACHE_KEY = 'user_urls_cache';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    fetchUserUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate]);

  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp, userId } = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid and belongs to current user
      if (userId === user?.sub && (now - timestamp) < CACHE_DURATION) {
        console.log('[CACHE] Using cached URLs, age:', Math.round((now - timestamp) / 1000), 'seconds');
        return data;
      }

      // Cache expired or wrong user
      console.log('[CACHE] Cache expired or invalid');
      return null;
    } catch (error) {
      console.error('[CACHE] Error reading cache:', error);
      return null;
    }
  };

  const setCachedData = (data: UrlItem[]) => {
    try {
      const cacheObject = {
        data,
        timestamp: Date.now(),
        userId: user?.sub
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
      console.log('[CACHE] URLs cached successfully');
    } catch (error) {
      console.error('[CACHE] Error writing cache:', error);
    }
  };

  const fetchUserUrls = async (forceRefresh = false) => {
    try {
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedUrls = getCachedData();
        if (cachedUrls) {
          setUrls(cachedUrls);
          setLoading(false);
          return;
        }
      }

      console.log('[API] Fetching URLs from DynamoDB...');

      const token = await getIdToken();
      if (!token) {
        toast.error('Authentication required');
        navigate('/');
        return;
      }

      const response = await fetch(
        'https://e4lqku9uee.execute-api.ap-southeast-3.amazonaws.com/v1/users/me/urls',
        {
          headers: {
            'Authorization': token,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }

      const data = await response.json();
      const urlsData = data.urls || [];

      setUrls(urlsData);
      setCachedData(urlsData);

      if (forceRefresh) {
        toast.success('URLs refreshed!');
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
      toast.error('Failed to load your URLs');
    } finally {
      setLoading(false);
    }
  };

  const handlePressStart = (urlId: string, text: string) => {
    // Clear any existing timer
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }

    setPressingId(urlId);

    // Set timer for 1 second
    pressTimerRef.current = setTimeout(() => {
      navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
      setPressingId(null);
      pressTimerRef.current = null;
    }, 1000);
  };

  const handlePressEnd = () => {
    // Clear timer if released before 1 second
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setPressingId(null);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const getStatusClass = (daysLeft: number) => {
    if (daysLeft <= 0) return 'expired';
    if (daysLeft <= 2) return 'expiring-soon';
    return 'active';
  };

  const getStatusText = (daysLeft: number) => {
    if (daysLeft <= 0) return 'Expired';
    if (daysLeft === 1) return '1 day left';
    if (daysLeft <= 2) return `${daysLeft} days left`;
    return `${daysLeft} days`;
  };

  return (
    <div className="min-h-screen bg-the-frick-bg text-the-frick-text">
      {/* Header - Brutalist */}
      <header className="py-4 md:py-6 sticky top-0 z-40 bg-the-frick-bg border-b-4 border-the-frick-text">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-base md:text-2xl font-black font-display cursor-pointer hover:translate-x-1 transition-transform uppercase tracking-tight">
              <span className="text-the-frick-text">url-expander</span>
              <span className="text-the-frick-rust">.wtf</span>
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <Button
              onClick={logout}
              className="bg-the-frick-rust text-white hover:translate-x-1 hover:-translate-y-1 rounded px-6 py-2.5 font-bold transition-transform border-3 border-the-frick-text uppercase tracking-wide text-sm shadow-[4px_4px_0_0_#1A1A1A] hover:shadow-[6px_6px_0_0_#1A1A1A] active:shadow-[2px_2px_0_0_#1A1A1A] active:translate-x-0.5 active:translate-y-0.5 focus-visible:ring-0 focus-visible:ring-offset-0"
              style={{borderWidth: '3px'}}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-the-frick-rust" />
          </div>
        ) : urls.length === 0 ? (
          <Card className="p-12 text-center bg-white dashboard-card border-0">
            <p className="text-lg text-the-frick-text-muted mb-4">
              You haven't created any URLs yet
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-the-frick-rust hover:bg-the-frick-rust/90 text-white ripple-button"
            >
              Create your first URL
            </Button>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            {urls.map((url) => {
              const daysLeft = getDaysUntilExpiry(url.expires_at);
              const statusClass = getStatusClass(daysLeft);
              const statusText = getStatusText(daysLeft);
              const isPressing = pressingId === url.id;

              return (
                <div
                  key={url.id}
                  className="dashboard-card p-6 flex flex-col gap-4 relative overflow-hidden group"
                >
                  {/* Border Beam - only on hover for active URLs */}
                  {daysLeft > 0 && (
                    <BorderBeam
                      size={250}
                      duration={12}
                      delay={0}
                      colorFrom="#CC7A63"
                      colorTo="#D4A574"
                      borderWidth={2}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  )}

                  {/* Header: Status dot + Click badge */}
                  <div className="flex items-start justify-between gap-3 relative z-10">
                    {/* Status indicator */}
                    <div className="flex items-center gap-2">
                      <span className={`status-dot ${statusClass}`} />
                      <span className={`text-sm font-medium ${
                        statusClass === 'expired' ? 'text-the-frick-text-muted' :
                        statusClass === 'expiring-soon' ? 'text-the-frick-rust' :
                        'text-the-frick-text'
                      }`}>
                        {statusText}
                      </span>
                    </div>

                    {/* Click counter badge (from comments design) */}
                    <div className="click-badge">
                      <span className="click-badge-count">{url.click_count}</span>
                      <span className="click-badge-label">Views</span>
                    </div>
                  </div>

                  {/* Original URL */}
                  <div className="relative z-10">
                    <label className="text-xs font-semibold text-the-frick-text-muted uppercase tracking-wide mb-1 block">
                      Original
                    </label>
                    <a
                      href={url.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-the-frick-text hover:text-the-frick-rust transition-colors inline-flex items-center gap-1.5 group/link"
                      title={url.original_url}
                    >
                      <span className="truncate max-w-[240px] block">{url.original_url}</span>
                      <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 opacity-60 group-hover/link:opacity-100" />
                    </a>
                  </div>

                  {/* Expanded URL - Brutalist Box */}
                  <div className="bg-the-frick-card-beige border-2 border-the-frick-text rounded p-3 relative z-10 shadow-[3px_3px_0_rgba(26,26,26,0.2)]">
                    <label className="text-xs font-bold text-the-frick-text uppercase tracking-wider mb-1.5 block">
                      Expanded URL
                    </label>
                    <code className="text-xs text-the-frick-text block break-all font-mono font-semibold">
                      url-expander.wtf/e/{url.code}
                    </code>
                  </div>

                  {/* Created date */}
                  <div className="text-xs text-the-frick-text-muted/60 font-medium relative z-10">
                    Created {formatDate(url.created_at)}
                  </div>

                  {/* Actions */}
                  <div className="mt-2 relative z-10">
                    {/* Long Press Copy Button (1 second) */}
                    <button
                      onMouseDown={() => handlePressStart(url.id, `https://url-expander.wtf/e/${url.code}`)}
                      onMouseUp={handlePressEnd}
                      onMouseLeave={handlePressEnd}
                      onTouchStart={() => handlePressStart(url.id, `https://url-expander.wtf/e/${url.code}`)}
                      onTouchEnd={handlePressEnd}
                      className="relative w-full overflow-hidden rounded-lg select-none"
                    >
                      {/* Progress bar indicator */}
                      {isPressing && (
                        <div
                          className="absolute bottom-0 left-0 h-1 bg-white/50 animate-[progress_1s_linear_forwards]"
                          style={{
                            width: '0%',
                            animation: 'progress 1s linear forwards'
                          }}
                        />
                      )}

                      <span
                        className={cn(
                          "absolute inset-0 translate-y-full transition-transform duration-300 ease-in-out",
                          isPressing && "translate-y-0",
                          "flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold",
                          "bg-the-frick-text text-white"
                        )}
                      >
                        <Check className="h-4 w-4" />
                        Copying!
                      </span>
                      <span className={cn(
                        "transition-transform duration-300 ease-in-out",
                        isPressing && "-translate-y-full",
                        "flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold",
                        "bg-the-frick-rust text-white"
                      )}>
                        {isPressing ? 'Hold...' : 'Copy URL'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
