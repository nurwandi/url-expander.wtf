
import { supabase } from '@/integrations/supabase/client';

// URL mapping types
export interface UrlMapping {
  id: string
  original_url: string
  expanded_code: string
  created_at: string
  expires_at: string
}

// Function to store a URL mapping
export async function storeUrlMapping(originalUrl: string, expandedCode: string): Promise<UrlMapping | null> {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

  const { data, error } = await supabase
    .from('url_mappings')
    .insert([
      { 
        original_url: originalUrl,
        expanded_code: expandedCode,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error storing URL mapping:', error)
    return null
  }

  return data
}

// Function to retrieve a URL mapping
export async function getUrlMapping(code: string): Promise<UrlMapping | null> {
  const { data, error } = await supabase
    .from('url_mappings')
    .select('*')
    .eq('expanded_code', code)
    .single()

  if (error) {
    console.error('Error retrieving URL mapping:', error)
    return null
  }

  // Check if URL has expired
  if (data && new Date(data.expires_at) < new Date()) {
    console.log('URL has expired')
    return null
  }

  return data
}
