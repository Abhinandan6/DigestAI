// First, let's create the Debug component
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { NewsCard } from './components/NewsCard';
import type { NewsItem, NewsCategory } from './types';
import { NhostProvider, useAuthenticated, useAuthLoading, useUserId } from '@nhost/react';
import { NhostApolloProvider } from '@nhost/react-apollo';
import nhost from './utils/nhost';
import { gql, useQuery } from '@apollo/client';

// Components for authentication and preferences
import Login from './components/Login';
import Register from './components/Register';
import UserPreferences from './components/UserPreferences';
import Debug from './components/Debug';
import ErrorBoundary from './components/ErrorBoundary';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthenticated();
  const isLoading = useAuthLoading();

  if (isLoading) {
    return <div className="flex justify-center items-center h-32 mt-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Update Dashboard component to use useUserId
const Dashboard = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<NewsCategory>('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const userId = useUserId();

  // Update query to use userId
  const { data: preferencesData } = useQuery(gql`
    query GetUserPreferences($userId: uuid!) {
      user_preferences(where: {user_id: {_eq: $userId}}) {
        topic
        keywords
        preferred_sources
      }
    }
  `, {
    variables: { userId },
    skip: !userId,
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
        content: article.content,
        source: article.source,
        url: article.url,
        image: `https://source.unsplash.com/random/800x600?${article.topics[0] || 'news'}`,
        category: article.topics[0] || category,
        published_at: article.published_at,
        topics: article.topics,
        processed_articles: article.processed_articles
      }));
      
      setNews(page === 1 ? formattedNews : [...news, ...formattedNews]);
      setHasMore(formattedNews.length === 12);
      setLoading(false);
    }
  }, [articlesData, category, page]);

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

  // Rest of the component with UI for displaying news
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
              <Link to="/preferences" className="text-blue-400 hover:text-blue-300">
                Preferences
              </Link>
              <button 
                onClick={async () => {
                  await nhost.auth.signOut();
                  window.location.href = '/login';
                }}
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
              onClick={loadMore} // Changed from setPage(p => p + 1) to loadMore
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

// In your App function, update the NhostProvider usage
function App() {
  // Add a check to ensure nhost is properly initialized before rendering providers
  if (!nhost) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <NhostProvider nhost={nhost}>
        <NhostApolloProvider nhost={nhost}>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/debug" element={<Debug />} />
              {/* Temporarily commenting out the N8nTest route that's causing errors */}
              {/* <Route path="/n8n-test" element={
                <ErrorBoundary>
                  <N8nTest />
                </ErrorBoundary>
              } /> */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/preferences" 
                element={
                  <ProtectedRoute>
                    <UserPreferences />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
        </NhostApolloProvider>
      </NhostProvider>
    </ErrorBoundary>
  );
}

export default App;