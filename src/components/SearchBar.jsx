import React, { useState } from 'react';
import { Search } from 'lucide-react';

// Convert from TypeScript to JavaScript by removing type annotations
export const SearchBar = ({
  onSearch,
  onCategoryChange,
  selectedCategory
}) => {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <div className="bg-navy-800 p-4 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news..."
            className="w-full p-3 pl-10 bg-navy-700 border border-navy-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <button
            type="submit"
            className="absolute right-2 top-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['general', 'business', 'technology', 'entertainment', 'sports', 
            'science', 'health', 'politics', 'world'].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`px-3 py-1 rounded text-sm ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-navy-700 text-gray-300 hover:bg-navy-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};