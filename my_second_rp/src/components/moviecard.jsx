import React from 'react';

const MovieCard = ({ movie, funkyRank }) => {
  const {
    Title,
    Poster,
    imdbRating,
    Genre,
    Released
  } = movie;

  return (
    <div className="relative movie-card bg-white/5 backdrop-blur-md border border-purple-500/40 rounded-xl shadow-md p-4 text-white hover:scale-[1.02] hover:shadow-purple-500/40 transition-transform duration-300">
      
      {/* 🔢 Funky rank bubble */}
      {funkyRank && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
          {funkyRank}
        </div>
      )}

      <div className="w-full h-[400px] flex items-center justify-center mb-4">
        <img
          src={Poster !== 'N/A' ? Poster : './no-movie.png'}
          alt={Title}
          className="max-h-full object-contain rounded shadow-md"
        />
      </div>

      <h2 className="text-lg font-semibold text-white mb-1">{Title}</h2>

      {imdbRating && imdbRating !== 'N/A' && (
        <p className="text-yellow-400 font-medium text-sm mb-1">
          ⭐ {imdbRating}/10
        </p>
      )}

      {Genre && Genre !== 'N/A' && (
        <p className="text-xs text-purple-200 italic mb-1">{Genre}</p>
      )}

      {Released && Released !== 'N/A' && (
        <p className="text-xs text-gray-400">📅 {Released}</p>
      )}
    </div>
  );
};

export default MovieCard;
