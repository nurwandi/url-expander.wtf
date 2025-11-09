export const isValidUrl = (urlString: string): boolean => {
  if (!urlString || typeof urlString !== 'string') {
    return false;
  }

  // Remove whitespace
  const trimmed = urlString.trim();
  if (!trimmed) {
    return false;
  }

  // URL regex pattern for validation
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

  // Domain pattern for inputs without protocol
  const domainPattern = /^([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

  // Check if it has a protocol
  const hasProtocol = /^https?:\/\//i.test(trimmed);
  
  if (hasProtocol) {
    // If it has protocol, validate as full URL
    try {
      const url = new URL(trimmed);
      // Additional checks
      if (!url.hostname || url.hostname.includes(' ')) {
        return false;
      }
      // Must have at least one dot in hostname (e.g., google.com)
      if (!url.hostname.includes('.')) {
        return false;
      }
      return urlPattern.test(trimmed);
    } catch {
      return false;
    }
  } else {
    // If no protocol, validate as domain
    if (!domainPattern.test(trimmed)) {
      return false;
    }
    
    // Try to construct a URL with https protocol
    try {
      const url = new URL(`https://${trimmed}`);
      // Additional checks
      if (!url.hostname || url.hostname.includes(' ')) {
        return false;
      }
      // Must have at least one dot in hostname
      if (!url.hostname.includes('.')) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
};

export const normalizeUrl = (urlString: string): string => {
  const trimmed = urlString.trim();
  
  // If URL doesn't have protocol, add https://
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  
  return trimmed;
};

// Common invalid inputs that should be rejected
export const isCommonInvalidInput = (input: string): boolean => {
  const invalidPatterns = [
    /^[0-9]+$/,                    // Only numbers
    /^[a-zA-Z]+$/,                 // Only letters without dots
    /\s/,                          // Contains spaces
    /^\.+$/,                       // Only dots
    /^\//,                         // Starts with slash
    /^[^a-zA-Z0-9]/,              // Starts with special char (except protocol)
    /\.[^a-zA-Z0-9]/,             // Dot followed by special char
    /\.\./,                        // Double dots
    /\.$/,                         // Ends with dot
  ];

  const trimmed = input.trim();
  
  // Check for empty or too short
  if (!trimmed || trimmed.length < 4) {
    return true;
  }

  // Check against invalid patterns
  for (const pattern of invalidPatterns) {
    if (pattern.test(trimmed)) {
      // Exception for URLs with protocol
      if (pattern.source === '^[^a-zA-Z0-9]' && /^https?:\/\//i.test(trimmed)) {
        continue;
      }
      return true;
    }
  }

  return false;
};