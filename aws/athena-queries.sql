-- ============================================================================
-- CloudFront Logs Analytics - Saved Queries from Athena
-- Exported: Sun Nov  9 21:51:57 WIB 2025
-- ============================================================================


-- ============================================================================
-- Query 1: [ANALYTICS] Scrape Visitors and Bots
-- Description: No description
-- ============================================================================
  SELECT c_ip,
         c_country,
         cs_user_agent,
         CASE
           WHEN LOWER(cs_user_agent) LIKE '%mobile%' OR LOWER(cs_user_agent) LIKE '%android%' OR LOWER(cs_user_agent) LIKE '%iphone%' THEN 'Mobile'
           WHEN LOWER(cs_user_agent) LIKE '%tablet%' OR LOWER(cs_user_agent) LIKE '%ipad%' THEN 'Tablet'
           ELSE 'Desktop'
         END as device_type,
         COUNT(*) as total_requests,
         COUNT(DISTINCT cs_uri_stem) as unique_pages,
         MIN(log_date) as first_seen,
         MAX(log_date) as last_seen
  FROM cloudfront_url_expander_logs.standard_logs
  WHERE log_date >= CURRENT_DATE - INTERVAL '30' DAY
  GROUP BY c_ip, c_country, cs_user_agent
  ORDER BY total_requests DESC
  LIMIT 500;


-- ============================================================================
-- Query 2: [ANALYTICS] Mobile vs Desktop Traffic
-- Description: No description
-- ============================================================================
  SELECT
    CASE
      WHEN LOWER(cs_user_agent) LIKE '%mobile%' OR LOWER(cs_user_agent) LIKE '%android%' OR LOWER(cs_user_agent) LIKE '%iphone%' THEN 'Mobile'
      WHEN LOWER(cs_user_agent) LIKE '%tablet%' OR LOWER(cs_user_agent) LIKE '%ipad%' THEN 'Tablet'
      ELSE 'Desktop'
    END as device_type,
    COUNT(*) as requests,
    COUNT(DISTINCT c_ip) as unique_visitors
  FROM cloudfront_url_expander_logs.standard_logs
  WHERE log_date >= CURRENT_DATE - INTERVAL '7' DAY
  GROUP BY CASE
      WHEN LOWER(cs_user_agent) LIKE '%mobile%' OR LOWER(cs_user_agent) LIKE '%android%' OR LOWER(cs_user_agent) LIKE '%iphone%' THEN 'Mobile'
      WHEN LOWER(cs_user_agent) LIKE '%tablet%' OR LOWER(cs_user_agent) LIKE '%ipad%' THEN 'Tablet'
      ELSE 'Desktop'
    END
  ORDER BY requests DESC;


-- ============================================================================
-- Query 3: [ANALYTICS] Visitors
-- Description: No description
-- ============================================================================
  WITH first_visit AS (
    SELECT c_ip, MIN(log_date) as first_date
    FROM cloudfront_url_expander_logs.standard_logs
    GROUP BY c_ip
  )
  SELECT
    logs.c_ip,
    logs.c_country,
    CASE
      WHEN fv.first_date = logs.log_date THEN 'New'
      ELSE 'Returning'
    END as visitor_type,
    fv.first_date as first_visit_date,
    COUNT(*) as total_requests,
    COUNT(DISTINCT logs.log_date) as days_active
  FROM cloudfront_url_expander_logs.standard_logs logs
  LEFT JOIN first_visit fv ON logs.c_ip = fv.c_ip
  -- REMOVED: WHERE log_date >= CURRENT_DATE - INTERVAL '7' DAY
  GROUP BY logs.c_ip, logs.c_country,
           CASE WHEN fv.first_date = logs.log_date THEN 'New' ELSE 'Returning' END,
           fv.first_date
  ORDER BY total_requests DESC
  LIMIT 100;


-- ============================================================================
-- Query 4: [ANALYTICS] Traffic by Hour of Day
-- Description: No description
-- ============================================================================
  SELECT SUBSTRING(log_time, 1, 2) as hour,
         COUNT(*) as requests
  FROM cloudfront_url_expander_logs.standard_logs
  WHERE log_date >= CURRENT_DATE - INTERVAL '7' DAY
  GROUP BY SUBSTRING(log_time, 1, 2)
  ORDER BY hour;


-- ============================================================================
-- Query 5: [PERFORMANCE] Edge Location Performance
-- Description: No description
-- ============================================================================
  SELECT x_edge_location,
         COUNT(*) as requests,
         AVG(time_taken) as avg_response_time,
         AVG(time_to_first_byte) as avg_ttfb
  FROM cloudfront_url_expander_logs.standard_logs
  WHERE log_date >= CURRENT_DATE - INTERVAL '7' DAY
    AND time_taken IS NOT NULL
  GROUP BY x_edge_location
  ORDER BY requests DESC
  LIMIT 20;


