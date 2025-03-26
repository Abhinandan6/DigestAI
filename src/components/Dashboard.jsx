import React, { useEffect, useState } from 'react';
import { useAuthenticationStatus, useUserData } from '@nhost/react';
import { SearchBar } from './SearchBar';
import { NewsCard } from './NewsCard';
import newsService from '../utils/newsService';

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const user = useUserData();
  const [news, setNews] = useState([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNews();
    }
  }, [isAuthenticated, user]);

  const fetchNews = async () => {
    try {
      setIsLoadingNews(true);
      setError(null);
      
      const result = await newsService.getNewsForUser();
      
      if (result.success && result.articles) {
        setNews(result.articles);
      } else {
        setError('Failed to load news');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('An error occurred while fetching news');
    } finally {
      setIsLoadingNews(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setIsLoadingNews(true);
      setError(null);
      
      const result = await newsService.getNewsForUser({
        topic: query,
        keywords: [query]
      });
      
      if (result.success && result.articles) {
        setNews(result.articles);
      } else {
        setError('No results found');
      }
    } catch (err) {
      console.error('Error searching news:', err);
      setError('An error occurred while searching');
    } finally {
      setIsLoadingNews(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Your News Dashboard</h1>
        <p className="text-gray-400">Stay updated with the latest news tailored to your interests</p>
      </div>
      
      <SearchBar onSearch={handleSearch} />
      
      {isLoadingNews ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-green"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900 text-white p-4 rounded-md mt-4">
          {error}
        </div>
      ) : news.length === 0 ? (
        <div className="bg-navy-800 p-6 rounded-lg mt-4 text-center">
          <p className="text-gray-400">No news articles found. Try updating your preferences or search for a different topic.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {news.map((article, index) => (
            <NewsCard 
              key={article.id || index}
              title={article.title}
              summary={article.summary}
              sentiment={article.sentiment}
              source={article.source}
              url={article.url}
              publishedAt={article.publishedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;