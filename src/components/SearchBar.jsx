import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

export const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [mockResults, setMockResults] = useState(null);
  const [showMockCards, setShowMockCards] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (query.trim()) {
      // Generate mock results for preview
      generateMockResults(query);
      setShowMockCards(true);
      
      // Also call the parent's onSearch function
      onSearch(query);
    }
  };

  const generateMockResults = (searchQuery) => {
    // Create two mock cards related to the search query
    const results = [
      {
        id: `preview-${searchQuery}-1`,
        title: `Latest News about ${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}`,
        summary: `Recent developments and updates related to ${searchQuery} that are making headlines around the world.`,
        source: 'News Preview',
        publishedAt: new Date().toISOString(),
        url: `https://news.google.com/search?q=${encodeURIComponent(searchQuery)}&hl=en-US`,
        image: getSearchImage(searchQuery, 0)
      },
      {
        id: `preview-${searchQuery}-2`,
        title: `${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}: Analysis and Insights`,
        summary: `Expert analysis and in-depth coverage of ${searchQuery} with perspectives from industry leaders and specialists.`,
        source: 'Analysis Preview',
        publishedAt: new Date().toISOString(),
        url: `https://news.google.com/search?q=${encodeURIComponent(searchQuery)}+analysis&hl=en-US`,
        image: getSearchImage(searchQuery, 1)
      }
    ];
    
    setMockResults(results);
  };

  const getSearchImage = (query, index) => {
    // Map common search terms to specific images
    const searchImages = {
      'ipl': [
        'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg',
        'https://images.pexels.com/photos/3659864/pexels-photo-3659864.jpeg'
      ],
      'ai': [
        'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
        'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg'
      ],
      'tech': [
        'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
        'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg'
      ],
      'anime': [
        'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg',
        'https://images.pexels.com/photos/5011653/pexels-photo-5011653.jpeg'
      ],
      'marvel': [
        'https://images.pexels.com/photos/9611960/pexels-photo-9611960.jpeg',
        'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'
      ]
    };

    // Default images if no specific images for the search term
    const defaultImages = [
      'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg',
      'https://images.pexels.com/photos/3944454/pexels-photo-3944454.jpeg'
    ];

    const lowerQuery = query.toLowerCase();
    const images = searchImages[lowerQuery] || defaultImages;
    return images[index % images.length];
  };

  const clearMockResults = () => {
    setShowMockCards(false);
    setMockResults(null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for news..."
            className="w-full px-4 py-2 bg-navy-700 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </form>

      {/* Preview Mock Cards */}
      {showMockCards && mockResults && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-medium">Preview Results</h3>
            <button 
              onClick={clearMockResults}
              className="text-sm text-gray-400 hover:text-white"
            >
              Clear preview
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {mockResults.map(result => (
              <div key={result.id} className="bg-navy-800 rounded-lg overflow-hidden shadow-lg border border-navy-600">
                <div className="h-48 bg-navy-700 flex items-center justify-center">
                  <img 
                    src={result.image} 
                    alt={result.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg';
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium bg-pista-600/20 text-pista-400 px-2 py-1 rounded">
                      Search Result
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(result.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{result.title}</h4>
                  <p className="text-gray-400 text-sm mb-3">{result.summary}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{result.source}</span>
                    <a 
                      href={result.url}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      Preview on Google News
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};