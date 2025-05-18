
-- Enable the required extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a function to invoke our edge function
CREATE OR REPLACE FUNCTION invoke_cleanup_expired_urls()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  result text;
BEGIN
  SELECT net.http_post(
    url:='https://.supabase.co/functions/v1/cleanup-expired-urls',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer "}'::jsonb,
    body:='{}'::jsonb
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Schedule the job to run daily at midnight
SELECT cron.schedule(
  'cleanup-expired-urls-daily',
  '0 0 * * *',  -- Run at midnight every day (cron syntax: minute hour day month day_of_week)
  $$SELECT invoke_cleanup_expired_urls()$$
);
