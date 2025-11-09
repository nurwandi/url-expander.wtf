import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, ExternalLink, Calendar, Clock, User, LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

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

  return (
    <div className="min-h-screen bg-the-frick-bg text-the-frick-text">
      {/* Header */}
      <header className="py-4 md:py-6 sticky top-0 z-40 bg-the-frick-bg/80 backdrop-blur-md border-b border-the-frick-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-xl md:text-2xl font-bold font-display cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-the-frick-text">url-expander</span>
              <span className="text-the-frick-rust">.wtf</span>
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <Button
              onClick={logout}
              className="bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] rounded-full px-6 py-2.5 font-medium transition-all shadow-sm"
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-the-frick-text mb-2">
            My URLs
          </h2>
          <p className="text-the-frick-text-muted">
            Manage and track your expanded URLs
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-the-frick-rust" />
          </div>
        ) : urls.length === 0 ? (
          <Card className="p-12 text-center bg-[#E8DCC8] border-0">
            <p className="text-lg text-the-frick-text-muted mb-4">
              You haven't created any URLs yet
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-the-frick-rust hover:bg-the-frick-rust/90 text-white"
            >
              Create your first URL
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:gap-6 w-full max-w-full">
            {urls.map((url) => {
              const daysLeft = getDaysUntilExpiry(url.expires_at);
              const isExpiringSoon = daysLeft <= 2;

              return (
                <Card
                  key={url.id}
                  className="p-4 md:p-6 bg-[#E8DCC8] border-0 overflow-hidden"
                >
                  <div className="flex flex-col gap-4 min-w-0 w-full">
                    {/* Original URL */}
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-the-frick-text-muted uppercase tracking-wide">
                        Original URL
                      </label>
                      <div className="mt-1 min-w-0 w-full">
                        <a
                          href={url.original_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm md:text-base text-the-frick-text hover:text-the-frick-rust transition-colors inline-flex items-center gap-2 truncate max-w-full"
                          title={url.original_url}
                        >
                          <span className="truncate">{url.original_url}</span>
                          <ExternalLink className="h-4 w-4 flex-shrink-0" />
                        </a>
                      </div>
                    </div>

                    {/* Expanded URL */}
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-the-frick-text-muted uppercase tracking-wide">
                        Expanded URL
                      </label>
                      <div className="flex items-start gap-3 mt-1 bg-white/50 p-3 md:p-4 rounded-lg min-w-0 w-full">
                        <code className="text-xs md:text-sm text-the-frick-text block break-all flex-1">
                          https://url-expander.wtf/e/{url.code}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(`https://url-expander.wtf/e/${url.code}`)}
                          className="hover:bg-transparent flex-shrink-0 p-0 h-auto mt-0.5"
                        >
                          <Copy className="h-4 w-4 text-the-frick-text" />
                        </Button>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-the-frick-text-muted">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="truncate">Created {formatDate(url.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className={`h-3 w-3 md:h-4 md:w-4 ${isExpiringSoon ? 'text-red-600' : ''}`} />
                        <span className={isExpiringSoon ? 'text-red-600 font-medium' : ''}>
                          {daysLeft > 0 ? `Expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}` : 'Expired'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
