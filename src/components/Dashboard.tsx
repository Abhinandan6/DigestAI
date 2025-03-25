import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import { useUserData } from '@nhost/react';
import { gql, useQuery } from '@apollo/client';
import { refreshUserNews } from '../utils/n8nService';
import nhost from '../utils/nhost';
import { SearchBar } from '../components/SearchBar';
import { NewsCard } from '../components/NewsCard';
import { NewsCategory } from '../types'; // Import the NewsCategory type

// First, let's create the types file
// Create this file: e:\3.ABHI-ELEMENTS\SOLO-LVLNG\Projects\project\src\types.ts

// Main dashboard component
const Dashboard = () => {
  const [news, setNews] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  // Change the type from string to NewsCategory
  const [category, setCategory] = useState<NewsCategory>('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const user = useUserData();

  // Query to get user preferences
  const { data: preferencesData } = useQuery(gql`
    query GetUserPreferences($userId: uuid!) {
      user_preferences(where: {user_id: {_eq: $userId}}) {
        topic
        keywords
        preferred_sources
      }
    }
  `, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  // Query to get articles
  const { data: articlesData, error: articlesError, fetchMore } = useQuery(gql`
    query GetArticles($topic: String!, $offset: Int!, $limit: Int!, $search: String) {
      articles(
        where: {
          topics: {_contains: [$topic]}, 
          _and: [
            { title: { _ilike: $search } }
          ]
        }, 
        order_by: {published_at: desc},
        offset: $offset,
        limit: $limit
      ) {
        id
        title
        content
        source
        published_at
        url
        topics
        processed_articles {
          summary
          sentiment
        }
      }
    }
  `, {
    variables: { 
      topic: category,
      offset: (page - 1) * 12,
      limit: 12,
      search: searchQuery ? `%${searchQuery}%` : '%%'
    },
    fetchPolicy: "network-only"
  });

  // Set initial category from user preferences
  useEffect(() => {
    if (preferencesData?.user_preferences?.length > 0) {
      const prefs = preferencesData.user_preferences[0];
      setCategory(prefs.topic.toLowerCase() as NewsCategory);
    }
  }, [preferencesData]);

  // Format articles data
  useEffect(() => {
    if (articlesData?.articles) {
      const formattedNews = articlesData.articles.map((article: any) => ({
        id: article.id,
        title: article.title,
        description: article.processed_articles?.[0]?.summary || article.content.substring(0, 150) + '...',
        url: article.url,
        image: `https://source.unsplash.com/random/800x600?${article.topics[0] || 'news'}`,
        category: article.topics[0] || category,
        published_at: article.published_at
      }));
      
      setNews(page === 1 ? formattedNews : [...news, ...formattedNews]);
      setHasMore(formattedNews.length === 12);
      setLoading(false);
    }
  }, [articlesData, category, page, news]);

  // Handle errors
  useEffect(() => {
    if (articlesError) {
      setError(articlesError.message);
      setLoading(false);
    }
  }, [articlesError]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };
  
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory as NewsCategory);
    setPage(1);
  };

  const loadMore = () => {
    fetchMore({
      variables: {
        offset: page * 12,
      },
    });
    setPage(p => p + 1);
  };

  // Add this function to your Dashboard component
  const handleRefreshNews = async () => {
    if (user?.id) {
      try {
        setLoading(true);
        await refreshUserNews(user.id);
        // Refetch articles after refresh
        fetchMore({
          variables: {
            offset: 0,
          },
        });
        setPage(1);
      } catch (error) {
        console.error('Error refreshing news:', error);
        setError('Failed to refresh news. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-gray-100">
      <header className="py-6 border-b border-navy-700 sticky top-0 bg-navy-900/95 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Newspaper className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-bold">NewsFlow</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefreshNews}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-4"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh News'}
              </button>
              <Link to="/preferences" className="text-blue-400 hover:text-blue-300">
                Preferences
              </Link>
              <button 
                onClick={() => nhost.auth.signOut()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SearchBar 
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          selectedCategory={category}
        />
        
        {error && (
          <div className="text-red-500 text-center mb-8 p-4 bg-navy-800 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <NewsCard key={index} {...item} />
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center h-32 mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors font-medium"
            >
              Load More
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;