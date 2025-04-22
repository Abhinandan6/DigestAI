import React, { useState, useEffect } from 'react';
import { getUserNews, searchNews } from '../utils/n8nservice';
import nhost from '../utils/nhost';
import { SearchBar } from './SearchBar';
import { ExternalLink } from 'lucide-react';
// Remove UserPreferences import for now
// import UserPreferences from './userpreferences';

const Dashboard = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false); // Add this state
  
  const categories = [
    'general', 'business', 'technology', 'entertainment', 
    'sports', 'science', 'health', 'politics', 'world'
  ];

  useEffect(() => {
    fetchNews(activeCategory);
  }, [activeCategory]);

  const fetchNews = async (category) => {
    setLoading(true);
    setError(null);
    
    try {
      const userId = nhost.auth.getUser()?.id || 'anonymous';
      const preferences = { topic: category };
      
      const result = await getUserNews(userId, preferences);
      
      if (result.success) {
        setNews(result.data.articles);
      } else {
        setError(result.message || 'Failed to load news');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('An error occurred while fetching news');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query || query.trim() === '') {
      // If search is cleared, go back to regular category news
      fetchNews(activeCategory);
      setIsSearching(false);
      setSearchQuery('');
      return;
    }
    
    console.log(`Searching for: "${query}" in category: ${activeCategory}`);
    setLoading(true);
    setError(null);
    setSearchQuery(query);
    setIsSearching(true);
    
    try {
      const userId = nhost.auth.getUser()?.id || 'anonymous';
      const result = await searchNews(userId, query, activeCategory);
      
      if (result.success && result.data && result.data.articles && result.data.articles.length > 0) {
        console.log(`Found ${result.data.articles.length} search results`);
        setNews(result.data.articles);
      } else {
        console.log('No search results found');
        setError(`No results found for "${query}". Try a different search term.`);
        setNews([]);
      }
    } catch (err) {
      console.error('Error searching news:', err);
      setError('An error occurred while searching news');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  // Add the handleCategoryChange function here, outside of the JSX
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Function to get a real news URL based on the source and category
  const getRealNewsUrl = (source, category, title, url) => {
    // If we have a real URL from the API, use it
    if (url && url.startsWith('http')) {
      return url;
    }
    
    // Otherwise, create a search-friendly version of the title
    const searchQuery = encodeURIComponent(title);
    
    // Direct search URLs for different categories
    const categorySearchUrls = {
      'technology': `https://news.google.com/search?q=${searchQuery}+technology&hl=en-US`,
      'business': `https://news.google.com/search?q=${searchQuery}+business&hl=en-US`,
      'general': `https://news.google.com/search?q=${searchQuery}&hl=en-US`,
      'entertainment': `https://news.google.com/search?q=${searchQuery}+entertainment&hl=en-US`,
      'sports': `https://news.google.com/search?q=${searchQuery}+sports&hl=en-US`,
      'science': `https://news.google.com/search?q=${searchQuery}+science&hl=en-US`,
      'health': `https://news.google.com/search?q=${searchQuery}+health&hl=en-US`,
      'politics': `https://news.google.com/search?q=${searchQuery}+politics&hl=en-US`,
      'world': `https://news.google.com/search?q=${searchQuery}+world+news&hl=en-US`
    };
    
    return categorySearchUrls[category] || `https://news.google.com/search?q=${searchQuery}&hl=en-US`;
  };

  // Function to get a reliable image URL based on category
  const getImageUrl = (category, index) => {
    // Use a set of reliable placeholder images based on category
    const categoryImages = {
      'technology': [
        'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
        'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg',
        'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg'
      ],
      'business': [
        'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
        'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
        'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg'
      ],
      'general': [
        'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg',
        'https://images.pexels.com/photos/3944454/pexels-photo-3944454.jpeg',
        'https://images.pexels.com/photos/3944377/pexels-photo-3944377.jpeg'
      ],
      'entertainment': [
        'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
        'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
        'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg'
      ],
      'sports': [
        'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
        'https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg',
        'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg'
      ],
      'science': [
        'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg',
        'https://images.pexels.com/photos/3735709/pexels-photo-3735709.jpeg',
        'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg'
      ],
      'health': [
        'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
        'https://images.pexels.com/photos/4047186/pexels-photo-4047186.jpeg',
        'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg'
      ],
      'politics': [
        'https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg',
        'https://images.pexels.com/photos/4669107/pexels-photo-4669107.jpeg',
        'https://images.pexels.com/photos/4669136/pexels-photo-4669136.jpeg'
      ],
      'world': [
        'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg',
        'https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg',
        'https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg'
      ]
    };
    
    // Default images if category not found
    const defaultImages = [
      'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg',
      'https://images.pexels.com/photos/3944454/pexels-photo-3944454.jpeg',
      'https://images.pexels.com/photos/3944377/pexels-photo-3944377.jpeg'
    ];
    
    const images = categoryImages[category] || defaultImages;
    return images[index % images.length];
  };

  // Add the handlePreferencesSave function inside the component
  const handlePreferencesSave = async (newPreferences) => {
    setShowPreferences(false);
    setLoading(true);
    
    try {
      // Get the user ID
      const userId = nhost.auth.getUser()?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Fetch news with the new preferences
      const result = await getUserNews(userId, newPreferences);
      
      if (result.success) {
        setNews(result.data.articles || []);
        setActiveCategory(newPreferences.topic || 'general');
      } else {
        setError(result.message || 'Failed to fetch news with new preferences');
      }
    } catch (err) {
      console.error('Error applying preferences:', err);
      setError('Failed to apply preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Remove the preferences button and simplify header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Your News Dashboard</h1>
        <p className="text-gray-300 mt-2">Stay updated with the latest news tailored to your interests</p>
      </div>
      
      {/* Update the SearchBar component with category buttons */}
      <div className="bg-navy-800 p-6 rounded-lg shadow-lg mb-8">
        <SearchBar onSearch={handleSearch} />
        
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-navy-700 text-gray-300 hover:bg-navy-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Remove the "Showing results for" section */}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-green"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      ) : news.length === 0 ? (
        <div className="bg-navy-800 p-6 rounded-lg text-center">
          <p className="text-gray-400">No news articles found for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((article, index) => (
            <div key={article.id || index} className="bg-navy-800 rounded-lg overflow-hidden shadow-lg border border-navy-600 hover:shadow-xl transition-shadow">
              <div className="h-48 bg-navy-700 flex items-center justify-center">
                <img 
                  src={getImageUrl(activeCategory, index)} 
                  alt={article.title}
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
                    {isSearching ? 'Search Result' : activeCategory}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{article.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{article.summary}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{article.source}</span>
                  <a 
                    href={article.url || getRealNewsUrl(article.source, activeCategory, article.title)} 
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
      )}
      
      {/* Keep the preferences modal but it will only be accessible from the header nav */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl">
            <UserPreferences 
              onSave={handlePreferencesSave}
              onCancel={() => setShowPreferences(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;