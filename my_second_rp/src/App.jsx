import React, { useState, useEffect } from 'react';
import Search from './components/Search';
import MovieCard from './components/moviecard';
import Spinner from './components/Spinner';
import { searchMoviesByKeyword, fetchMovieByTitle } from './utils/omdb';
import { client } from './utils/appwriteconfig';
import { trackMovieSearch, getTop3SearchedMovies } from './utils/tracksearch';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topMovies, setTopMovies] = useState([]);

  const defaultTitles = [
    'Inception', 'Dune', 'The Matrix', 'Interstellar', 'Oppenheimer',
    'The Batman', 'Fight Club', 'Parasite', 'Joker', 'Tenet',
    'The Godfather', 'The Dark Knight', 'Avengers: Endgame',
    'Gladiator', 'The Shawshank Redemption', 'Barbie',
    'John Wick', 'La La Land', 'The Prestige', 'Pulp Fiction',
    '1917', 'Arrival', 'Whiplash', 'Ford v Ferrari', 'Mad Max: Fury Road'
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.trim() === '') {
        fetchDefaultMovies();
      } else {
        fetchMoviesBySearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const fetchMoviesBySearch = async (term) => {
    setIsLoading(true);
    const basicResults = await searchMoviesByKeyword(term);
    const fullResults = await Promise.all(
      basicResults.map((movie) => fetchMovieByTitle(movie.Title))
    );
    const filtered = fullResults.filter((movie) => movie !== null);
    setMovies(filtered);

    if (filtered.length > 0) {
      await trackMovieSearch(term);
      await fetchTop3Movies();
    }

    setIsLoading(false);
  };

  const fetchDefaultMovies = async () => {
    setIsLoading(true);
    const fetchedMovies = await Promise.all(
      defaultTitles.map(title => fetchMovieByTitle(title))
    );
    setMovies(fetchedMovies.filter(movie => movie !== null));
    setIsLoading(false);
  };

  const fetchTop3Movies = async () => {
    try {
      const topMovies = await getTop3SearchedMovies();
      console.log("🎥 Full movie details for top titles:", topMovies);
      setTopMovies(topMovies);
    } catch (err) {
      console.error("❌ Error fetching top 3 searched movies:", err);
    }
  };

  useEffect(() => {
    fetchDefaultMovies(); // Initial load
    fetchTop3Movies();    // Trending section

    try {
      client.headers;
      console.log("✅ Appwrite connected successfully!");
    } catch (err) {
      console.error("❌ Appwrite connection failed:", err);
    }
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without Hassle
          </h1>
        </header>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* 🔥 Top 3 Most Searched Section */}
        <section className="mt-12 mb-12">
          <h2 className="text-white text-2xl font-bold mb-4">🔥 Top 3 Most Searched</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {topMovies.length > 0 ? (
              topMovies.map((movie, index) => (
                <MovieCard key={movie.imdbID} movie={movie} funkyRank={index + 1} />
              ))
            ) : (
              <p className="text-gray-400 col-span-full text-center mt-4">
                No trending movies yet. Try searching some!
              </p>
            )}
          </div>
        </section>

        {/* 🎞️ All Movies Section */}
        <div className="mt-12">
          {searchTerm.trim() === '' && (
            <h2 className="text-white text-2xl font-semibold mb-6">🎞️ All Movies</h2>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {isLoading ? (
              <Spinner />
            ) : movies.length > 0 ? (
              movies.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))
            ) : (
              <p className="text-white text-center col-span-full">
                No results found for "{searchTerm}"
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;
