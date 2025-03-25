import { gql } from '@apollo/client';
import apolloClient from './apollo';
import nhost from './nhost';

// Function to get the current auth token
const getAuthToken = () => {
  // Try to get the token from the nhost client
  try {
    return nhost.auth.getSession?.()?.accessToken || '';
  } catch (error) {
    console.error('Error getting auth token:', error);
    return '';
  }
};

// Function to get news using Hasura action
export const fetchNews = async (
  category: string,
  searchQuery: string,
  page: number,
  limit: number = 12
) => {
  // For now, let's implement a direct API call that will be replaced with Hasura action later
  const API_KEY = 'df7e9347dc71415b82160affe705c62a';
  const API_URL = 'https://newsapi.org/v2/top-headlines';
  
  const params = new URLSearchParams({
    apiKey: API_KEY,
    country: 'us',
    category: category,
    q: searchQuery,
    pageSize: limit.toString(),
    page: page.toString()
  });

  const response = await fetch(`${API_URL}?${params}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  
  const data = await response.json();
  
  // Format the response according to your NewsItem type
  return data.articles.map((item: any) => ({
    title: item.title,
    description: item.description || 'No description available',
    url: item.url,
    image: item.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80',
    category: category,
    published_at: item.publishedAt
  }));
  
  // Later, this will be replaced with a GraphQL query to your Hasura action
  /*
  const GET_NEWS = gql`
    query GetNews($category: String!, $searchQuery: String!, $page: Int!, $limit: Int!) {
      getNews(category: $category, searchQuery: $searchQuery, page: $page, limit: $limit) {
        title
        description
        url
        image
        category
        published_at
      }
    }
  `;

  const { data } = await apolloClient.query({
    query: GET_NEWS,
    variables: {
      category,
      searchQuery,
      page,
      limit
    },
    context: {
      headers: {
        Authorization: `Bearer ${nhost.auth.getAccessToken()}`
      }
    }
  });
  
  return data.getNews;
  */
};

// Function to update user preferences
export const updateUserPreferences = async (
  userId: string,
  categories: string[],
  sources: string[],
  keywords: string[]
) => {
  const UPDATE_PREFERENCES = gql`
    mutation UpdateUserPreferences(
      $userId: uuid!, 
      $categories: jsonb, 
      $sources: jsonb, 
      $keywords: jsonb
    ) {
      updateUserPreferences(
        userId: $userId, 
        categories: $categories, 
        sources: $sources, 
        keywords: $keywords
      ) {
        success
        message
      }
    }
  `;

  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_PREFERENCES,
      variables: {
        userId,
        categories,
        sources,
        keywords
      },
      context: {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`
        }
      }
    });
    
    return data.updateUserPreferences;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};