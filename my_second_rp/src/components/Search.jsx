import React from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mt-8 flex justify-center">
      <div className="relative w-full max-w-2xl">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <img src="./search.svg" alt="Search Icon" className="w-5 h-5 text-purple-400" />
        </div>

        {/* Input Box */}
        <input
          type="text"
          placeholder="Search through thousands of movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1e1e2e] text-white placeholder-gray-400 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-md"
        />
      </div>
    </div>
  );
};

export default Search;
