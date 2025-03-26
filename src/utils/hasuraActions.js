import { gql } from '@apollo/client';
import apolloClient from './apollo';
import nhost from './nhost';

// Function to get the current auth token
const getAuthToken = () => {
  try {
    return nhost.auth.getSession()?.accessToken || '';
  } catch (error) {
    console.error('Error getting auth token:', error);
    return '';
  }
};

// Function to get news using Hasura GraphQL
export const fetchNews = async (
  category,
  searchQuery,
  page,
  limit = 12
) => {
  const GET_NEWS = gql`
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
  `;

  try {
    const { data } = await apolloClient.query({
      query,
      variables: {
        topic,
        offset: (page - 1) * limit,
        limit,
        search: searchQuery ? `%${searchQuery}%` : '%%'
      }
    });

    return data.articles.map((article) => ({
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
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

// Function to update user preferences
export const updateUserPreferences = async (
  userId,
  categories,
  sources,
  keywords
) => {
  const UPDATE_PREFERENCES = gql`
    mutation UpdateUserPreferences(
      $userId: uuid!, 
      $categories, 
      $sources, 
      $keywords) {
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
      mutation,
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