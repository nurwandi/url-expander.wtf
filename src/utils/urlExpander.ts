
import { storeUrlMapping } from '@/lib/aws';

// Generate a random string of specified length
const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Add some satirical and humorous phrases to make the URL unnecessarily long
const addSatiricalPhrases = (url: string): string => {
  const satiricalPhrases = [
    'why_would_anyone_use_this',
    'absolutely_pointless_expansion',
    'this_is_what_peak_engineering_looks_like',
    'suffering_from_success',
    'url_but_with_extra_steps',
    'weird_flex_but_ok',
    'when_400_characters_isnt_enough',
    'css_is_my_passion',
    'but_wait_theres_more',
    'your_scientists_were_so_preoccupied_with_whether_they_could',
    'they_didnt_stop_to_think_if_they_should',
    'just_because_I_can',
    'task_failed_successfully',
    'pro_developer_move',
    'js_framework_of_the_week',
    'galaxy_brain_engineering',
    'what_if_urls_but_too_much',
    'thanks_i_hate_it',
    'ceo_of_bad_decisions',
    'this_url_brought_to_you_by_raid_shadow_legends',
    'its_not_a_bug_its_a_feature',
    'definitely_not_a_rick_roll',
    'one_does_not_simply_shorten_a_url',
    'perfectly_balanced_as_all_things_should_be',
  ];
  
  let result = url;
  // Add a timestamp to make each expansion unique
  const timestamp = Date.now().toString();
  result += `_${timestamp}`;
  
  // Add 5-10 random phrases
  const numberOfPhrasesToAdd = Math.floor(Math.random() * 6) + 5;
  const usedPhrases = new Set();
  
  for (let i = 0; i < numberOfPhrasesToAdd; i++) {
    let phrase;
    do {
      phrase = satiricalPhrases[Math.floor(Math.random() * satiricalPhrases.length)];
    } while (usedPhrases.has(phrase));
    
    usedPhrases.add(phrase);
    result += `_${phrase}`;
  }
  
  return result;
};

// Main function to expand a URL
export const expandUrl = async (originalUrl: string): Promise<string> => {
  // URL should already be normalized with protocol from the form
  const urlToExpand = originalUrl;
  
  // Generate a random part
  const randomPart = generateRandomString(8);
  
  // Create the expanded code with satirical phrases
  const expandedCode = addSatiricalPhrases(randomPart);
  
  // Build the expanded URL with the current domain
  const baseUrl = window.location.origin;
  const expandedPath = `/e/${expandedCode}`;

  // Store the mapping in AWS DynamoDB
  try {
    const id = generateRandomString(16); // Generate unique ID
    const created_at = new Date().toISOString();
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days from now
    
    await storeUrlMapping({
      id,
      original_url: urlToExpand,
      expanded_code: expandedCode,
      created_at,
      expires_at
    });
  } catch (error) {
    console.error("Error storing URL in database:", error);
    // Continue even if storage fails - we'll fall back to URL parsing
  }
  
  return `${baseUrl}${expandedPath}`;
};

// Generate random expiration date (7 days from now)
export const getExpirationDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Array of jokes about URL lengthening
const jokes = [
  "Your URL is now longer than most JavaScript frameworks' documentation.",
  "We took your perfectly fine URL and added a PhD dissertation's worth of characters.",
  "This URL is so long that by the time you finish typing it, three new JS frameworks will have been released.",
  "Your URL just applied for its own zip code and tax ID number.",
  "We've made your URL so unnecessarily complex that it counts as a security feature.",
  "This URL is longer than my attention span after 10 hours of debugging CSS.",
  "Your URL is now so long, Internet Explorer would have crashed just thinking about it.",
  "We've added so many characters, each one represents a minute of my life I'll never get back.",
  "This URL expansion is sponsored by people who think more is always better.",
  "Your short URL has been promoted to management - it now takes up more space and does less work.",
  "We've transformed your URL into the digital equivalent of a CVS receipt.",
  "Congratulations! Your URL now qualifies as a novel in some countries.",
  "404: Brevity not found.",
  "With this many characters, your URL is now technically a blockchain.",
  "Your URL has joined the 'more is more' philosophy, like npm_modules and electron apps."
];

// Get a random joke
export const getRandomJoke = (): string => {
  return jokes[Math.floor(Math.random() * jokes.length)];
};
