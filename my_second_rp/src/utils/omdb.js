const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

/**
 * Search for movies by a keyword (title or part of it)
 * @param {string} keyword - The keyword to search for
 * @param {number} page - Optional page number (for pagination)
 * @returns {Array} - Array of basic movie info (no full detail)
 */
export const searchMoviesByKeyword = async (keyword, page = 1) => {
  try {
    const url = `${OMDB_BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(keyword)}&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True" && data.Search) {
      return data.Search;
    }

    console.warn("No search results:", data?.Error || "Unknown error");
    return [];
  } catch (error) {
    console.error("🔴 OMDB Search Error:", error);
    return [];
  }
};

/**
 * Fetch full movie details by its exact title
 * @param {string} title - Movie title
 * @returns {Object|null} - Full movie object or null
 */
export const fetchMovieByTitle = async (title) => {
  try {
    const url = `${OMDB_BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      return data;
    }

    console.warn(`No movie found with title "${title}":`, data?.Error || "Unknown error");
    return null;
  } catch (error) {
    console.error("🔴 OMDB Fetch by Title Error:", error);
    return null;
  }
};

/**
 * Fetch full movie details by IMDb ID (useful for future expansion)
 * @param {string} imdbID - The IMDb ID of the movie
 * @returns {Object|null} - Full movie object or null
 */
export const fetchMovieById = async (imdbID) => {
  try {
    const url = `${OMDB_BASE_URL}?apikey=${API_KEY}&i=${imdbID}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      return data;
    }

    console.warn(`No movie found with IMDb ID "${imdbID}":`, data?.Error || "Unknown error");
    return null;
  } catch (error) {
    console.error("🔴 OMDB Fetch by ID Error:", error);
    return null;
  }
};
