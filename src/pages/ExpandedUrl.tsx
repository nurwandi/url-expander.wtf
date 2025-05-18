
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getUrlMapping } from '@/lib/supabase';

const ExpandedUrl = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!code) {
      toast.error("Invalid URL code");
      navigate('/');
      return;
    }
    
    const fetchAndRedirect = async () => {
      try {
        // First try to get the URL from Supabase
        const mapping = await getUrlMapping(code);
        
        if (mapping && mapping.original_url) {
          // URL found in database, redirect to it
          window.location.href = mapping.original_url;
          return;
        }
        
        // If not found in database, try to parse from URL (backward compatibility)
        try {
          // The expanded URL format includes the original URL as a base64 component
          const parts = code.split('_');
          if (parts.length > 2) {
            const encodedUrl = parts[parts.length - 1];
            const decodedUrl = atob(encodedUrl);
            
            // Validate that it's a proper URL before redirecting
            if (decodedUrl.startsWith('http')) {
              window.location.href = decodedUrl;
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
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAndRedirect();
  }, [code, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Redirecting you...</h1>
          {isLoading && (
            <div className="w-16 h-16 border-4 border-t-transparent border-gray-800 dark:border-white rounded-full animate-spin"></div>
          )}
          <p className="mt-4 text-gray-600 dark:text-gray-300">Please wait while we process your unnecessarily long URL</p>
        </div>
      </div>
    </div>
  );
};

export default ExpandedUrl;
