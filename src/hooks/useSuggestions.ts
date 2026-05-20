import { useEffect, useState } from 'react';
import { db, Article } from '@/lib/db';

/**
 * Custom React hook for fetching article suggestions based on user input
 * 
 * This hook provides intelligent suggestions by:
 * 1. Searching for articles that start with the query string
 * 2. Sorting results by frequency (most frequently used articles first)
 * 3. Limiting results to avoid overwhelming the UI
 * 4. Handling loading states and errors gracefully
 * 
 * Use Case:
 * - User types "P" in the input field
 * - Hook searches for all articles starting with "P"
 * - Returns top 5 most frequently used articles (e.g., "Pain", "Pâtes", "Pommes")
 * - UI displays these as clickable suggestions
 * 
 * Performance:
 * - Uses IndexedDB indexes for fast queries
 * - Case-insensitive search for better UX
 * - Debounced by React's useEffect (won't query on every keystroke if query doesn't change)
 * 
 * @param query - The search string from user input (e.g., "P", "Pain", "Pa")
 * @param limit - Maximum number of suggestions to return (default: 5)
 * @returns Object containing:
 *   - suggestions: Array of Article objects matching the query
 *   - loading: Boolean indicating if query is in progress
 */
export function useSuggestions(query: string, limit: number = 5) {
  // State to store the fetched suggestions
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  
  // State to track loading status for UI feedback
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Early return if query is too short (don't search for empty or single character)
    // This prevents unnecessary database queries and improves performance
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }

    // Async function to fetch suggestions from IndexedDB
    const fetchSuggestions = async () => {
      setLoading(true); // Set loading state to true for UI feedback
      
      try {
        // Query the IndexedDB articles table
        // where('name'): Search in the name field
        // startsWithIgnoreCase(query): Case-insensitive prefix match
        // sortBy('frequency'): Sort by frequency field (ascending)
        // reverse(): Reverse to get highest frequency first
        // slice(0, limit): Take only the top N results
        const allArticles = await db.articles.toArray();
        const matches = allArticles
          .filter((a) => a.name.toLowerCase().startsWith(query.toLowerCase()))
          .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
          .slice(0, limit);
        
        // Update state with the fetched suggestions
        setSuggestions(matches);
      } catch (error) {
        // Log error for debugging (shouldn't happen in normal operation)
        console.error('Error fetching suggestions:', error);
        // Set empty array on error to prevent UI from showing stale data
        setSuggestions([]);
      } finally {
        // Always set loading to false, regardless of success or failure
        setLoading(false);
      }
    };

    // Execute the fetch function
    fetchSuggestions();
  }, [query, limit]); // Re-run effect when query or limit changes

  // Return the suggestions and loading state to the component
  return { suggestions, loading };
}

/**
 * Increment the frequency counter for an article
 * 
 * This function is called whenever an article is added to a shopping list.
 * It tracks how often each article is used to enable intelligent suggestions.
 * 
 * Frequency Tracking Strategy:
 * - Each time an article is used, increment its frequency counter
 * - Update the lastSeen timestamp to track recent usage
 * - This data is used by useSuggestions to sort results by popularity
 * 
 * Use Case:
 * - User adds "Cristaline" to a list
 * - Function increments frequency from 5 to 6
 * - Next time user types "C", "Cristaline" appears higher in suggestions
 * 
 * Performance:
 * - Single IndexedDB update operation (fast)
 * - Uses indexed field 'frequency' for efficient sorting
 * 
 * @param articleId - The unique ID of the article to increment
 */
export async function incrementArticleFrequency(articleId: string) {
  try {
    // Fetch the current article data from IndexedDB
    const article = await db.articles.get(articleId);
    
    // Only update if article exists (defensive programming)
    if (article) {
      // Update the article with:
      // - frequency: Increment current value (or start at 1 if undefined)
      // - lastSeen: Update timestamp to track when this was last used
      await db.articles.update(articleId, {
        frequency: (article.frequency || 0) + 1,
        lastSeen: new Date(),
      });
    }
  } catch (error) {
    // Log error for debugging (shouldn't happen in normal operation)
    console.error('Error incrementing frequency:', error);
    // Fail silently - frequency tracking is not critical for app functionality
  }
}
