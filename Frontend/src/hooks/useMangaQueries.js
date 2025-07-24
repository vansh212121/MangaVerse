import { useQuery } from '@tanstack/react-query';
import * as api from '../lib/apiService';

// Note: We are using the same query keys as the function names for consistency.

/**
 * Hook to fetch detailed information for a single manga.
 * @param {number} mal_id - The MyAnimeList ID of the manga.
 */
export const useMangaDetails = (mal_id) => useQuery({
  queryKey: ['mangaDetails', mal_id],
  queryFn: api.fetchMangaDetails,
  // This query will not run until a mal_id is provided.
  enabled: !!mal_id, 
});

/**
 * Hook to search for manga.
 * @param {string} query - The search term.
 */
export const useMangaSearch = (query) => useQuery({
  queryKey: ['searchManga', query],
  queryFn: api.searchManga,
  // This query will not run until the user has typed something.
  enabled: !!query,
});

/**
 * Hook to fetch the list of top manga.
 * @param {string|null} filter - Optional filter ('favorite', 'upcoming').
 */
export const useTopManga = (filter = null) => useQuery({
  queryKey: ['topManga', filter],
  queryFn: api.fetchTopManga,
});

/**
 * Hook to fetch recommended manga.
 */
export const useRecommendedManga = () => useQuery({
  queryKey: ['recommendedManga'],
  queryFn: api.fetchRecommendedManga,
});

/**
 * Hook to fetch manga by a specific genre.
 * @param {number} genreId - The ID of the genre.
 */
export const useMangaByGenre = (genreId) => useQuery({
    queryKey: ['mangaByGenre', genreId],
    queryFn: api.fetchMangaByGenre,
    enabled: !!genreId,
});

/**
 * Hook to fetch the latest manga news.
 */
export const useNews = () => useQuery({
    queryKey: ['news'],
    queryFn: api.fetchNews,
    // The 'select' option has been removed.
});

/**
 * Hook to fetch the paginated manga list for the catalog.
 * @param {number} page - The current page number.
 */
export const usePaginatedManga = (page) => useQuery({
    queryKey: ['paginatedManga', page],
    queryFn: api.fetchPaginatedManga,
    // This keeps the data from the previous page visible while the new page is loading.
    keepPreviousData: true, 
});
