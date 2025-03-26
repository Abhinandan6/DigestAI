import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import { useUserId } from '@nhost/react';
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
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const userId = useUserId();

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
    variables: { userId },
    skip: !userId,
  });

  // Query to get articles
  const { data, error, fetchMore } = useQuery(gql`
    query GetArticles($topic: String!, $offset: Int!, $limit: Int!, $search) {
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
      topic,
      offset: (page - 1) * 12,
      limit,
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
      const formattedNews = articlesData.articles.map((article) => ({
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };
  
  const handleCategoryChange = (newCategory) => {
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
  // Update handleRefreshNews to use userId
  const handleRefreshNews = async () => {
    if (userId) {
      try {
        setLoading(true);
        await refreshUserNews(userId);
        // Refetch articles after refresh
        fetchMore({
          variables: {
            offset,
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
    
      
        
          
            
              
              NewsFlow
            
            
              
                {loading ? 'Refreshing...' : 'Refresh News'}
              
              
                Preferences
              
               nhost.auth.signOut()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign Out
              
            
          
        
      

      
        
        
        {error && (
          
            {error}
          
        )}

        
          {news.map((item, index) => (
            
          ))}
        

        {loading && (
          
            
          
        )}

        {!loading && hasMore && (
          
            
              Load More
            
          
        )}
      
    
  );
};

export default Dashboard;