-- ============================================================================
-- Query 6: [PERFORMANCE] Cache Hit Rate
-- Description: No description
-- ============================================================================
  SELECT x_edge_result_type,
         COUNT(*) as count,
         ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 2) as percentage
  FROM cloudfront_url_expander_logs.standard_logs
  WHERE log_date >= CURRENT_DATE - INTERVAL '7' DAY
  GROUP BY x_edge_result_type
  ORDER BY count DESC;


-- ============================================================================
-- Query 7: [PERFORMANCE] Average Response Time by URL
-- Description: No description
-- ============================================================================
  SELECT cs_uri_stem,
         COUNT(*) as requests,
         AVG(time_taken) as avg_time,
         MIN(time_taken) as min_time,
         MAX(time_taken) as max_time,
         APPROX_PERCENTILE(time_taken, 0.95) as p95_time
  FROM cloudfront_url_expander_logs.standard_logs
  WHERE log_date >= CURRENT_DATE - INTERVAL '7' DAY
    AND time_taken IS NOT NULL
  GROUP BY cs_uri_stem
  ORDER BY avg_time DESC
  LIMIT 50;


-- ============================================================================
-- Query 8: [PERFORMANCE] Slowest Requests
-- Description: No description
-- ============================================================================
  SELECT log_date, log_time, c_ip, cs_uri_stem, time_taken, x_edge_location
  FROM cloudfront_url_expander_logs.standard_logs
  WHERE log_date >= CURRENT_DATE - INTERVAL '7' DAY
    AND time_taken IS NOT NULL
  ORDER BY time_taken DESC
  LIMIT 100;


-- ============================================================================
-- Query 9: [SECURITY] Unusual Geographic Access
-- Description: No description
-- ============================================================================
  SELECT c_country,
         c_ip,
         COUNT(*) as requests
  FROM cloudfront_url_expander_logs.standard_logs
  WHERE log_date >= CURRENT_DATE - INTERVAL '7' DAY
  GROUP BY c_country, c_ip
  ORDER BY c_country, requests DESC;


-- ============================================================================
-- Query 10: [SECURITY] Detect SQL Injection Attempts
-- Description: No description
-- ============================================================================
  SELECT log_date, c_ip, cs_uri_stem, cs_uri_query
  FROM cloudfront_url_expander_logs.standard_logs
  WHERE log_date >= CURRENT_DATE - INTERVAL '7' DAY
    AND (
      LOWER(cs_uri_query) LIKE '%union%select%' OR
      LOWER(cs_uri_query) LIKE '%or%1=1%' OR
      LOWER(cs_uri_query) LIKE '%drop%table%' OR
      LOWER(cs_uri_query) LIKE '%<script%' OR
      LOWER(cs_uri_query) LIKE '%javascript:%'
    )
  ORDER BY log_date DESC
  LIMIT 100;


-- ============================================================================
-- Query 11: [SECURITY] Detect Suspicious User Agents
-- Description: No description
-- ============================================================================
  SELECT cs_user_agent, c_country, COUNT(*) as requests
  FROM cloudfront_url_expander_logs.standard_logs
  WHERE log_date >= CURRENT_DATE - INTERVAL '7' DAY
    AND (
      LOWER(cs_user_agent) LIKE '%bot%' OR
      LOWER(cs_user_agent) LIKE '%crawler%' OR
      LOWER(cs_user_agent) LIKE '%spider%' OR
      LOWER(cs_user_agent) LIKE '%scraper%' OR
      cs_user_agent = '-' OR
      cs_user_agent IS NULL
    )
  GROUP BY cs_user_agent, c_country
  ORDER BY requests DESC
  LIMIT 50;


-- ============================================================================
-- Query 12: [SECURITY] Detect 404 Not Found Patterns
-- Description: No description
-- ============================================================================
  SELECT c_ip, c_country, cs_uri_stem, COUNT(*) as not_found_count
  FROM cloudfront_url_expander_logs.standard_logs
  WHERE sc_status = 404
    AND log_date >= CURRENT_DATE - INTERVAL '7' DAY
  GROUP BY c_ip, c_country, cs_uri_stem
  HAVING COUNT(*) > 10
  ORDER BY not_found_count DESC
  LIMIT 50;


-- ============================================================================
-- Query 13: [SECURITY] Detect 403-401 Unauthorized Access Attempts
-- Description: No description
-- ============================================================================
  SELECT log_date, c_ip, c_country, cs_uri_stem, sc_status, COUNT(*) as attempts
  FROM cloudfront_url_expander_logs.standard_logs
  WHERE sc_status IN (401, 403)
    AND log_date >= CURRENT_DATE - INTERVAL '7' DAY
  GROUP BY log_date, c_ip, c_country, cs_uri_stem, sc_status
  ORDER BY attempts DESC
  LIMIT 100;

